import { ModalAlertComponent } from './../../modal-alert/modal-alert.component';
import { IUsuario } from './../../../models/IUsuario.model';
import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { passwordValidator } from 'src/app/utils/validators/password-validator';

@Component({
  selector: 'app-modal-usuario',
  templateUrl: './modal-usuario.component.html',
  styleUrls: ['./modal-usuario.component.scss']
})
export class ModalUsuarioComponent implements OnInit {

  usuarioForm: FormGroup;
  vaiEditar: boolean;
  hide = true;

  constructor(
    public dialogRef: MatDialogRef<ModalUsuarioComponent>,
    @Inject(MAT_DIALOG_DATA) public data: IUsuario,
    private formBuilder: FormBuilder,
    public dialog: MatDialog
  ) { }

  ngOnInit(): void {
    if (this.data.title === 'Editar usuário') this.vaiEditar = true;
    else this.vaiEditar = false;

    this.usuarioForm = this.formBuilder.group({
      name: [this.data.name, Validators.required],
      username: [this.data.username, Validators.required],
      email: [this.data.email, [Validators.email, Validators.required]],
      password: ['', [Validators.minLength(7), passwordValidator]],
      confirmPassword: ['', [Validators.minLength(7), passwordValidator]],
    });
  }

  onNoClick(): void {
    this.dialogRef.close(null);
  }

  confirm(): void {
    const password = this.usuarioForm.get('password').value;
    const confirmPassword = this.usuarioForm.get('confirmPassword').value;
    if (password && confirmPassword && password !== confirmPassword) {
      this.dialog.open(ModalAlertComponent, {
        width: 'auto',
        height: 'auto',
        data: { title: 'Atenção', text: 'Senha e confirmar senha não são iguais!' }
      });
    } else {
      const novoUsuario = this.usuarioForm.getRawValue() as IUsuario;
      this.dialogRef.close({ ...novoUsuario, id: this.data.id });
    }
  }

}
