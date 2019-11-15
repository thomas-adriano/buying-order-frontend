import { Component, OnInit, Input, ChangeDetectorRef } from '@angular/core';
import { TopBarService } from './top-bar.service';
import { ApiService } from '../core/api/api.service';
import { Statuses } from './statuses';
import { LoadingService } from '../core/loading/loading.service';

@Component({
  selector: 'app-top-bar',
  templateUrl: './top-bar.component.html',
  styleUrls: ['./top-bar.component.css']
})
export class TopBarComponent implements OnInit {
  @Input()
  public title = 'No Title';
  public statusStr = 'Desligado';
  public saveDisabledChange$ = this.topBarService.saveEnabledChange();
  public showSuccessBg: boolean;
  public showDefaultBg: boolean;
  public showPrimaryBg: boolean;
  public showWarnBg: boolean;
  public showErrorBg: boolean;
  public startSchedulerDisabled = true;
  public stopSchedulerDisabled = true;
  private reconnectInterval: any;

  constructor(
    private topBarService: TopBarService,
    private api: ApiService,
    private cdr: ChangeDetectorRef,
    private loadingChange: LoadingService
  ) {}

  ngOnInit() {
    this.createSocketConnection();
  }

  private createSocketConnection(): WebSocket {
    let socket = new WebSocket('ws://localhost:8989');
    socket.onopen = e => {
      console.log('[open] Connection established');
      clearInterval(this.reconnectInterval);
    };

    socket.onmessage = event => {
      this.updateStatusDependencies(event.data);
    };

    socket.onclose = event => {
      if (event.wasClean) {
        console.log(
          `[close] Connection closed cleanly, code=${event.code} reason=${event.reason}`
        );
      } else {
        console.warn('[close] Connection died', event);
      }
      socket = undefined;
      this.reconnectInterval = setInterval(() => {
        if (socket) {
          return;
        }
        socket = this.createSocketConnection();
      }, 5000);
    };

    socket.onerror = error => {
      console.error(`[error] ${error}`);
      socket.close();
    };

    return socket;
  }

  public onStartSchedulerStart(): void {
    this.loadingChange.setLoading(true);
    this.api
      .startEmailScheduling()
      .subscribe(() => this.loadingChange.setLoading(false));
  }

  public onStopSchedulerStart(): void {
    this.loadingChange.setLoading(true);
    this.api
      .stopEmailScheduling()
      .subscribe(() => this.loadingChange.setLoading(false));
  }

  public onSaveClick(): void {
    this.topBarService.clickSave();
  }

  private updateStatusDependencies(status: Statuses): void {
    this.stopSchedulerDisabled = true;
    this.startSchedulerDisabled = true;

    if (status === Statuses.INITIALIZING) {
      this.statusStr = 'Inicializando';
      this.showPrimaryBg = true;
      this.showDefaultBg = false;
      this.showErrorBg = false;
      this.showSuccessBg = false;
      this.showWarnBg = false;
    }
    if (status === Statuses.SERVER_RUNNING) {
      this.statusStr = 'Servidor Online';
      this.stopSchedulerDisabled = true;
      this.startSchedulerDisabled = false;
      this.showSuccessBg = true;
      this.showErrorBg = false;
      this.showDefaultBg = false;
      this.showWarnBg = false;
      this.showPrimaryBg = false;
    }
    if (status === Statuses.SCHEDULER_RUNNING) {
      this.statusStr = 'Agendamento Online';
      this.stopSchedulerDisabled = false;
      this.startSchedulerDisabled = true;
      this.showSuccessBg = true;
      this.showErrorBg = false;
      this.showDefaultBg = false;
      this.showWarnBg = false;
      this.showPrimaryBg = false;
    }
    if (status === Statuses.SERVER_ERROR) {
      this.statusStr = 'Erro no Servidor';
      this.showErrorBg = true;
      this.showDefaultBg = false;
      this.showSuccessBg = false;
      this.showWarnBg = false;
      this.showPrimaryBg = false;
    }
    if (status === Statuses.SCHEDULER_ERROR) {
      this.statusStr = 'Erro no Agendamento';
      this.showErrorBg = true;
      this.showDefaultBg = false;
      this.showSuccessBg = false;
      this.showWarnBg = false;
      this.showPrimaryBg = false;
    }

    if (status === Statuses.FINALIZING) {
      this.statusStr = 'Servidor Offline';
      this.showDefaultBg = true;
      this.showErrorBg = false;
      this.showSuccessBg = false;
      this.showWarnBg = false;
      this.showPrimaryBg = false;
    }

    this.cdr.detectChanges();
  }
}
