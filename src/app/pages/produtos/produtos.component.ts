import { ProdutoService } from './../../services/produto.service';
import { IProdutoPaginado } from './../../models/IProdutoPaginado.model';
import { IProduto } from './../../models/IProduto.model';
import {
  animate,
  state,
  style,
  transition,
  trigger,
} from '@angular/animations';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatSort } from '@angular/material/sort';
import { Observable } from 'rxjs';
import { MatTableDataSource } from '@angular/material/table';
import { PageEvent } from '@angular/material/paginator';

@Component({
  selector: 'app-produtos',
  templateUrl: './produtos.component.html',
  styleUrls: ['./produtos.component.scss'],
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

export class ProdutosComponent implements OnInit {
  // Parametros de entrada do componente - decorators
  @ViewChild(MatSort) sort: MatSort;

  // Tabela Produtos
  marmitas: IProduto[] = [];
  $marmitas: Observable<IProdutoPaginado>;
  fonteMarmitas: MatTableDataSource<IProduto>;
  displayedColumns = ['id', 'nome', 'preco', 'status', 'created_at', 'acoes'];
  expandedElement: IProduto | null;

  // MatPaginator Inputs Produto Físico
  tamanhoPaginacaoMarmita = 0;
  tamanhoPaginaMarmita = 10;
  indicePaginaMarmita = 0;
  opcoesPaginacaoMarmita: number[] = [5, 10, 20, 50, 100];

  // Tabela Produtos
  bebidas: IProduto[] = [];
  $bebidas: Observable<IProdutoPaginado>;
  fonteBebidas: MatTableDataSource<IProduto>;
  columnsDisplayed = ['id', 'nome', 'preco', 'status', 'created_at', 'acoes'];
  elementExpanded: IProduto | null;

  // MatPaginator Inputs Produto Físico
  tamanhoPaginacaoBebida = 0;
  tamanhoPaginaBebida = 10;
  indicePaginaBebida = 0;
  opcoesPaginacaoBebida: number[] = [5, 10, 20, 50, 100];

  constructor(private produtoService: ProdutoService) { }

  ngOnInit(): void {
    this.buscarMarmitas(0, this.tamanhoPaginaMarmita);
    this.buscarBebidas(0, this.tamanhoPaginaBebida);
  }

  buscarMarmitas(pagina: number, limite: number): void {
    const sort = () => {
      this.fonteMarmitas = new MatTableDataSource(this.marmitas);
      this.fonteMarmitas.sort = this.sort;
    };

    this.produtoService.readMarmita(pagina, limite).subscribe(marmitas => {
      this.marmitas = marmitas.instancias;
      this.tamanhoPaginacaoMarmita = marmitas.total;
      this.indicePaginaMarmita = pagina;
      sort();
    });
  }

  buscarBebidas(pagina: number, limite: number): void {
    const sort = () => {
      this.fonteBebidas = new MatTableDataSource(this.bebidas);
      this.fonteBebidas.sort = this.sort;
    };

    this.produtoService.readBebida(pagina, limite).subscribe(bebidas => {
      this.bebidas = bebidas.instancias;
      this.tamanhoPaginacaoBebida = bebidas.total;
      this.indicePaginaBebida = pagina;
      sort();
    });
  }

  mudouPaginaMarmita(event: PageEvent): void {
    this.tamanhoPaginaMarmita = event.pageSize;
    this.buscarMarmitas(event.pageIndex, event.pageSize);
  }

  mudouPaginaBebida(event: PageEvent): void {
    this.tamanhoPaginaBebida = event.pageSize;
    this.buscarBebidas(event.pageIndex, event.pageSize);
  }

  ativarDesativar(produto: IProduto): void {
    this.produtoService.patch(produto.status, produto.id).subscribe(() => {
      this.produtoService.showMessage(
        produto.status === true ? 'Produto ativado' : 'Produto desativado',
      );
    });
  }

  dialogCadastrar(): void {
    console.log('Abrir modal cadastro');
  }

  dialogEditar(produto: IProduto) {
    console.log('Abrir modal de editar');
  }

  dialogExcluir(produto: IProduto) {
    console.log('Abrir modal de excluir');
  }
}
