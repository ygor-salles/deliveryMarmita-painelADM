import { SessaoService } from 'src/app/services/sessao.service';
import { MatSelectChange } from '@angular/material/select';
import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { IUsuario } from './../../models/IUsuario.model';
import { UsuarioService } from './../../services/usuario.service';
import { ModalUsuarioComponent } from './modal-usuario/modal-usuario.component';

@Component({
  selector: 'app-usuarios',
  templateUrl: './usuarios.component.html',
  styleUrls: ['./usuarios.component.scss']
})
export class UsuariosComponent implements OnInit {

  fonteUsuarios: IUsuario[] = [];
  displayedColumns = ['name', 'username', 'email', 'role', 'created_at', 'actions'];
  listUser = ['admin', 'user'];

  showSpinner = false;

  constructor(
    private usuarioService: UsuarioService,
    private dialog: MatDialog,
    private sessaoService: SessaoService,
  ) { }

  ngOnInit(): void {
    this.showSpinner = true;
    this.usuarioService.read().subscribe(usuarios => {
      this.fonteUsuarios = usuarios;
      this.showSpinner = false;
    });
  }

  isHimself(idUser: number): boolean {
    return this.sessaoService.checkIdUser(idUser);
  }

  dialogCadastrar(): void {
    const dialogRef = this.dialog.open(ModalUsuarioComponent, {
      width: '50%',
      data: { title: 'Cadastrar usuário' }
    });

    dialogRef.afterClosed().subscribe((result: IUsuario) => {
      if (result) {
        const usuario: IUsuario = {
          name: result.name,
          email: result.email,
          username: result.username,
          password: result.password,
          role: 'user',
        }
        this.usuarioService.create(usuario).subscribe(() => {
          this.usuarioService.showMessage('Usuário cadastrado com sucesso!');
          this.ngOnInit();
        });
      }
    });
  }

  dialogEditar(event: MouseEvent, usuario: IUsuario): void {
    event.stopPropagation();
    const dialogRef = this.dialog.open(ModalUsuarioComponent, {
      width: '50%',
      data: {
        title: 'Editar usuário',
        id: usuario.id,
        name: usuario.name,
        email: usuario.email,
        username: usuario.username,
        role: usuario.role
      }
    });

    dialogRef.afterClosed().subscribe((result: IUsuario) => {
      if (result) {
        const usuario: IUsuario = {
          name: result.name,
          email: result.email,
          username: result.username,
          role: result.role,
        }
        this.usuarioService.update(usuario, result.id).subscribe(() => {
          this.usuarioService.showMessage('Usuário alterado com sucesso!');
          this.ngOnInit();
        });
      }
    });
  }

  dialogExcluir(event: MouseEvent, usuario: IUsuario): void {
    event.stopPropagation();

    if (!this.isHimself(usuario.id)) {
      const dialogRef = this.dialog.open(ModalUsuarioComponent, {
        width: '50%',
        data: { title: 'Excluir usuário', id: usuario.id, name: usuario.name }
      });

      dialogRef.afterClosed().subscribe((result: IUsuario) => {
        if (result) {
          this.usuarioService.delete(result.id).subscribe(() => {
            this.usuarioService.showMessage('Usuário excluído com sucesso!');
            this.ngOnInit();
          });
        }
      });
    }
  }

  selectTypeUser(event: MatSelectChange, usuario: IUsuario): void {
    usuario.role = event.value;
    this.usuarioService.patch(usuario, usuario.id).subscribe(() => {
      this.usuarioService.showMessage('Tipo de usuário atualizado com sucesso!');
    });
  }

}
