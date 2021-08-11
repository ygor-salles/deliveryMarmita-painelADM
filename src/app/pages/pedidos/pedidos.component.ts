import { IOrderToProduct } from './../../models/IOrderToProduct.model';
import { ModalDetalhesPedidoComponent } from './modal-detalhes-pedido/modal-detalhes-pedido.component';
import { ModalPedidoComponent } from './modal-pedido/modal-pedido.component';
import { IFilterOrder } from '../../models/IFilterOrder.model';
import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import {
  animate,
  state,
  style,
  transition,
  trigger,
} from '@angular/animations';
import { MatSort } from '@angular/material/sort';
import { FormBuilder, FormGroup } from '@angular/forms';
import { PageEvent } from '@angular/material/paginator';
import { MatSelectChange } from '@angular/material/select';
import { IOrder } from 'src/app/models/IOrder.model';
import { Observable } from 'rxjs';
import { IPagedOrder } from 'src/app/models/IPagedOrder.model';
import { MatTableDataSource } from '@angular/material/table';
import { MatDialog } from '@angular/material/dialog';
import { PedidoService } from 'src/app/services/pedido.service';
import { interval, Subscription } from 'rxjs';
import { environment } from 'src/environments/environment';

const { pedidosTimeout } = environment;

@Component({
  selector: 'app-pedidos',
  templateUrl: './pedidos.component.html',
  styleUrls: ['./pedidos.component.scss'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({ height: '0px', minHeight: '0' })),
      state('expanded', style({ height: '*' })),
      transition(
        'expanded <=> collapsed',
        animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)'),
      ),
    ]),
  ],
})
export class PedidosComponent implements OnInit, OnDestroy {

  @ViewChild(MatSort) sort: MatSort;
  public filterForm: FormGroup;

  pedidos: IOrder[] = [];
  $pedidos: Observable<IPagedOrder>;
  fontePedidos: MatTableDataSource<IOrder>;
  displayedColumns = ['createdAt', 'client_name', 'phone', 'withdrawal', 'status', 'actions'];

  expandedElement: IOrder | null;

  tamanhoPaginacao = 0;
  tamanhoPagina = 10;
  indicePagina = 0;
  opcoesPaginacao: number[] = [5, 10, 20, 50, 100];

  listStatus = ['inicializado', 'andamento', 'pronto', 'entregue', 'cancelado'];
  listStatusFilter = ['inicializado', 'andamento', 'pronto'];

  status: string;
  client: string;
  data: string;

  orderProductInit: IOrderToProduct[] = [];

  subscription: Subscription;
  source = interval(pedidosTimeout);

  constructor(
    public dialog: MatDialog,
    private pedidoService: PedidoService,
    private formBuilder: FormBuilder,
  ) { }

