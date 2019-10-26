import { Component, OnInit, Input } from '@angular/core';
import { TopBarService } from './top-bar.service';

@Component({
  selector: 'app-top-bar',
  templateUrl: './top-bar.component.html',
  styleUrls: ['./top-bar.component.css']
})
export class TopBarComponent implements OnInit {
  @Input()
  public title = 'No Title';
  public saveVisibilityChange$ = this.topBarService.saveVisibilityChange();

  constructor(private topBarService: TopBarService) {}

  ngOnInit() {}

  public onSaveClick(): void {
    this.topBarService.clickSave();
  }
}
