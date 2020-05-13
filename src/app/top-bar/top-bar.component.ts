import { Component, OnInit, Input, ChangeDetectorRef } from '@angular/core';
import { TopBarService } from './top-bar.service';
import { ApiService } from '../core/api/api.service';
import { Statuses } from './statuses';
import { LoadingService } from '../core/loading/loading.service';
import { Observable, from, Subscription, interval, throwError, of, BehaviorSubject } from 'rxjs';
import * as signalR from '@microsoft/signalr';
import { map, catchError, flatMap, tap, finalize } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { JsonHubProtocol } from '@microsoft/signalr';

@Component({
  selector: 'app-top-bar',
  templateUrl: './top-bar.component.html',
  styleUrls: ['./top-bar.component.css'],
})
export class TopBarComponent implements OnInit {
  @Input()
  public title = 'No Title';
  public currentStatus: Statuses;
  public statusStr = 'Desligado';
  public saveEnabledChange$ = this.topBarService.saveEnabledChange();
  public showSuccessBg: boolean;
  public showDefaultBg: boolean;
  public showPrimaryBg: boolean;
  public showWarnBg: boolean;
  public showErrorBg: boolean;
  public saveBtnDisabled = true;
  public startSchedulerDisabled = true;
  public stopSchedulerDisabled = true;
  private statusHubReconnectSubscription: Subscription;
  private connectingToHub = false;

  constructor(
    private topBarService: TopBarService,
    private api: ApiService,
    private cdr: ChangeDetectorRef,
    private loadingChange: LoadingService
  ) {}

  ngOnInit() {
    this.saveEnabledChange$.subscribe((enabled) => {
      this.saveBtnDisabled = !enabled;
      this.cdr.markForCheck();
    });

    this.api.getExecutionStatus().subscribe((status) => {
      this.currentStatus = status.result.status;
      this.updateStatusDependencies(status.result.status);
    });

    this.subscribeToStatusHub().subscribe(
      (conn) => {
        this.statusHubChanged(conn);
      },
      (err) => {
        console.error(err);
        this.statusHubReconnectSubscription = interval(1000)
          .pipe(
            flatMap(() => {
              console.log('Trying to reconnect to status hub');
              return this.retryStatusHubConnection();
            })
          )
          .subscribe(() => this.statusHubReconnectSubscription.unsubscribe());
      }
    );
  }

  private retryStatusHubConnection(): Observable<void> {
    if (this.connectingToHub) {
      return of(undefined);
    }

    console.log('Retrying status hub connection');
    return this.subscribeToStatusHub().pipe(
      map((conn) => {
        this.statusHubChanged(conn);
      }),
      catchError((err) => {
        console.error(err);
        return this.retryStatusHubConnection();
      })
    );
  }

  private statusHubChanged(conn: signalR.HubConnection): void {
    conn.on('app-execution-status-changed', (status) => {
      this.updateStatusDependencies(status);
    });
    conn.onclose(() => this.updateStatusDependencies(Statuses.Offline));
    conn.onreconnecting(() => this.updateStatusDependencies(Statuses.Offline));
  }

  private subscribeToStatusHub(): Observable<signalR.HubConnection> {
    if (this.connectingToHub) {
      return of(undefined);
    }
    this.connectingToHub = true;
    const connection = new signalR.HubConnectionBuilder()
      .withUrl(`${environment.hubUrl}/execution-status`, signalR.HttpTransportType.WebSockets)
      .withAutomaticReconnect({
        nextRetryDelayInMilliseconds: () => 2000,
      } as signalR.IRetryPolicy)
      .configureLogging(signalR.LogLevel.Debug)
      .withHubProtocol(new JsonHubProtocol())
      .build();
    return from(connection.start()).pipe(
      map(() => {
        console.log('Status hub connection stabilished');
        connection.onclose(() => console.log('status hub connection closed'));
        connection.onreconnecting(() => console.log('status hub connection reconnecting'));
        connection.onreconnected(() => console.log('status hub connection reconnected'));
        return connection;
      }),
      finalize(() => (this.connectingToHub = false))
    );
  }

  public onStartSchedulerStart(): void {
    this.loadingChange.setLoading(true);
    this.api.startEmailScheduling().subscribe(() => this.loadingChange.setLoading(false));
  }

  public onStopSchedulerStart(): void {
    this.loadingChange.setLoading(true);
    this.api.stopEmailScheduling().subscribe(() => this.loadingChange.setLoading(false));
  }

  public onSaveClick(): void {
    this.topBarService.clickSave();
  }

  public disableSaveConfiguration(): boolean {
    return this.currentStatus === Statuses.SchedulerRunning;
  }

  private updateStatusDependencies(status: Statuses): void {
    this.stopSchedulerDisabled = true;
    this.startSchedulerDisabled = true;

    if (status === Statuses.Offline || status === 1) {
      this.statusStr = 'Servidor Offline';
      this.showDefaultBg = true;
      this.showErrorBg = false;
      this.showSuccessBg = false;
      this.showWarnBg = false;
      this.showPrimaryBg = false;
    }
    if (status === Statuses.Initializing || status === 2) {
      this.statusStr = 'Inicializando';
      this.showPrimaryBg = true;
      this.showDefaultBg = false;
      this.showErrorBg = false;
      this.showSuccessBg = false;
      this.showWarnBg = false;
    }
    if (status === Statuses.Online || status === 3) {
      this.statusStr = 'Servidor Online';
      this.stopSchedulerDisabled = true;
      this.startSchedulerDisabled = false;
      this.showSuccessBg = true;
      this.showErrorBg = false;
      this.showDefaultBg = false;
      this.showWarnBg = false;
      this.showPrimaryBg = false;
    }
    if (status === Statuses.SchedulerRunning || status === 4) {
      this.statusStr = 'Agendamento Online';
      this.stopSchedulerDisabled = false;
      this.startSchedulerDisabled = true;
      this.showSuccessBg = true;
      this.showErrorBg = false;
      this.showDefaultBg = false;
      this.showWarnBg = false;
      this.showPrimaryBg = false;
    }
    if (status === Statuses.Finalizing || status === 5) {
      this.statusStr = 'Finalizando';
      this.showErrorBg = true;
      this.showDefaultBg = false;
      this.showSuccessBg = false;
      this.showWarnBg = false;
      this.showPrimaryBg = false;
    }

    this.cdr.detectChanges();
  }
}
