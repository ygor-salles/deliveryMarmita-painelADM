import { UsuarioAdminService } from './../../services/usuario-admin.service';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-esqueceu-senha',
  templateUrl: './esqueceu-senha.component.html',
  styleUrls: ['./esqueceu-senha.component.scss']
})
export class EsqueceuSenhaComponent implements OnInit {
  esqueceuSenhaForm!: FormGroup;

  showSpinner = false;

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private usuarioAdminService: UsuarioAdminService
  ) { }

  ngOnInit(): void {
    this.esqueceuSenhaForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
    });
  }

  async recuperarSenha(): Promise<void> {
    this.showSpinner = true;
    const email = this.esqueceuSenhaForm.get('email')?.value;
    this.usuarioAdminService.esqueceuSenha(email).subscribe(
      () => {
        this.usuarioAdminService.showMessage('Favor verificar sua caixa de entrada! Email de confirmação enviado!');
        this.router.navigate(['login']);
        this.showSpinner = false;
      },
      (e) => {
        if (e.status === 400) {
          this.usuarioAdminService.showMessage('Usuário inexistente!', true)
        } else {
          this.usuarioAdminService.showMessage(
            'Ocorreu um erro ao enviar email de confirmação, favor tente novamente mais tarde!', true
          );
        }
        this.showSpinner = false;
      },
    );
  }

  irParaLogin(): void {
    this.router.navigate(['login']);
  }

}
