import { ModalAdministradoresComponent } from './modal-administradores/modal-administradores.component';
import { AdministradoresService } from './../../services/administradores.service';
import { MatTableDataSource } from '@angular/material/table';
import { IadministradorPaginado } from './../../models/IadministradorPaginado.model';
import { Administrador } from './../../models/administrador.model';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatSort } from '@angular/material/sort';
import { Observable } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { PageEvent } from '@angular/material/paginator';

@Component({
  selector: 'app-administradores',
  templateUrl: './administradores.component.html',
  styleUrls: ['./administradores.component.scss']
})
export class AdministradoresComponent implements OnInit {

  // Parametros de entrada do componente - decorators
  @ViewChild(MatSort) sort!: MatSort;

  // Tabela administradores
  administradores!: Administrador[];
  $administradores!: Observable<IadministradorPaginado>;
  fonteAdministradores!: MatTableDataSource<Administrador>;
  displayedColumns = ['id', 'nome', 'email', 'perfil_id', 'created_at', 'ativo', 'acoes'];

  // Paginação
  tamanhoPaginacao = 0;
  tamanhoPagina = 10;
  opcoesPaginacao: number[] = [5, 10, 20, 50, 100];

  constructor(public dialog: MatDialog, private administradorService: AdministradoresService) { }

  ngOnInit(): void {
    this.buscarAdministradores(0, this.tamanhoPagina);
  }

  buscarAdministradores(pagina: number, limite: number): void {
    const sort = () => {
      this.fonteAdministradores = new MatTableDataSource(this.administradores);
      this.fonteAdministradores.sort = this.sort;
    };
    this.administradorService.readPaginator(pagina, limite).subscribe(elem => {
      this.administradores = elem.instancias;
      this.tamanhoPaginacao = elem.total;
      sort();
    });
  }

  // Modal de cadastrar Administrador *************************************
  dialogCadastrarAdministrador(): void {
    const dialogRef = this.dialog.open(ModalAdministradoresComponent, {
      width: '70%',
      data: { title: 'Cadastrar administrador' }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        const administrador: Administrador = {
          nome: result.nome,
          email: result.email,
          senha: result.senha,
          perfil_id: parseInt(result.perfil_id)
        }
        this.administradorService.create(administrador).subscribe(() => {
          this.administradorService.showMessage('Administrador cadastrado com sucesso!');
          this.ngOnInit();
        });
      }
    });
  }

  // Modal de editar Administrador *************************************
  dialogEditarAdministrador(element: Administrador): void {
    const dialogRef = this.dialog.open(ModalAdministradoresComponent, {
      width: '70%',
      data: {
        title: 'Editar administrador',
        id: element.id,
        nome: element.nome,
        email: element.email,
        perfil_id: element.perfil_id
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        let administrador: Administrador;
        if(result.senha){
          administrador = {
            id: result.id,
            nome: result.nome,
            email: result.email,
            senha: result.senha,
            perfil_id: parseInt(result.perfil_id)
          }
        }
        else {
          administrador = {
            id: result.id,
            nome: result.nome,
            email: result.email,
            perfil_id: parseInt(result.perfil_id)
          }
        }
        this.administradorService.update(administrador).subscribe(() => {
          this.administradorService.showMessage('Administrador cadastrado com sucesso!');
          this.ngOnInit();
        });
      }
    });
  }

  // Modal de editar Administrador *************************************
  dialogExcluirAdministrador(element: Administrador): void {
    const dialogRef = this.dialog.open(ModalAdministradoresComponent, {
      width: '70%',
      data: { title: 'Excluir administrador', id: element.id, nome: element.nome }
    });

    dialogRef.afterClosed().subscribe(result => {
      if(result) {
        this.administradorService.delete(result.id).subscribe(() => {
          this.administradorService.showMessage('Administrador excluído com sucesso!');
          this.ngOnInit();
        });
      }
    });
  }

  mudouPagina(event: PageEvent): void {
    this.buscarAdministradores(event.pageIndex, event.pageSize);
  }

  ativarDesativarAdministrador(admin: any): void {
    this.administradorService.update(admin).subscribe(() => {
      this.administradorService.showMessage(admin.ativo === true ? 'Administrador ativado' : 'Administrador desativado');
    });
  }

}
