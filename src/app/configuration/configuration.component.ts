import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import * as ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { TopBarService } from '../top-bar/top-bar.service';
import { MatDialog } from '@angular/material';
import { CheckFormDialogComponent } from './check-form-dialog/check-form-dialog.component';
import { ConfigurationModel } from './configuration.model';
import { ApiService } from '../core/api/api.service';
import { LoadingService } from '../core/loading/loading.service';

@Component({
  selector: 'app-configuration',
  templateUrl: './configuration.component.html',
  styleUrls: ['./configuration.component.css'],
})
export class ConfigurationComponent implements OnInit {
  public editor = ClassicEditor;
  public formGroup: FormGroup;
  public submitDisabled = true;

  constructor(
    private fb: FormBuilder,
    private topBarService: TopBarService,
    public dialog: MatDialog,
    private api: ApiService,
    private loadingService: LoadingService
  ) {
    this.formGroup = this.fb.group({
      appEmailName: [undefined, [Validators.required]],
      appEmailUser: [undefined, [Validators.required]],
      appBlacklist: [undefined],
      appEmailPassword: [undefined, [Validators.required]],
      appSMTPAddress: [undefined, [Validators.required]],
      appSMTPPort: [undefined, [Validators.required]],
      appSMTPSecure: [false],
      appEmailFrom: [undefined, [Validators.required, Validators.email]],
      appEmailSubject: [undefined, [Validators.required]],
      appReplyLink: [undefined],
      appCronPattern: [undefined, [Validators.required]],
      appNotificationTriggerDelta: [undefined, [Validators.required]],
      appEmailText: [undefined],
      appEmailHtml: [undefined],
    });
  }

  ngOnInit() {
    this.formGroup.valueChanges.subscribe((v) => {
      if (this.formGroup.dirty) {
        this.submitDisabled = false;
        this.topBarService.enableSave();
      }
    });
    this.loadingService.setLoading(true);
    this.api.getConfiguration().subscribe(
      (configs) => {
        this.formGroup.patchValue(configs.result, { emitEvent: false });
        this.loadingService.setLoading(false);
      },
      (err) => this.loadingService.setLoading(false)
    );
    this.topBarService.saveClick().subscribe(() => this.onSubmit());
  }

  public onSubmit(): void {
    if (this.formGroup.invalid) {
      this.openDialog();
    } else {
      this.loadingService.setLoading(true);
      this.api.postConfiguration(this.formGroup.value).subscribe(
        () => {
          this.submitDisabled = true;
          this.topBarService.disableSave();
          this.loadingService.setLoading(false);
        },
        (err) => this.loadingService.setLoading(false)
      );
    }
  }

  private openDialog(): void {
    const dialogRef = this.dialog.open(CheckFormDialogComponent, {
      width: '250px',
    });
  }
}
