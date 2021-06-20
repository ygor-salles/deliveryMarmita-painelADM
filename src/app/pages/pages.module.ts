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
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatListModule } from '@angular/material/list';

// NGX, Outros
import { FileUploadModule } from '@iplab/ngx-file-upload';
import { NgxMaskModule } from 'ngx-mask'

// Módulos de pages
import { ComponentsModule } from './../components/components.module';

// Páginas(Componentes) da aplicação
import { ProdutosComponent } from './produtos/produtos.component';
import { PedidosComponent } from './pedidos/pedidos.component';
import { UsuariosComponent } from './usuarios/usuarios.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { HistoricoComponent } from './historico/historico.component';
import { AcordianComponent } from './acordian/acordian.component';
import { ModalProdutoComponent } from './produtos/modal-produto/modal-produto.component';
import { ModalImagemComponent } from './modal-imagem/modal-imagem.component';
import { ModalAlertComponent } from './modal-alert/modal-alert.component';

@NgModule({
  declarations: [
    ProdutosComponent,
    PedidosComponent,
    UsuariosComponent,
    DashboardComponent,
    HistoricoComponent,
    AcordianComponent,
    ModalProdutoComponent,
    ModalImagemComponent,
    ModalAlertComponent,
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
    MatTooltipModule,
    MatExpansionModule,
    MatListModule
  ],
  exports: [
    ProdutosComponent,
    PedidosComponent,
    UsuariosComponent,
  ],
  providers: [CurrencyPipe],
})

export class PagesModule {}
