import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import * as ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { TopBarService } from '../top-bar/top-bar.service';
import { MatDialog } from '@angular/material';
import { CheckFormDialogComponent } from './check-form-dialog/check-form-dialog.component';
import { ConfigurationModel } from './configuration.model';
import { ApiService } from '../core/api/api.service';

@Component({
  selector: 'app-configuration',
  templateUrl: './configuration.component.html',
  styleUrls: ['./configuration.component.css']
})
export class ConfigurationComponent implements OnInit {
  public editor = ClassicEditor;
  public formGroup: FormGroup;
  public submitDisabled = true;

  constructor(
    private fb: FormBuilder,
    private topBarService: TopBarService,
    public dialog: MatDialog,
    private api: ApiService
  ) {
    this.formGroup = this.fb.group({
      dbHost: [undefined, [Validators.required]],
      dbRootUser: [undefined, [Validators.required]],
      dbRootPassword: [undefined, [Validators.required]],
      dbAppUser: [undefined, [Validators.required]],
      dbAppPassword: [undefined, [Validators.required]],
      appDatabase: [undefined, [Validators.required]],
      appEmailName: [undefined, [Validators.required]],
      appEmailUser: [undefined, [Validators.required]],
      appEmailPassword: [undefined, [Validators.required]],
      appSMTPAddress: [undefined, [Validators.required]],
      appSMTPPort: [undefined, [Validators.required]],
      appSMTPSecure: [undefined],
      appEmailFrom: [undefined, [Validators.required, Validators.email]],
      appEmailSubject: [undefined, [Validators.required]],
      appEmailText: [undefined, [Validators.required]],
      appEmailHtml: [undefined, [Validators.required]],
      appServerHost: [undefined, [Validators.required]],
      appServerPort: [undefined, [Validators.required]],
      appCronPattern: [undefined, [Validators.required]],
      appCronTimezone: [undefined, [Validators.required]]
    });

    this.formGroup.patchValue(
      {
        appEmailName: 'Inspire Home',
        appEmailHtml: '<p>Hello, world!</p>',
        appCronPattern: '* 0/5 * * * *',
        appCronTimezone: 'America/Sao_Paulo'
      } as ConfigurationModel,
      { emitEvent: false }
    );
  }

  ngOnInit() {
    this.formGroup.valueChanges.subscribe(v => {
      if (this.formGroup.dirty) {
        this.submitDisabled = false;
        this.topBarService.showSave();
      }
    });
    this.topBarService.saveClick().subscribe(() => this.onSubmit());
  }

  public onSubmit(): void {
    console.log(this.formGroup.value);
    if (this.formGroup.invalid) {
      this.openDialog();
    } else {
      this.api.postConfiguration(this.formGroup.value).subscribe(() => {
        this.submitDisabled = true;
        this.topBarService.hideSave();
      });
    }
  }

  private openDialog(): void {
    const dialogRef = this.dialog.open(CheckFormDialogComponent, {
      width: '250px'
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
    });
  }
}
