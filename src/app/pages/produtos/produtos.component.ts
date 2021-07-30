import { SessaoService } from 'src/app/services/sessao.service';
import { ModalProdutoComponent } from './modal-produto/modal-produto.component';
import { MatDialog } from '@angular/material/dialog';
import { ProdutoService } from './../../services/produto.service';
import { IPagedProduct } from '../../models/IPagedProduct.model';
import { IProduct } from '../../models/IProduct.model';
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
  marmitas: IProduct[] = [];
  $marmitas: Observable<IPagedProduct>;
  fonteMarmitas: MatTableDataSource<IProduct>;
  displayedColumns = ['indice', 'name', 'price', 'size', 'status', 'createdAt', 'actions'];
  expandedElement: IProduct | null;

  // MatPaginator Inputs Produto Físico
  tamanhoPaginacaoMarmita = 0;
  tamanhoPaginaMarmita = 10;
  indicePaginaMarmita = 0;
  opcoesPaginacaoMarmita: number[] = [5, 10, 20, 50, 100];

  // Tabela Produtos
  bebidas: IProduct[] = [];
  $bebidas: Observable<IPagedProduct>;
  fonteBebidas: MatTableDataSource<IProduct>;
  columnsDisplayed = ['indice', 'name', 'price', 'size', 'status', 'createdAt', 'actions'];
  elementExpanded: IProduct | null;

  // MatPaginator Inputs Produto Físico
  tamanhoPaginacaoBebida = 0;
  tamanhoPaginaBebida = 10;
  indicePaginaBebida = 0;
  opcoesPaginacaoBebida: number[] = [5, 10, 20, 50, 100];

  constructor(
    private produtoService: ProdutoService,
    private dialog: MatDialog,
    private sessaoService: SessaoService
  ) { }

  ngOnInit(): void {
    this.buscarMarmitas(0, this.tamanhoPaginaMarmita);
    this.buscarBebidas(0, this.tamanhoPaginaBebida);
  }

  notPermission(): boolean {
    return !this.sessaoService.checkPermission();
  }

  buscarMarmitas(pagina: number, limite: number): void {
    const sort = () => {
      this.fonteMarmitas = new MatTableDataSource(this.marmitas);
      this.fonteMarmitas.sort = this.sort;
    };

    this.produtoService.readPaginator(pagina, limite, 'marmita').subscribe(marmitas => {
      this.marmitas = marmitas.instances;
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

    this.produtoService.readPaginator(pagina, limite, 'bebida').subscribe(bebidas => {
      this.bebidas = bebidas.instances;
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

  ativarDesativar(produto: IProduct): void {
    this.produtoService.patch(produto.status, produto.id).subscribe(() => {
      this.produtoService.showMessage(
        produto.status === true ? 'Produto ativado' : 'Produto desativado',
      );
    });
  }

  dialogCadastrar(): void {
    const dialogRef = this.dialog.open(ModalProdutoComponent, {
      width: '70%',
      data: { title: 'Cadastrar produto' },
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        const produto: IProduct = {
          name: result.name,
          description: result.description,
          price: result.price,
          type: result.type,
          size: result.size,
          image: result.img64.replace(/^data:image\/[a-z]+;base64,/, "")
        };
        this.produtoService.create(produto).subscribe(() => {
          if (produto.type === 'marmita') {
            this.buscarMarmitas(0, this.tamanhoPaginaMarmita);
            this.produtoService.showMessage('Marmita cadastrada com sucesso');
          } else {
            this.buscarBebidas(0, this.tamanhoPaginaBebida);
            this.produtoService.showMessage('Bebida cadastrada com sucesso');
          }
        });
      }
    })
  }

  dialogEditar(event: MouseEvent, produto: IProduct) {
    event.stopPropagation();
    if (!this.notPermission()) {
      const dialogRef = this.dialog.open(ModalProdutoComponent, {
        width: '70%',
        data: {
          title: 'Editar produto',
          id: produto.id,
          name: produto.name,
          description: produto.description,
          price: produto.price,
          status: produto.status,
          type: produto.type,
          size: produto.size,
          image: produto.image
        }
      });

      dialogRef.afterClosed().subscribe(result => {
        if (result) {
          let produto: IProduct;
          if (result.size) {
            if (result.img64) {
              produto = {
                name: result.name,
                description: result.description,
                price: result.price,
                type: result.type,
                size: result.size,
                image: result.img64.replace(/^data:image\/[a-z]+;base64,/, "")
              };
            } else {
              produto = {
                name: result.name,
                description: result.description,
                price: result.price,
                type: result.type,
                size: result.size,
              };
            }
          } else {
            if (result.img64) {
              produto = {
                name: result.name,
                description: result.description,
                price: result.price,
                type: result.type,
                image: result.img64.replace(/^data:image\/[a-z]+;base64,/, "")
              };
            } else {
              produto = {
                name: result.name,
                description: result.description,
                price: result.price,
                type: result.type,
              };
            }
          }
          this.produtoService.update(produto, result.id).subscribe(() => {
            if (produto.type === 'marmita') {
              this.buscarMarmitas(0, this.tamanhoPaginaMarmita);
              this.produtoService.showMessage('Marmita alterada com sucesso');
            } else {
              this.buscarBebidas(0, this.tamanhoPaginaBebida);
              this.produtoService.showMessage('Bebida alterada com sucesso');
            }
          });
        }
      });
    }
  }

  dialogExcluir(event: MouseEvent, produto: IProduct) {
    event.stopPropagation();
    if (!this.notPermission()) {
      const dialogRef = this.dialog.open(ModalProdutoComponent, {
        width: '70%',
        data: { title: 'Excluir produto', id: produto.id, name: produto.name, type: produto.type },
      });

      dialogRef.afterClosed().subscribe(result => {
        if (result) {
          this.produtoService.delete(result.id).subscribe(() => {
            if (produto.type === 'marmita') {
              this.buscarMarmitas(0, this.tamanhoPaginaMarmita);
              this.produtoService.showMessage('Marmita deletada com sucesso');
            } else {
              this.buscarBebidas(0, this.tamanhoPaginaBebida);
              this.produtoService.showMessage('Bebida deletada com sucesso');
            }
          });
        }
      });
    }
  }
}
