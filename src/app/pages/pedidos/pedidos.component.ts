import { IFiltroPedido } from './../../models/IFiltroPedido.model';
import { IStatusPedido } from './../../models/IStatusPedido.model';
import { Component, OnInit, ViewChild } from '@angular/core';
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
import { IPedido } from 'src/app/models/IPedido.model';
import { Observable } from 'rxjs';
import { IPedidoPaginado } from 'src/app/models/IPedidoPaginado.model';
import { MatTableDataSource } from '@angular/material/table';
import { MatDialog } from '@angular/material/dialog';
import { PedidoService } from 'src/app/services/pedido.service';

interface IPedidoUpdate {
  status_id?: number;
}

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
export class PedidosComponent implements OnInit {

  @ViewChild(MatSort) sort: MatSort;
  public filterForm: FormGroup;

  pedidos: IPedido[] = [];
  $pedidos: Observable<IPedidoPaginado>;
  fontePedidos: MatTableDataSource<IPedido>;
  displayedColumns = ['created_at', 'cliente', 'telefone', 'retirada', 'status'];

  expandedElement: IPedido | null;

  tamanhoPaginacao = 0;
  tamanhoPagina = 10;
  indicePagina = 0;
  opcoesPaginacao: number[] = [5, 10, 20, 50, 100];

  listStatus: IStatusPedido[] = [
    {id: 1, status: 'inicializado'},
    {id: 2, status: 'andamento'},
    {id: 3, status: 'pronto'},
    {id: 4, status: 'entregue'},
    {id: 5, status: 'cancelado'},
  ]

  constructor(
    public dialog: MatDialog,
    private pedidoService: PedidoService,
    private formBuilder: FormBuilder,
  ) { }

  ngOnInit(): void {
    this.buscarPedidos(0, this.tamanhoPagina);

    this.filterForm = this.formBuilder.group({
      status: null,
      cliente: '',
      data: '',
    });
  }

  buscarPedidos(
    pagina: number,
    limite: number,
    filtros?: IFiltroPedido,
  ): void {
    const sort = () => {
      this.fontePedidos = new MatTableDataSource(this.pedidos);
      this.fontePedidos.sort = this.sort;
    };

    this.pedidoService.readPedido(pagina, limite).subscribe(ped => {
      this.pedidos = ped.instancias;
      this.tamanhoPaginacao = ped.total;
      this.indicePagina = pagina;
      sort();
    });
  }

  mudouPagina(event: PageEvent): void {
    const status_id = this.filterForm.get('status')?.value;
    const cliente = this.filterForm.get('cliente')?.value;
    const created_at = this.filterForm.get('data')?.value;

    this.tamanhoPagina = event.pageSize;
    if (status_id || cliente || created_at) {
      this.buscarPedidos(event.pageIndex, event.pageSize, {
        status_id,
        cliente,
        created_at,
      });
    } else {
      this.buscarPedidos(event.pageIndex, event.pageSize);
    }
  }

  selectPedido(event: MatSelectChange, idPedido: number): void {
    const objeto: IStatusPedido | undefined = this.listStatus.find(
      status => status.status === event.value,
    );
    const pedidoUpdate: IPedidoUpdate | undefined = { status_id: objeto?.id };
    console.log('Pedido update',pedidoUpdate, 'Id do pedido',idPedido);
    // this.pedidoService.patch(pedidoUpdate, idPedido).subscribe(() => {
    //   this.pedidoService.showMessage('Status do pedido atualizado com sucesso');
    // });
  }

  filtrar(): void {
    const status_id = this.filterForm.get('status')?.value;
    const cliente = this.filterForm.get('cliente')?.value;
    const created_at = this.filterForm.get('data')?.value;

    if (status_id || cliente || created_at) {
      this.buscarPedidos(0, this.tamanhoPagina, {
        status_id,
        cliente,
        created_at,
      });
    } else {
      this.buscarPedidos(0, this.tamanhoPagina);
    }
  }
}
