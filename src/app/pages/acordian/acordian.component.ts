import { IPedido } from 'src/app/models/IPedido.model';
import { IProduto } from './../../models/IProduto.model';
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

  @Input('produto') produto: IProduto;

  @Input('pedido') pedido: IPedido;

  constructor(public dialog: MatDialog) { }

  ngOnInit(): void {
  }

  transformImageUrl(imageUrl: string): string {
    return transformProductImageUrl(imageUrl);
  }

  abrirModalImagens(imagem: File): void {
    this.dialog.open(ModalImagemComponent, {
      width: 'auto',
      height: 'auto',
      data: { imagem },
    });
  }

}
