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
  produtos: IProduto[] = [];
  $produtos: Observable<IProdutoPaginado>;
  fonteProdutos: MatTableDataSource<IProduto>;
  displayedColumns = ['id', 'nome', 'preco', 'status', 'created_at'];
  expandedElement: IProduto | null;

  // MatPaginator Inputs Produto Físico
  tamanhoPaginacao = 0;
  tamanhoPagina = 10;
  indicePagina = 0;
  opcoesPaginacao: number[] = [5, 10, 20, 50, 100];

  constructor(private produtoService: ProdutoService) { }

  ngOnInit(): void {
    this.buscarProdutos(0, this.tamanhoPagina);
  }

  buscarProdutos(pagina: number, limite: number): void {
    const sort = () => {
      this.fonteProdutos = new MatTableDataSource(this.produtos);
      this.fonteProdutos.sort = this.sort;
    };

    this.produtoService.readTeste(pagina, limite).subscribe(produtos => {
      this.produtos = produtos.instancias;
      this.tamanhoPaginacao = produtos.total;
      this.indicePagina = pagina;
      sort();
    });
  }

  mudouPagina(event: PageEvent): void {
    this.tamanhoPagina = event.pageSize;
    this.buscarProdutos(event.pageIndex, event.pageSize);
  }

  dialogCadastrar(): void {
    console.log('Abrir modal cadastro');
  }

  ativarDesativar(produto: IProduto): void {
    this.produtoService.update(produto).subscribe(() => {
      this.produtoService.showMessage(
        produto.status === true ? 'Produto ativado' : 'Produto desativado',
      );
    });
  }
}
