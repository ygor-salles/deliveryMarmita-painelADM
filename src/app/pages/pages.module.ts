// Angular
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { NgModule } from '@angular/core';

// Material
import { MatDialogModule } from '@angular/material/dialog';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatTabsModule } from '@angular/material/tabs';
import { MatButtonModule } from '@angular/material/button';
import { MatTableModule } from '@angular/material/table';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule, MatRippleModule } from '@angular/material/core';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';

// NGX, Outros
import { FileUploadModule } from '@iplab/ngx-file-upload';
import { NgxMaskModule } from 'ngx-mask'

// Módulos de pages
import { ComponentsModule } from './../components/components.module';

// Páginas(Componentes) da aplicação
import { ProdutosComponent } from './produtos/produtos.component';
import { CuponsDeDescontoComponent } from './cupons-de-desconto/cupons-de-desconto.component';
import { ExibicaoComponent } from './exibicao/exibicao.component';
import { NotificacoesComponent } from './notificacoes/notificacoes.component';
import { PedidosComponent } from './pedidos/pedidos.component';
import { UsuariosComponent } from './usuarios/usuarios.component';
import { ModalProdutosComponent } from './produtos/modal-produtos/modal-produtos.component';
import { CardProdutosComponent } from './produtos/card-produtos/card-produtos.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { AdministradoresComponent } from './administradores/administradores.component';
import { ModalAdministradoresComponent } from './administradores/modal-administradores/modal-administradores.component';

@NgModule({
  declarations: [
    ProdutosComponent,
    CuponsDeDescontoComponent,
    ExibicaoComponent,
    NotificacoesComponent,
    PedidosComponent,
    UsuariosComponent,
    ModalProdutosComponent,
    CardProdutosComponent,
    DashboardComponent,
    AdministradoresComponent,
    ModalAdministradoresComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,

    ComponentsModule,

    FileUploadModule,
    NgxMaskModule.forRoot(),

    MatButtonModule,
    MatDialogModule,
    MatSidenavModule,
    MatTabsModule,
    MatTableModule,
    MatPaginatorModule,
    MatSnackBarModule,
    MatFormFieldModule,
    MatInputModule,
    MatCardModule,
    MatSelectModule,
    MatSlideToggleModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatRippleModule,
    MatSortModule,
  ],
  exports: [
    ProdutosComponent,
    CuponsDeDescontoComponent,
    ExibicaoComponent,
    NotificacoesComponent,
    PedidosComponent,
    UsuariosComponent,
    AdministradoresComponent
  ],
  providers: [CurrencyPipe],
})

export class PagesModule {}
