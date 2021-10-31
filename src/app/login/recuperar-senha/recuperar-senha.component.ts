import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { UsuarioAdminService } from 'src/app/services/usuario-admin.service';
import { passwordValidator } from 'src/app/utils/validators/password-validator';

@Component({
  selector: 'app-recuperar-senha',
  templateUrl: './recuperar-senha.component.html',
  styleUrls: ['./recuperar-senha.component.scss']
})
export class RecuperarSenhaComponent implements OnInit {
  recuperarSenhaForm: FormGroup;
  token: string;
  hide = true;

  constructor(
    private formBuilder: FormBuilder,
    private usuarioAdminService: UsuarioAdminService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
  ) { }

  ngOnInit(): void {
    this.activatedRoute.queryParams.subscribe(params => {
      this.token = params.token;
    });

    this.recuperarSenhaForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: [
        '',
        [Validators.required, passwordValidator, Validators.minLength(7)],
      ],
      // 'confirm-password': [
      //   '',
      //   [Validators.required, passwordValidator, Validators.minLength(7)],
      // ],
      codVerificacao: ['', Validators.required]
    });
  }

  async recuperarSenha(): Promise<void> {
    const email = this.recuperarSenhaForm.get('email')?.value
    const senha = this.recuperarSenhaForm.get('password')?.value;
    // const confirmarSenha = this.recuperarSenhaForm.get('confirm-password')?.value;
    const codVerificacao = this.recuperarSenhaForm.get('codVerificacao')?.value;

    // if (senha !== confirmarSenha) {
    //   this.usuarioAdminService.showMessage(
    //     'Para alterar a senha, você deve confirma-lá corretamente! \nSenhas diferentes!', true);
    //   return;
    // }

    this.usuarioAdminService.redefinirSenha(email, senha, codVerificacao).subscribe(
      () => {
        this.usuarioAdminService.showMessage('Sua senha foi alterada com sucesso!');
        this.router.navigate(['pedidos']);
      },
      (e) => {
        this.usuarioAdminService.showMessage(
          e.status === 400 ? 'Código de verificação inválido'
            : 'Houve erro ao recuperar a senha, tente novamente mais tarde!', true
        );
      },
    );
  }

  irParaLogin(): void {
    this.router.navigate(['login']);
  }

}
