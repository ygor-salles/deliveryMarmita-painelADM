import { InfoModalComponent } from './info-modal/info-modal.component';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { AutenticacaoService } from 'src/app/services/autenticacao.service';
import { SessaoService } from 'src/app/services/sessao.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  loginForm!: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private autenticacaoService: AutenticacaoService,
    private sessaoService: SessaoService,
    private dialog: MatDialog,
    private router: Router,
  ) { }

  ngOnInit(): void {
    this.loginForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      senha: ['', [Validators.required]],
    });
  }

  async login(): Promise<void> {
    const email = this.loginForm.get('email')?.value;
    const senha = this.loginForm.get('senha')?.value;

    this.autenticacaoService.autenticar(email, senha).subscribe(
      ({ refresh_token, token }) => {
        this.autenticacaoService.showMessage('O login foi efetuado com sucesso!');
        this.sessaoService.setToken(token);
        this.sessaoService.setRefreshToken(refresh_token);
        this.router.navigate(['dashboard']);
      },
      () => {
        this.autenticacaoService.showMessage('Credenciais incorretas, tente novamente', true);
      },
    );
  }

  ajuda(): void {
    this.dialog.open(InfoModalComponent, {
      width: 'auto',
      height: 'auto',
      data: {
        title: 'Ajuda',
        text: [
          'Caso esteja tendo problema para acessar o painel envie um email para: '+
          'contato@gizelemonteiro.com.br'
        ],
      },
    });
  }

  esqueciASenha(): void {
    this.router.navigate(['esqueceu-senha']);
  }
}
