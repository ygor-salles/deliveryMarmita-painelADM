import { UsuarioService } from './../../services/usuario.service';
import { IUsuario } from './../../models/IUsuario.model';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-usuarios',
  templateUrl: './usuarios.component.html',
  styleUrls: ['./usuarios.component.scss']
})
export class UsuariosComponent implements OnInit {

  fonteUsuarios: IUsuario[] = [];
  displayedColumns = ['name', 'username', 'email', 'role', 'createdAt'];

  constructor(private usuarioService: UsuarioService) { }

  ngOnInit(): void {
    this.usuarioService.read().subscribe(usuarios => {
      this.fonteUsuarios = usuarios;
    });
  }

  dialogCadastrar(): void {
    console.log('Abrir modal para cadastro');
  }

  dialogEditar(event: MouseEvent, usuario: IUsuario): void {
    event.stopPropagation();
    console.log('Abrir modal de editar', usuario);
  }

  dialogExcluir(event: MouseEvent, usuario: IUsuario): void {
    event.stopPropagation();
    console.log('Abrir modal de exclusão', usuario);
  }

  tornarAdmin(usuario: IUsuario): void {
    console.log('Tornar admin', usuario);
  }

}
