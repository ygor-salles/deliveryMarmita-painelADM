import { ImagensService } from './../../services/imagens.service';
import { Observable } from 'rxjs';
import { IprodutoDigitalPaginado } from './../../models/IprodutoDigitalPaginado.model';
import { IprodutoFisicoPaginado } from './../../models/IprodutoFisicoPaginado.model';
import { ProdutoDigitalService } from '../../services/produtoDigital.service';
import { ProdutoFisicoService } from './../../services/produtoFisico.service';
import { Component, OnInit, ViewChild } from '@angular/core';
import { ProdutoFisico } from '../../models/produtoFisico.model'
import { ProdutoDigital } from './../../models/produtoDigital.model';
import {animate, state, style, transition, trigger} from '@angular/animations';
import { MatDialog } from '@angular/material/dialog';
import { ModalProdutosComponent } from './modal-produtos/modal-produtos.component';
import { DialogData } from 'src/app/models/formProduto.model';
import { PageEvent } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';

@Component({
  selector: 'app-produtos',
  templateUrl: './produtos.component.html',
  styleUrls: ['./produtos.component.scss'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({height: '0px', minHeight: '0'})),
      state('expanded', style({height: '*'})),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})

export class ProdutosComponent implements OnInit {

  // Parametros de entrada do componente - decorators
  @ViewChild(MatSort) sort!: MatSort;

  // Tabela Produto Físico
  produtosFisicos!: ProdutoFisico[];
  $produtosFisicos!: Observable<IprodutoFisicoPaginado>;
  fonteProdutosFisicos!: MatTableDataSource<ProdutoFisico>;
  displayedColumns = ['id', 'nome', 'estoque', 'created_at', 'ativo', 'acoes'];
  expandedElement!: ProdutoFisico | null;

  // Tabela Produto Digital
  produtosDigitais!: ProdutoDigital[];
  $produtosDigitais!: Observable<IprodutoDigitalPaginado>;
  fonteProdutosDigitais!: MatTableDataSource<ProdutoDigital>;
  columnsDisplayed = ['nome', 'validade', 'created_at', 'ativo', 'acoes'];
  elementExpaned!: ProdutoDigital | null;

  // MatPaginator Inputs Produto Físico
  tamanhoPaginacaoFisico = 0;
  tamanhoPaginaFisico = 10;
  opcoesPaginacaoFisico: number[] = [5, 10, 20, 50, 100];

  // MatPaginator Inputs Produto Digital
  tamanhoPaginacaoDigital = 0;
  tamanhoPaginaDigital = 10;
  opcoesPaginacaoDigital: number[] = [5, 10, 20, 50, 100];

  constructor(
    private produtoFisicoService: ProdutoFisicoService,
    private produtoDigitalService: ProdutoDigitalService,
    public dialog: MatDialog,
    public imagensService: ImagensService
  ) { }

  ngOnInit(): void {
    this.buscarProdutosFisicos(0, this.tamanhoPaginaFisico);
    this.buscarProdutosDigitais(0, this.tamanhoPaginaDigital);
  }

  // Modal de Cadastro de produto ************************************
  dialogCadastrarProduto(): void {
    const dialogRef = this.dialog.open(ModalProdutosComponent, {
      width: '70%',
      data: { title: 'Cadastrar produto' }
    });

    dialogRef.afterClosed().subscribe(result => {
      if(result){
        if(result.selectProduto==='produtoFisico'){
          const produto: ProdutoFisico = {
            nome: result.nome,
            ativo: true,
            descricao: result.descricao,
            estoque: result.estoque
          }
          const imagensProdutos = result.imagens
          this.produtoFisicoService.create(produto).subscribe((resposta) => {
            if(resposta.produto_fisico_id){
              this.imagensService.create(imagensProdutos, resposta.produto_fisico_id, result.selectProduto).subscribe(() => {
                this.produtoFisicoService.showMessage('Produto Físico cadastrado!');
                this.ngOnInit();
              });
            } else {
              this.produtoFisicoService.showMessage('Produto Físico cadastrado! \nImagens não cadastradas!', true);
              this.ngOnInit();
            }
          });
        }

        else if(result.selectProduto==='produtoDigital'){
          const produto: ProdutoDigital = {
            nome: result.nome,
            descricao: result.descricao,
            ativo: true,
            validade: result.validade,
          }
          const imagensProdutos = result.imagens
          this.produtoDigitalService.create(produto).subscribe((resposta) => {
            if(resposta.produto_digital_id){
              this.imagensService.create(imagensProdutos, resposta.produto_digital_id, result.selectProduto).subscribe(() => {
                this.produtoDigitalService.showMessage('Produto Digital cadastrado!');
                this.ngOnInit();
              });
            } else {
              this.produtoDigitalService.showMessage('Produto Físico cadastrado! \nImagens não cadastradas!', true);
              this.ngOnInit();
            }
          });
        }
      }
    });
  }

