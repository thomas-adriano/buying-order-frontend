import { Component, OnInit, Input, ChangeDetectorRef } from '@angular/core';
import { TopBarService } from './top-bar.service';
import { ApiService } from '../core/api/api.service';
import { Statuses } from './statuses';

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
  private reconnectInterval: any;

  constructor(
    private topBarService: TopBarService,
    private api: ApiService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    // setInterval(() => {
    //   this.api.getStatus().subscribe(running => {
    //     console.log(running);
    //     this.statusStr = running ? 'Em execução' : 'Desligado';
    //     this.cdr.detectChanges();
    //   });
    // }, 2000);
    this.createSocketConnection();
  }

  private createSocketConnection(): WebSocket {
    let socket = new WebSocket('ws://localhost:8989');
    socket.onopen = e => {
      console.log('[open] Connection established');
      clearInterval(this.reconnectInterval);
    };

    socket.onmessage = event => {
      if (event.data === Statuses.INITIALIZING) {
        this.statusStr = 'Inicializando';
        this.showPrimaryBg = true;
        this.showDefaultBg = false;
        this.showErrorBg = false;
        this.showSuccessBg = false;
        this.showWarnBg = false;
      }
      if (event.data === Statuses.SERVER_ERROR) {
        this.statusStr = 'Erro no Servidor';
        this.showErrorBg = true;
        this.showDefaultBg = false;
        this.showSuccessBg = false;
        this.showWarnBg = false;
        this.showPrimaryBg = false;
      }
      if (event.data === Statuses.SERVER_RUNNING) {
        this.statusStr = 'Servidor Online';
        this.showSuccessBg = true;
        this.showErrorBg = false;
        this.showDefaultBg = false;
        this.showWarnBg = false;
        this.showPrimaryBg = false;
      }
      if (event.data === Statuses.SCHEDULER_ERROR) {
        this.statusStr = 'Erro no Agendamento';
        this.showErrorBg = true;
        this.showDefaultBg = false;
        this.showSuccessBg = false;
        this.showWarnBg = false;
        this.showPrimaryBg = false;
      }
      if (event.data === Statuses.SCHEDULER_RUNNING) {
        this.statusStr = 'Agendamento Online';
        this.showSuccessBg = true;
        this.showErrorBg = false;
        this.showDefaultBg = false;
        this.showWarnBg = false;
        this.showPrimaryBg = false;
      }
      if (event.data === Statuses.FINALIZING) {
        this.statusStr = 'Servidor Offline';
        this.showDefaultBg = true;
        this.showErrorBg = false;
        this.showSuccessBg = false;
        this.showWarnBg = false;
        this.showPrimaryBg = false;
      }

      this.cdr.detectChanges();
    };

    socket.onclose = event => {
      if (event.wasClean) {
        console.log(
          `[close] Connection closed cleanly, code=${event.code} reason=${event.reason}`
        );
      } else {
        // e.g. server process killed or network down
        // event.code is usually 1006 in this case
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
      // socket = undefined;
      // this.reconnectInterval = setInterval(() => {
      //   socket = new WebSocket('ws://localhost:8989');
      // }, 5000);
    };

    return socket;
  }

  public onStartSchedulerStart(): void {}

  public onStopSchedulerStart(): void {}

  public onSaveClick(): void {
    this.topBarService.clickSave();
  }
}
