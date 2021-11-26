import { IOrder } from 'src/app/models/IOrder.model';
import { IProduct } from '../../models/IProduct.model';
import { Component, Input, OnInit } from '@angular/core';
import transformProductImageUrl from 'src/app/utils/functions/transformProductImageUrl';
import { ModalImagemComponent } from '../modal-imagem/modal-imagem.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-acordian',
  templateUrl: './acordian.component.html',
  styleUrls: ['./acordian.component.scss']
})
export class AcordianComponent implements OnInit {

  @Input('produto') produto: IProduct;

  constructor(public dialog: MatDialog) { }

  ngOnInit(): void {
  }

  transformImageUrl(imageUrl?: string): string {
    return imageUrl.slice(0, 4) === 'http' ? imageUrl :  transformProductImageUrl(imageUrl);
  }

  abrirModalImagem(image?: string): void {
    this.dialog.open(ModalImagemComponent, {
      width: 'auto',
      height: 'auto',
      data: { image },
    });
  }

}
