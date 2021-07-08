import { ModalAlertComponent } from './../../modal-alert/modal-alert.component';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSelectChange } from '@angular/material/select';
import { isNumberIntegerValidator } from 'src/app/utils/validators/numero-inteiro';
import { IFormOrder } from './../../../models/IFormOrder.model';
import { IOrderToProduct } from './../../../models/IOrderToProduct.model';
import { IProduct } from './../../../models/IProduct.model';
import { CEPserviceService } from './../../../services/cepservice.service';
import { ProdutoService } from './../../../services/produto.service';


@Component({
  selector: 'app-modal-pedido',
  templateUrl: './modal-pedido.component.html',
  styleUrls: ['./modal-pedido.component.scss'],
})
export class ModalPedidoComponent implements OnInit {

  vaiEditar: boolean;
  orderForm: FormGroup;
  listProducts: IProduct[];

  displayedColumns = ['amount', 'products', 'size', 'price', 'delete'];
  expandedElement: IOrderToProduct | null;

  listSize = [
    { name: 'Marmita grande', size: 'grande' },
    { name: 'Marmita média', size: 'media' },
    { name: 'Marmita pequena', size: 'pequena' },
    { name: 'Bebida', size: null },
  ]

  listOptions = [
    { id: 1, name: 'Bisteca', price: 2.50 },
    { id: 2, name: 'Frango', price: 2.00 },
    { id: 3, name: 'Peixe', price: 2.30 },
    { id: 4, name: 'Linguiça', price: 2.00 },
    { id: 5, name: 'Macarrão', price: 1.50 },
  ]

  listFrete = [
    { id: 1, cep: '37510-000', neighborhood: 'Machado', shipping_value: 5.50 },
    { id: 2, cep: '37510-000', neighborhood: 'Morada do Sol', shipping_value: 3 },
    { id: 3, cep: '37520-000', neighborhood: 'Paulino', shipping_value: 7.50 },
    { id: 4, cep: '37510-000', neighborhood: 'Fundão', shipping_value: 6.50 },
  ]

  constructor(
    public dialogRef: MatDialogRef<ModalPedidoComponent>,
    @Inject(MAT_DIALOG_DATA) public data: IFormOrder,
    private formBuilder: FormBuilder,
    private produtoService: ProdutoService,
    private cepService: CEPserviceService,
    private dialog: MatDialog,
  ) { }

  ngOnInit(): void {
    if (this.data.title === 'Editar pedido') this.vaiEditar = true;
    else this.vaiEditar = false;

    this.orderForm = this.formBuilder.group({
      withdrawal: [this.data.withdrawal, Validators.required],
      client_name: [this.data.client_name, Validators.required],
      phone: [this.data.phone],
      cep: [this.data.cep],
      address_street: [this.data.address_street],
      address_number: [this.data.address_number],
      address_neighborhood: [this.data.address_neighborhood],
      address_city: [this.data.address_city],
      payment: [this.data.payment, Validators.required],
      cost_freight: [this.data.cost_freight],
      reference_point: [this.data.reference_point],
      change_of_money: [this.data.change_of_money],

      selectSize: [null],
      selectProduct: [null],
      amount: [null, [Validators.min(1), isNumberIntegerValidator]],
      observation: [null],
      meet_options: [null],
      amountOption: [null, [Validators.min(1), isNumberIntegerValidator]]
    });
  }

  onNoClick(): void {
    this.dialogRef.close(null);
  }

  confirm(): void {
    const novoPedido = this.orderForm.getRawValue() as IFormOrder;
    console.log(novoPedido);
    // this.dialogRef.close({ ...novoPedido, id: this.data.id, status: this.data.status });
  }

  getProductPerType(event: MatSelectChange): void {
    if (event.value.name === 'Bebida') {
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
    const selectProduct = this.orderForm.get('selectProduct').value;
    const amount = this.orderForm.get('amount').value;
    const observation = this.orderForm.get('observation').value;
    const meet_options = this.orderForm.get('meet_options').value;
    const amountOption = this.orderForm.get('amountOption').value;

    if (amountOption && amountOption <= 0) return;

    if (selectProduct && amount && amount > 0) {
      let encontrou = false;
      if (this.data.products.length > 0) {
        this.data.products.forEach(item => {
          if (item.products === selectProduct){
            if (meet_options && amountOption) {

              if (item.meet_options.length === 0) item.meet_options = `${amountOption} ${meet_options.name}`;
              else item.meet_options += `, ${amountOption} ${meet_options.name}`;

            } else {
              this.dialog.open(ModalAlertComponent, {
                width: 'auto',
                height: 'auto',
                data: {
                  title: 'Atenção',
                  text: 'O produto já foi inserido. Caso queira adicionar acréscimos a este produto, selecione o acréscimo e sua respectiva quantidade.'
                }
              });
            }
            encontrou = true;
          }
        });
      }

      if (!encontrou) {
        this.data.products.push({
          amount,
          observation: observation ? observation : '',
          meet_options: meet_options ? `${amountOption} ${meet_options.name}` : '',
          products: selectProduct
        });
      }
      this.limparDadosOpcao();
    }
  }

  excluirProduto(index: number): void {
    this.data.products.splice(index, 1);
  }

  buscarCEP(): void {
    const cep = this.orderForm.get('cep').value;
    if (cep) {
      this.cepService.buscarUm(cep).subscribe(endereco => {
        this.orderForm.get('cep').setErrors(null);

        this.orderForm.get('address_city').setValue(endereco.city);
        this.orderForm.get('address_neighborhood').setValue(endereco.neighborhood);
        this.orderForm.get('address_street').setValue(endereco.street);

      },
        (e: HttpErrorResponse) => {
          this.cepService.showMessage('Cep inválido', true);
          // this.orderForm.get('cep').setErrors({ cepInvalido: true });
        },
      );
    }
  }

  buscarFrete(): void {
    const bairro = this.orderForm.get('address_neighborhood').value;
    if (bairro) {
      const frete = this.listFrete.find(frete => frete.neighborhood === bairro)
      this.orderForm.get('cost_freight').setValue(frete.shipping_value);
    }
  }

  setTroco(event: MatSelectChange): void {
    if (event.value !== 'dinheiro') this.orderForm.get('change_of_money').setValue(0);
    else this.orderForm.get('change_of_money').setValue(null);
  }

  limparDadosOpcao(): void {
    this.orderForm.get('meet_options').setValue(null);
    this.orderForm.get('amountOption').setValue(null);
  }

}
