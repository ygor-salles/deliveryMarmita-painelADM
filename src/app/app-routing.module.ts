import { FreteComponent } from './pages/frete/frete.component';
import { AcrescimoComponent } from './pages/acrescimo/acrescimo.component';
// Angular
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

// Guardas de autenticação
// import { AutenticacaoGuard } from './guards/autenticacao.guard';
// import { LoginGuard } from './guards/login.guard';

// Páginas da aplicação
import { LoginComponent } from './login/login.component';
import { UsuariosComponent } from './pages/usuarios/usuarios.component';
import { PedidosComponent } from './pages/pedidos/pedidos.component';
import { ProdutosComponent } from './pages/produtos/produtos.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { RecuperarSenhaComponent } from './login/recuperar-senha/recuperar-senha.component';
import { EsqueceuSenhaComponent } from './login/esqueceu-senha/esqueceu-senha.component';
import { HistoricoComponent } from './pages/historico/historico.component';

// const routes: Routes = [
//   {path: '',   redirectTo: 'dashboard', pathMatch: 'full'},
//   {path: 'login', canActivate: [LoginGuard], component: LoginComponent},
//   {path: 'recuperar-senha', canActivate: [LoginGuard], component: RecuperarSenhaComponent },
//   {path: 'esqueceu-senha', canActivate: [LoginGuard], component: EsqueceuSenhaComponent },
//   {path: 'dashboard', canActivate: [AutenticacaoGuard], component: DashboardComponent},
//   {path: 'produtos', canActivate: [AutenticacaoGuard], component: ProdutosComponent},
//   {path: 'pedidos', canActivate: [AutenticacaoGuard], component: PedidosComponent},
//   {path: 'usuarios', canActivate: [AutenticacaoGuard], component: UsuariosComponent},
//   {path: 'historico', canActivate: [AutenticacaoGuard], component: HistoricoComponent},
// ];
const routes: Routes = [
  {path: '',   redirectTo: 'dashboard', pathMatch: 'full'},
  {path: 'login', component: LoginComponent},
  {path: 'recuperar-senha', component: RecuperarSenhaComponent },
  {path: 'esqueceu-senha', component: EsqueceuSenhaComponent },
  {path: 'dashboard', component: DashboardComponent},
  {path: 'produtos', component: ProdutosComponent},
  {path: 'pedidos', component: PedidosComponent},
  {path: 'acrescimos', component: AcrescimoComponent},
  {path: 'frete', component: FreteComponent},
  {path: 'usuarios', component: UsuariosComponent},
  {path: 'historico', component: HistoricoComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
