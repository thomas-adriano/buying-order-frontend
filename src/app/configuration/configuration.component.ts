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
      appEmailName: ['Inspire Home', [Validators.required]],
      appEmailUser: ['viola.von@ethereal.email', [Validators.required]],
      appBlacklist: [undefined],
      appEmailPassword: ['Q61Z2qsRsmg7nUEzNG', [Validators.required]],
      appSMTPAddress: ['smtp.ethereal.email', [Validators.required]],
      appSMTPPort: [587, [Validators.required]],
      appSMTPSecure: [false],
      appEmailFrom: ['inspirehome@mail.com', [Validators.required, Validators.email]],
      appEmailSubject: ['Olá ${providerName}', [Validators.required]],

      appReplyLink: ['https://buying-order-agent-reply.firebaseapp.com/'],
      appCronPattern: ['0/60 * * * * *', [Validators.required]],
      appNotificationTriggerDelta: [5, [Validators.required]],
      appEmailText: [
        'Olá ${providerName}, como o pedido numero ${orderNumber}, ' +
          'data ${orderDate} está prevista para ${previewOrderDate}. ' +
          'Favor contatar ${orderContactName} ou informar nova data ${replyLinkBegin}aqui${replyLinkEnd}',
      ],
      appEmailHtml: [
        'Olá ${providerName}, como o pedido numero ${orderNumber}, ' +
          'data ${orderDate} está prevista para ${previewOrderDate}. ' +
          'Favor contatar ${orderContactName} ou informar nova data em ${replyLinkBegin}',
      ],
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
