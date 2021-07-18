// Angular
import { registerLocaleData } from '@angular/common';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import localeBr from '@angular/common/locales/pt';
import { DEFAULT_CURRENCY_CODE, LOCALE_ID, NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

// Material
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';

// NGX
import { CollapseModule } from 'ngx-bootstrap/collapse';
import { ToastrModule } from 'ngx-toastr';
import { AppRoutingModule } from './app-routing.module';

// Componentes e módulos de app
import { AppComponent } from './app.component';
import { ComponentsModule } from './components/components.module';
import { AutenticacaoInterceptor } from './interceptors/autenticacao.interceptor';
import { EsqueceuSenhaComponent } from './login/esqueceu-senha/esqueceu-senha.component';
import { LoginComponent } from './login/login.component';
import { RecuperarSenhaComponent } from './login/recuperar-senha/recuperar-senha.component';
import { PagesModule } from './pages/pages.module';
import { AutenticacaoService } from './services/autenticacao.service';

registerLocaleData(localeBr);

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    EsqueceuSenhaComponent,
    RecuperarSenhaComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    PagesModule,
    BrowserAnimationsModule,
    ComponentsModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,

    CollapseModule,
    ToastrModule,

    MatSnackBarModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatDialogModule,
    MatIconModule
  ],
  providers: [
    { provide: LOCALE_ID, useValue: 'pt-BR'},
    { provide: DEFAULT_CURRENCY_CODE, useValue: 'BRL' },
    { provide: HTTP_INTERCEPTORS, useClass: AutenticacaoInterceptor, multi: true, },
    AutenticacaoService
  ],
  bootstrap: [AppComponent],
})
export class AppModule { }
