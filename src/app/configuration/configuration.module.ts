import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  MatInputModule,
  MatCardModule,
  MatTabsModule,
  MatCheckboxModule,
  MatButtonModule,
  MatDialogModule
} from '@angular/material';
import { ConfigurationRoutingModule } from './configuration-routing.module';
import { ConfigurationComponent } from './configuration.component';
import { ReactiveFormsModule } from '@angular/forms';
import { CKEditorModule } from '@ckeditor/ckeditor5-angular';
import { CheckFormDialogComponent } from './check-form-dialog/check-form-dialog.component';

@NgModule({
  entryComponents: [CheckFormDialogComponent],
  declarations: [CheckFormDialogComponent, ConfigurationComponent],
  imports: [
    CommonModule,
    ConfigurationRoutingModule,
    ReactiveFormsModule,
    MatTabsModule,
    MatCheckboxModule,
    MatCardModule,
    MatInputModule,
    CKEditorModule,
    MatButtonModule,
    MatDialogModule
  ]
})
export class ConfigurationModule {}
