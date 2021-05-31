import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Component, Inject } from '@angular/core';

interface ModalData {
  text: string;
  title: string;
}

@Component({
  selector: 'app-info-modal',
  templateUrl: './info-modal.component.html',
  styleUrls: ['./info-modal.component.scss']
})
export class InfoModalComponent {

  constructor(
    public dialogRef: MatDialogRef<InfoModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: ModalData,
  ) { }

  cancel(): void {
    this.dialogRef.close(false);
  }

  confirm(): void {
    this.dialogRef.close(true);
  }

}
