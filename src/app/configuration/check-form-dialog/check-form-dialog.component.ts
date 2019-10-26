import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material';

@Component({
  selector: 'app-check-form-dialog',
  templateUrl: './check-form-dialog.component.html',
  styleUrls: ['./check-form-dialog.component.css']
})
export class CheckFormDialogComponent {
  constructor(public dialogRef: MatDialogRef<CheckFormDialogComponent>) {}

  onClose(): void {
    this.dialogRef.close();
  }
}
