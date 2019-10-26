import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TopBarComponent } from './top-bar.component';
import { MatToolbarModule, MatButtonModule } from '@angular/material';

@NgModule({
  declarations: [TopBarComponent],
  imports: [CommonModule, MatToolbarModule, MatButtonModule],
  exports: [TopBarComponent]
})
export class TopBarModule {}
