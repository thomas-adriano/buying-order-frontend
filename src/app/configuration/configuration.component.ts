import { Component, OnInit } from "@angular/core";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import * as ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import { TopBarService } from "../top-bar/top-bar.service";
import { MatDialog } from "@angular/material";
import { CheckFormDialogComponent } from "./check-form-dialog/check-form-dialog.component";
import { ConfigurationModel } from "./configuration.model";
import { ApiService } from "../core/api/api.service";
import { BehaviorSubject } from "rxjs";
import { LoadingService } from "../core/loading/loading.service";

@Component({
  selector: "app-configuration",
  templateUrl: "./configuration.component.html",
  styleUrls: ["./configuration.component.css"]
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
      appEmailPassword: [undefined, [Validators.required]],
      appSMTPAddress: [undefined, [Validators.required]],
      appSMTPPort: [undefined, [Validators.required]],
      appSMTPSecure: [false],
      appEmailFrom: [undefined, [Validators.required, Validators.email]],
      appEmailSubject: [undefined, [Validators.required]],
      appEmailText: [undefined],
      appEmailHtml: [undefined],

      appCronPattern: [undefined, [Validators.required]],
      appCronTimezone: [undefined, [Validators.required]],
      appNotificationTriggerDelta: [undefined, [Validators.required]]
    });

    this.formGroup.patchValue(
      {
        appCronPattern: "0/60 * * * * *",
        appCronTimezone: "America/Sao_Paulo",
        appNotificationTriggerDelta: 1,
        appSMTPAddress: "smtp.ethereal.email",
        appSMTPPort: 587,
        appEmailName: "Inspire Home",
        appEmailUser: "viola.von@ethereal.email",
        appEmailPassword: "Q61Z2qsRsmg7nUEzNG",
        appEmailSubject: "Aviso de atraso"
      } as ConfigurationModel,
      { emitEvent: false }
    );
  }

  ngOnInit() {
    this.formGroup.valueChanges.subscribe(v => {
      if (this.formGroup.dirty) {
        this.submitDisabled = false;
        this.topBarService.enableSave();
      }
    });
    this.loadingService.setLoading(true);
    this.api.getConfiguration().subscribe(configs => {
      this.formGroup.patchValue(configs, { emitEvent: false });
      this.loadingService.setLoading(false);
    });
    this.topBarService.saveClick().subscribe(() => this.onSubmit());
  }

  public onSubmit(): void {
    console.log(this.formGroup.value);
    if (this.formGroup.invalid) {
      this.openDialog();
    } else {
      this.loadingService.setLoading(true);
      this.api.postConfiguration(this.formGroup.value).subscribe(() => {
        this.submitDisabled = true;
        this.topBarService.disableSave();
        this.loadingService.setLoading(false);
      });
    }
  }

  private openDialog(): void {
    const dialogRef = this.dialog.open(CheckFormDialogComponent, {
      width: "250px"
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log("The dialog was closed");
    });
  }
}
