import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import transformProductImageUrl from 'src/app/utils/functions/transformProductImageUrl';

interface ModalData {
  image: string;
}

@Component({
  selector: 'app-modal-imagem',
  templateUrl: './modal-imagem.component.html',
  styleUrls: ['./modal-imagem.component.scss']
})
export class ModalImagemComponent implements OnInit {

  constructor(
    public dialogRef: MatDialogRef<ModalImagemComponent>,
    @Inject(MAT_DIALOG_DATA) public data: ModalData
  ) { }

  ngOnInit(): void {
  }

  activeSlideIndex = 0;

  transformImageUrl(imageUrl: string): string {
    return imageUrl.slice(0, 4) === 'http' ? imageUrl :  transformProductImageUrl(imageUrl);
  }

  cancel(): void {
    this.dialogRef.close(false);
  }

}
