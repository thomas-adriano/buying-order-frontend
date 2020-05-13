import { Component, ChangeDetectionStrategy, AfterViewInit } from '@angular/core';
import { LoadingService } from './core/loading/loading.service';
import { BehaviorSubject } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent implements AfterViewInit {
  public loading$ = new BehaviorSubject(false);
  public title = 'buying-order-agent-frontend';

  constructor(private loadingService: LoadingService) {}

  public ngAfterViewInit(): void {
    this.loadingService.loadingChange().subscribe((l) => {
      this.loading$.next(l);
    });
  }
}
