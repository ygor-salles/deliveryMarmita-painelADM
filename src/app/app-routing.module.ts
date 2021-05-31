// Angular
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

// Guardas de autenticação
import { AutenticacaoGuard } from './guards/autenticacao.guard';
import { LoginGuard } from './guards/login.guard';

// Páginas da aplicação
import { LoginComponent } from './login/login.component';
import { NotificacoesComponent } from './pages/notificacoes/notificacoes.component';
import { CuponsDeDescontoComponent } from './pages/cupons-de-desconto/cupons-de-desconto.component';
import { UsuariosComponent } from './pages/usuarios/usuarios.component';
import { PedidosComponent } from './pages/pedidos/pedidos.component';
import { ExibicaoComponent } from './pages/exibicao/exibicao.component';
import { ProdutosComponent } from './pages/produtos/produtos.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { RecuperarSenhaComponent } from './login/recuperar-senha/recuperar-senha.component';
import { EsqueceuSenhaComponent } from './login/esqueceu-senha/esqueceu-senha.component';
import { AdministradoresComponent } from './pages/administradores/administradores.component';

// const routes: Routes = [
//   {path: '',   redirectTo: 'dashboard', pathMatch: 'full'},
//   {path: 'login', canActivate: [LoginGuard], component: LoginComponent},
//   {path: 'recuperar-senha', canActivate: [LoginGuard], component: RecuperarSenhaComponent },
//   {path: 'esqueceu-senha', canActivate: [LoginGuard], component: EsqueceuSenhaComponent },
//   {path: 'dashboard', canActivate: [AutenticacaoGuard], component: DashboardComponent},
//   {path: 'produtos', canActivate: [AutenticacaoGuard], component: ProdutosComponent},
//   {path: 'exibicao', canActivate: [AutenticacaoGuard], component: ExibicaoComponent},
//   {path: 'pedidos', canActivate: [AutenticacaoGuard], component: PedidosComponent},
//   {path: 'usuarios', canActivate: [AutenticacaoGuard], component: UsuariosComponent},
//   {path: 'administradores', canActivate: [AutenticacaoGuard], component: AdministradoresComponent},
//   {path: 'cupons-de-desconto', canActivate: [AutenticacaoGuard], component: CuponsDeDescontoComponent},
//   {path: 'notificacoes', canActivate: [AutenticacaoGuard], component: NotificacoesComponent},
// ];
const routes: Routes = [
  {path: '',   redirectTo: 'dashboard', pathMatch: 'full'},
  {path: 'login', component: LoginComponent},
  {path: 'recuperar-senha', component: RecuperarSenhaComponent },
  {path: 'esqueceu-senha', component: EsqueceuSenhaComponent },
  {path: 'dashboard', component: DashboardComponent},
  {path: 'produtos', component: ProdutosComponent},
  {path: 'exibicao', component: ExibicaoComponent},
  {path: 'pedidos', component: PedidosComponent},
  {path: 'usuarios', component: UsuariosComponent},
  {path: 'administradores', component: AdministradoresComponent},
  {path: 'cupons-de-desconto', component: CuponsDeDescontoComponent},
  {path: 'notificacoes', component: NotificacoesComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
