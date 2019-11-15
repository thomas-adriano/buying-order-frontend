import {
  Component,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  AfterViewInit
} from '@angular/core';
import { LoadingService } from './core/loading/loading.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppComponent implements AfterViewInit {
  public loading: boolean;
  public title = 'buying-order-agent-frontend';

  constructor(
    private loadingService: LoadingService,
    private cdr: ChangeDetectorRef
  ) {}

  public ngAfterViewInit(): void {
    this.loadingService.loadingChange().subscribe(l => {
      if (this.loading !== l) {
        this.loading = l;
        console.log(this.loading);
        this.cdr.detectChanges();
      }
    });
  }
}