  // Modal de Edição de produto ************************************
  dialogEditarProduto(element: DialogData) {
    const dialogRef = this.dialog.open(ModalProdutosComponent, {
      width: '70%',
      data: {
        title: 'Editar produto',
        selectProduto: element.estoque ? 'produtoFisico' : 'produtoDigital',
        nome: element.nome,
        descricao: element.descricao,
        estoque: element.estoque,
        validade: element.validade,
        ativo: element.ativo,
        id: element.id,
        created_at: element.created_at,
        imagens: element.imagens,
        update_at: element.updated_at
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if(result){
        if(result.selectProduto==='produtoFisico'){
          const produto: ProdutoFisico = {
            id: result.id,
            ativo: result.ativo,
            nome: result.nome,
            descricao: result.descricao,
            estoque: result.estoque,
          }
          this.produtoFisicoService.update(produto).subscribe(() => {
            this.produtoFisicoService.showMessage('Produto Físico alterado!');
            this.ngOnInit();
          });
        }
        else {
          const produto: ProdutoDigital = {
            id: result.id,
            nome: result.nome,
            descricao: result.descricao,
            ativo: result.ativo,
            validade: result.validade
          }
          this.produtoDigitalService.update(produto).subscribe(() => {
            this.produtoDigitalService.showMessage('Produto Digital alterado!');
            this.ngOnInit();
          });
        }
      }
    });
  }

  // Modal de Exclusão de produto ************************************
  dialogExcluirProduto(element: DialogData) {
    const dialogRef = this.dialog.open(ModalProdutosComponent, {
      width: '60%',
      data: {
        title: 'Excluir produto',
        id: element.id,
        nome: element.nome,
        selectProduto: element.estoque ? 'produtoFisico' : 'produtoDigital',
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if(result){
        if(result.selectProduto==='produtoFisico'){
          this.produtoFisicoService.delete(result.id).subscribe(() => {
            this.produtoFisicoService.showMessage('Produto Físico excluído!');
            this.ngOnInit();
          });
        }
        else {
          this.produtoDigitalService.delete(result.id).subscribe(() => {
            this.produtoDigitalService.showMessage('Produto Digital excluído!');
            this.ngOnInit();
          });
        }
      }
    });
  }

  ativarDesativarProduto(produto: any) {
    if(produto?.estoque){
      this.produtoFisicoService.update(produto).subscribe(() => {
        this.produtoFisicoService.showMessage(produto.ativo===true ? 'Produto Físico ativado' : 'Produto Físico desativado');
      });
    } else {
      this.produtoDigitalService.update(produto).subscribe(() => {
        this.produtoDigitalService.showMessage(produto.ativo===true ? 'Produto Digital ativado' : 'Produto Digital desativado');
      });
    }
  }

  mudouPaginaFisico(event: PageEvent): void {
    this.buscarProdutosFisicos(event.pageIndex, event.pageSize);
  }

  mudouPaginaDigital(event: PageEvent): void {
    this.buscarProdutosDigitais(event.pageIndex, event.pageSize);
  }

  buscarProdutosFisicos(pagina: number, limite: number): void {
    const sort = () => {
      this.fonteProdutosFisicos = new MatTableDataSource(this.produtosFisicos);
      this.fonteProdutosFisicos.sort = this.sort;
    };
    this.produtoFisicoService.readPaginator(pagina, limite).subscribe(elem => {
      this.produtosFisicos = elem.instancias;
      this.tamanhoPaginacaoFisico = elem.total;
      sort();
    });
  }

  buscarProdutosDigitais(pagina: number, limite: number): void {
    const sort = () => {
      this.fonteProdutosDigitais = new MatTableDataSource(this.produtosDigitais);
      this.fonteProdutosDigitais.sort = this.sort;
    };
    this.produtoDigitalService.readPaginator(pagina, limite).subscribe(elem => {
      this.produtosDigitais = elem.instancias;
      this.tamanhoPaginacaoDigital = elem.total;
      sort();
    });
  }
}