  ngOnInit(): void {
    this.buscarPedidos(0, this.tamanhoPagina);

    this.filterForm = this.formBuilder.group({
      status: null,
      client_name: '',
      data: '',
    });

    this.subscription = this.source.subscribe(val => {
      this.buscarPedidos(this.indicePagina, this.tamanhoPagina, {
        data: this.data, client: this.client, status: this.status
      });
    });

  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  buscarPedidos(
    pagina: number,
    limite: number,
    filtros?: IFilterOrder,
  ): void {
    const sort = () => {
      this.fontePedidos = new MatTableDataSource(this.pedidos);
      this.fontePedidos.sort = this.sort;
    };

    // console.log(Math.random());
    this.pedidoService.readPaginator(pagina, limite, true, filtros).subscribe(ped => {
      this.pedidos = ped.instances;
      this.tamanhoPaginacao = ped.total;
      this.indicePagina = pagina;
      sort();
    });
  }

  mudouPagina(event: PageEvent): void {
    const status = this.filterForm.get('status')?.value;
    const client = this.filterForm.get('client_name')?.value;
    const data = this.filterForm.get('data')?.value;
    let dataFormatada: string | null = null;
    if (data) {
      dataFormatada = `${data.getFullYear()}-${data.getMonth() + 1}-${data.getDate()}`;
    }

    this.tamanhoPagina = event.pageSize;
    if (status || client || data) {
      this.buscarPedidos(event.pageIndex, event.pageSize, {
        status,
        client,
        data: dataFormatada,
      });
    } else {
      this.buscarPedidos(event.pageIndex, event.pageSize);
    }
  }

  toggleStatusSelect(event: MouseEvent): void {
    event.stopPropagation();
  }

  selectPedido(event: MatSelectChange, idPedido: number): void {
    this.pedidoService.patch(event.value, idPedido).subscribe(() => {
      this.pedidoService.showMessage('Status do pedido atualizado com sucesso');
    });
  }

  filtrar(): void {
    this.status = this.filterForm.get('status')?.value;
    this.client = this.filterForm.get('client_name')?.value;
    const data = this.filterForm.get('data')?.value;

    let dataFormatada: string | null = null;
    if (data) {
      dataFormatada = `${data.getFullYear()}-${data.getMonth() + 1}-${data.getDate()}`;
    }
    this.data = dataFormatada;

    if (this.status || this.client || data) {
      this.buscarPedidos(0, this.tamanhoPagina, {
        status: this.status,
        client: this.client,
        data: dataFormatada,
      });
    } else {
      this.buscarPedidos(0, this.tamanhoPagina);
    }
  }

  abrirModalDetalhes(pedido: IOrder): void {
    this.dialog.open(ModalDetalhesPedidoComponent, {
      width: '80%',
      data: { title: `Pedido - ${pedido.client_name}`, pedido }
    });
  }

  dialogCadastrar(isDelivery: boolean): void {
    const dialogRef = this.dialog.open(ModalPedidoComponent, {
      width: '80%',
      data: {
        title: isDelivery === true ? 'Cadastrar pedido delivery' : 'Cadastrar pedido local',
        products: [],
        total: 0,
        cost_freight: 0,
        withdrawal: isDelivery === true ? 'entrega' : 'local'
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        let pedido: IOrder;
        if (result.withdrawal === 'entrega') {
          pedido = {
            client_name: result.client_name,
            phone: result.phone,
            cep: result.cep ? result.cep : '',
            address_street: result.address_street,
            address_number: result.address_number,
            address_neighborhood: result.address_neighborhood,
            address_city: result.address_city ? result.address_city : '',
            cost_freight: result.cost_freight,
            status: 'inicializado',
            payment: result.payment,
            withdrawal: result.withdrawal,
            reference_point: result.reference_point ? result.reference_point : '',
            change_of_money: result.change_of_money,
            total: result.total,
            products: result.products,
          }
        } else {
          pedido = {
            client_name: result.client_name,
            status: 'inicializado',
            payment: result.payment,
            withdrawal: result.withdrawal,
            total: result.total,
            phone: result.phone ? result.phone : '',
            products: result.products,
          }
        }
        this.pedidoService.create(pedido).subscribe(() => {
          this.pedidoService.showMessage('Pedido cadastrado com sucesso!');
          this.buscarPedidos(0, this.tamanhoPagina);
        });
      }
    });
  }

  dialogEditar(event: MouseEvent, pedido: IOrder) {
    event.stopPropagation();

    pedido.orderToProducts.forEach(item => {
      this.orderProductInit.push({
        id: item.id,
        amount: item.amount,
        meet_options: item.meet_options,
        observation: item.observation,
        total_item: item.total_item,
        products: item.products,
        orderId: item.orderId,
        productId: item.productId
      });
    });

    const dialogRef = this.dialog.open(ModalPedidoComponent, {
      width: '80%',
      data: {
        title: 'Editar pedido',
        id: pedido.id,
        client_name: pedido.client_name,
        phone: pedido.phone,
        cep: pedido.cep,
        address_street: pedido.address_street,
        address_number: pedido.address_number,
        address_neighborhood: pedido.address_neighborhood,
        address_city: pedido.address_city,
        cost_freight: pedido.cost_freight,
        status: pedido.status,
        payment: pedido.payment,
        withdrawal: pedido.withdrawal,
        reference_point: pedido.reference_point,
        change_of_money: pedido.change_of_money,
        total: pedido.total,
        products: this.orderProductInit,
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        let pedido: IOrder;
        if (result.withdrawal === 'entrega') {
          pedido = {
            client_name: result.client_name,
            phone: result.phone,
            cep: result.cep ? result.cep : '',
            address_street: result.address_street,
            address_number: result.address_number,
            address_neighborhood: result.address_neighborhood,
            address_city: result.address_city ? result.address_city : '',
            cost_freight: result.cost_freight,
            status: result.status,
            payment: result.payment,
            withdrawal: result.withdrawal,
            reference_point: result.reference_point ? result.reference_point : '',
            change_of_money: result.change_of_money,
            total: result.total,
            products: result.products,
          }
        } else {
          pedido = {
            client_name: result.client_name,
            status: result.status,
            payment: result.payment,
            withdrawal: result.withdrawal,
            total: result.total,
            products: result.products,
          }
        }

        this.pedidoService.update(pedido, result.id).subscribe(() => {
          this.pedidoService.showMessage('Pedido alterado com sucesso!');
          this.buscarPedidos(0, this.tamanhoPagina);
        })
      }
    });
    this.orderProductInit = [];
  }

}
