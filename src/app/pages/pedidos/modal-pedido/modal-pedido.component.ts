import { IAcrescimo } from './../../../models/IAcrescimo.model';
import { FreteService } from './../../../services/frete.service';
import { AcrescimoService } from './../../../services/acrescimo.service';
import { IOrder } from 'src/app/models/IOrder.model';
import { ModalAlertComponent } from './../../modal-alert/modal-alert.component';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSelectChange } from '@angular/material/select';
import { isNumberIntegerValidator } from 'src/app/utils/validators/numero-inteiro';
import { IOrderToProduct } from './../../../models/IOrderToProduct.model';
import { IProduct } from './../../../models/IProduct.model';
import { CEPserviceService } from './../../../services/cepservice.service';
import { ProdutoService } from './../../../services/produto.service';
import { IFrete } from 'src/app/models/IFrete.model';
import getListSize from 'src/app/utils/functions/getListSize';

interface IProductRelation {
  amount: number;
  observation: string;
  meet_options: string;
  order: number | null,
  product: number,
  total_item: number
}

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

  listSize = getListSize();

  listOptions: IAcrescimo[];

  listFrete: IFrete[];

  showSpinner = false;

  showSpinner2 = false;

  constructor(
    public dialogRef: MatDialogRef<ModalPedidoComponent>,
    @Inject(MAT_DIALOG_DATA) public data: IOrder,
    private formBuilder: FormBuilder,
    private produtoService: ProdutoService,
    private cepService: CEPserviceService,
    private dialog: MatDialog,
    private acrescimoService: AcrescimoService,
    private freteService: FreteService,
  ) { }

  ngOnInit(): void {
    if (this.data.title === 'Editar pedido') this.vaiEditar = true;
    else this.vaiEditar = false;

    this.orderForm = this.formBuilder.group({
      client_name: [this.data.client_name, Validators.required],
      phone: [this.data.phone],
      cep: [this.data.cep],
      address_street: [this.data.address_street],
      address_number: [this.data.address_number],
      address_neighborhood: [this.data.address_neighborhood],
      address_city: [this.data.address_city],
      payment: [this.data.payment, Validators.required],
      cost_freight: [{ value: this.data.cost_freight, disabled: true }],
      reference_point: [this.data.reference_point],
      change_of_money: [this.data.change_of_money],

      amount: [null, [Validators.min(1), isNumberIntegerValidator]],
      selectSize: [null],
      selectProduct: [null],

      observation: [null],
      meet_options: [null],
      amountOption: [null, [Validators.min(1), isNumberIntegerValidator]]
    });

    this.acrescimoService.read().subscribe(acrescimos => {
      this.listOptions = acrescimos;
    });

    this.freteService.read().subscribe(fretes => {
      this.listFrete = fretes;
    });
  }

  onNoClick(): void {
    this.dialogRef.close(null);
  }

  confirm(): void {
    const novoPedido = this.orderForm.getRawValue() as IOrder;

    let products: IProductRelation[] = [];
    this.data.products.forEach(item => {
      products.push({
        amount: item.amount,
        observation: item.observation,
        meet_options: item.meet_options,
        order: null,
        product: item.products.id,
        total_item: item.total_item,
      });
    });

    this.dialogRef.close({
      ...novoPedido,
      withdrawal: this.data.withdrawal,
      id: this.data.id,
      status: this.data.status,
      products,
      total: this.data.total
    });
  }

  getProductPerType(event: MatSelectChange): void {
    this.showSpinner2 = true;
    if (event.value.name === 'Bebida') {
      this.orderForm.get('observation').disable();
      this.orderForm.get('meet_options').disable();
      this.orderForm.get('amountOption').disable();

      this.produtoService.readPerType('bebida').subscribe(bebidas => {
        this.showSpinner2 = false;
        this.listProducts = bebidas;
      });
    } else {
      this.produtoService.readPerType('marmita', event.value.size).subscribe(bebidas => {
        this.showSpinner2 = false;
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
          if (item.products === selectProduct) {
            if (meet_options && amountOption) {

              if (item.meet_options.length === 0) item.meet_options = `${amountOption} ${meet_options.name}`;
              else item.meet_options += `, ${amountOption} ${meet_options.name}`;
              item.total_item += (amountOption * meet_options.price);
              this.data.total += (amountOption * meet_options.price);

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
          products: selectProduct,
          total_item: amountOption && meet_options ?
            (amount * selectProduct.price) + (amountOption * meet_options.price) : (amount * selectProduct.price),
        });
        this.data.total += amountOption && meet_options ?
          (amount * selectProduct.price) + (amountOption * meet_options.price) : (amount * selectProduct.price)
      }

      this.limparDadosOpcao();
    }
  }

  excluirProduto(index: number, total_item: number): void {
    const dialogRef = this.dialog.open(ModalAlertComponent, {
      width: 'auto',
      height: 'auto',
      data: { title: 'Remoção de produto', text: 'Tem certeza que deseja remover este produto?' }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.data.total -= total_item;
        this.data.products.splice(index, 1);
      }
    });
  }

  buscarCEP(): void {
    this.showSpinner = true;
    const cep = this.orderForm.get('cep').value;
    if (cep) {
      this.cepService.buscarUm(cep).subscribe(endereco => {
        this.showSpinner = false;
        this.orderForm.get('cep').setErrors(null);

        this.orderForm.get('address_city').setValue(endereco.city);
        this.orderForm.get('address_neighborhood').setValue(endereco.neighborhood);
        this.orderForm.get('address_street').setValue(endereco.street);
      },
        (e: HttpErrorResponse) => {
          this.showSpinner = false;
          this.cepService.showMessage('Cep inválido', true);
          // this.orderForm.get('cep').setErrors({ cepInvalido: true });
        },
      );
    }
  }

  buscarFrete(): void {
    const bairro = this.orderForm.get('address_neighborhood').value;
    const frete = this.listFrete.find(frete => frete.neighborhood === bairro)
    if (frete) this.orderForm.get('cost_freight').setValue(frete.value);
    else this.orderForm.get('cost_freight').setValue(0);
  }

  setTroco(event: MatSelectChange): void {
    if (event.value !== 'dinheiro'){
      this.orderForm.get('change_of_money').setValue(0);
      this.orderForm.get('change_of_money').disable();
    }
    else{
      this.orderForm.get('change_of_money').setValue(null);
      this.orderForm.get('change_of_money').enable();
    }
  }

  limparDadosOpcao(): void {
    this.orderForm.get('meet_options').setValue(null);
    this.orderForm.get('amountOption').setValue(null);
  }

}
