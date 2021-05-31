import { passwordValidator } from 'src/app/utils/validators/password-validator';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Administrador } from 'src/app/models/administrador.model';

interface FormAdministrador {
  title: string;
  id: number;
  nome: string;
  email: string;
  perfil_id: number;
  senha: string;
  confirmarSenha: string;
}

@Component({
  selector: 'app-modal-administradores',
  templateUrl: './modal-administradores.component.html',
  styleUrls: ['./modal-administradores.component.scss']
})
export class ModalAdministradoresComponent implements OnInit {

  public adminForm!: FormGroup;
  public vaiEditar!: boolean;

  constructor(
    public dialogRef: MatDialogRef<ModalAdministradoresComponent>,
    @Inject(MAT_DIALOG_DATA) public data: FormAdministrador,
    private formBuilder: FormBuilder,
  ) { }

  ngOnInit(): void {
    this.data.title === 'Editar administrador' ? this.vaiEditar=true : this.vaiEditar=false;

    if(this.vaiEditar){
      this.adminForm = this.formBuilder.group({
        perfil_id: [{value: this.data.perfil_id.toString(), disabled: false}, Validators.required],
        nome: [this.data.nome, Validators.required],
        email: [this.data.email, [Validators.required, Validators.email]],
        senha: ['', [Validators.minLength(7), passwordValidator]],
        confirmarSenha: ['', [Validators.minLength(7), passwordValidator]],
      })
    } else {
      this.adminForm = this.formBuilder.group({
        perfil_id: [{value: this.data.perfil_id, disabled: false}, Validators.required],
        nome: [this.data.nome, Validators.required],
        email: [this.data.email, [Validators.required, Validators.email]],
        senha: ['', [Validators.required, Validators.minLength(7), passwordValidator]],
        confirmarSenha: ['', [Validators.required, Validators.minLength(7), passwordValidator]],
      })
    }
  }

  onNoClick() {
    this.dialogRef.close(null);
  }

  confirm() {
    const novoAdministrador = this.adminForm.getRawValue() as Administrador;
    this.dialogRef.close({
      ...novoAdministrador,
      id: this.data.id
    });
  }

}
