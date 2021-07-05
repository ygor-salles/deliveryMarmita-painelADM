import { MatSelectChange } from '@angular/material/select';
import { ProdutoService } from './../../../services/produto.service';
import { IProduct } from './../../../models/IProduct.model';
import { IFormOrder } from './../../../models/IFormOrder.model';
import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { isNumberIntegerValidator } from 'src/app/utils/validators/numero-inteiro';

@Component({
  selector: 'app-modal-pedido',
  templateUrl: './modal-pedido.component.html',
  styleUrls: ['./modal-pedido.component.scss']
})
export class ModalPedidoComponent implements OnInit {

  // teste
  vaiEditar: boolean;
  orderForm: FormGroup;
  listProducts: IProduct[];
  listSize = [
    { name: 'Marmita pequena', size: 'pequena' },
    { name: 'Marmita média', size: 'media' },
    { name: 'Marmita grande', size: 'grande' },
    { name: 'Bebida', size: null },
  ]

  constructor(
    public dialogRef: MatDialogRef<ModalPedidoComponent>,
    @Inject(MAT_DIALOG_DATA) public data: IFormOrder,
    private formBuilder: FormBuilder,
    private produtoService: ProdutoService,
  ) { }

  ngOnInit(): void {
    if (this.data.title === 'Editar pedido') this.vaiEditar = true;
    else this.vaiEditar = false;

    this.orderForm = this.formBuilder.group({
      client_name: [this.data.client_name, Validators.required],
      phone: [this.data.phone, Validators.required],
      cep: [this.data.cep, Validators.required],
      address_street: [this.data.address_street, Validators.required],
      address_number: [this.data.address_number, Validators.required],
      address_neighborhood: [this.data.address_neighborhood, Validators.required],
      address_city: [this.data.address_city, Validators.required],
      cost_freight: [this.data.cost_freight, Validators.required],
      payment: [this.data.payment, Validators.required],
      withdrawal: [this.data.withdrawal, Validators.required],
      reference_point: [this.data.reference_point, Validators.required],
      change_of_money: [this.data.change_of_money, Validators.required],
      total: [this.data.total, Validators.required],

      selectSize: [null],
      selectProduct: [null],
      amount: [null, [Validators.min(0), isNumberIntegerValidator]],
      observation: [null],
      meet_options: [null],
    });
  }

  onNoClick(): void {
    this.dialogRef.close(null);
  }

  confirm(): void {
    const novoPedido = this.orderForm.getRawValue() as IFormOrder;
    this.dialogRef.close({ ...novoPedido, id: this.data.id, status: this.data.status });
  }

  getProductPerType(event: MatSelectChange): void {
    if (event.value.name === 'Bebida'){
      this.produtoService.readPerType('bebida').subscribe(bebidas => {
        this.listProducts = bebidas;
      });
    } else {
      this.produtoService.readPerType('marmita', event.value.size).subscribe(bebidas => {
        this.listProducts = bebidas;
      });
    }
  }

  adicionarProduto(): void {
    const selectProduct = this.orderForm.get('selectProduct')?.value;
    const amount = this.orderForm.get('amount')?.value;
    const observation = this.orderForm.get('observation')?.value;
    const meet_options = this.orderForm.get('meet_options')?.value;
    console.log(selectProduct, amount, observation, meet_options);
  }

}
