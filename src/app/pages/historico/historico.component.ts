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
import { IOrder } from 'src/app/models/IOrder.model';
import { Observable } from 'rxjs';
import { IPagedOrder } from 'src/app/models/IPagedOrder.model';
import { MatTableDataSource } from '@angular/material/table';
import { MatDialog } from '@angular/material/dialog';
import { PedidoService } from 'src/app/services/pedido.service';
import { IFilterOrder } from 'src/app/models/IFilterOrder.model';
import { MatSelectChange } from '@angular/material/select';
import { PageEvent } from '@angular/material/paginator';
import { ModalDetalhesPedidoComponent } from '../pedidos/modal-detalhes-pedido/modal-detalhes-pedido.component';

@Component({
  selector: 'app-historico',
  templateUrl: './historico.component.html',
  styleUrls: ['./historico.component.scss'],
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
export class HistoricoComponent implements OnInit {

  @ViewChild(MatSort) sort: MatSort;
  public filterForm: FormGroup;

  historicos: IOrder[] = [];
  $historicos: Observable<IPagedOrder>;
  fonteHistorico: MatTableDataSource<IOrder>;
  displayedColumns = ['created_at', 'client_name', 'phone', 'withdrawal', 'status'];

  expandedElement: IOrder | null;

  tamanhoPaginacao = 0;
  tamanhoPagina = 10;
  indicePagina = 0;
  opcoesPaginacao: number[] = [5, 10, 20, 50, 100];

  listStatus = ['inicializado', 'andamento', 'pronto', 'entregue', 'cancelado'];
  listStatusFilter = ['entregue', 'cancelado'];

  showSpinner = false;

  constructor(
    public dialog: MatDialog,
    private pedidoService: PedidoService,
    private formBuilder: FormBuilder,
  ) { }

  ngOnInit(): void {
    this.showSpinner = true;
    this.buscarPedidos(0, this.tamanhoPagina);

    this.filterForm = this.formBuilder.group({
      status: null,
      client_name: '',
      data: '',
    });
  }

  buscarPedidos(
    pagina: number,
    limite: number,
    filtros?: IFilterOrder,
  ): void {
    const sort = () => {
      this.fonteHistorico = new MatTableDataSource(this.historicos);
      this.fonteHistorico.sort = this.sort;
    };

    this.pedidoService.readPaginator(pagina, limite, false, filtros).subscribe(ped => {
      this.historicos = ped.instances;
      this.tamanhoPaginacao = ped.total;
      this.indicePagina = pagina;
      sort();
      this.showSpinner = false;
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
    const status = this.filterForm.get('status')?.value;
    const client = this.filterForm.get('client_name')?.value;
    const data = this.filterForm.get('data')?.value;

    let dataFormatada: string | null = null;
    if (data) {
      dataFormatada = `${data.getFullYear()}-${data.getMonth() + 1}-${data.getDate()}`;
    }

    if (status || client || data) {
      this.buscarPedidos(0, this.tamanhoPagina, {
        status,
        client,
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
}
