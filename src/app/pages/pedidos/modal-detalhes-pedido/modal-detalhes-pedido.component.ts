import { IOrder } from './../../../models/IOrder.model';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Component, Inject, OnInit } from '@angular/core';

interface DetalhesPedidoData {
  title: string;
  pedido: IOrder;
}

@Component({
  selector: 'app-modal-detalhes-pedido',
  templateUrl: './modal-detalhes-pedido.component.html',
  styleUrls: ['./modal-detalhes-pedido.component.scss']
})
export class ModalDetalhesPedidoComponent implements OnInit {

  constructor(
    public dialogRef: MatDialogRef<ModalDetalhesPedidoComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DetalhesPedidoData
  ) { }

  ngOnInit(): void {
  }

  confirm(): void {
    this.dialogRef.close();
  }

}
