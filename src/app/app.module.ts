// Angular
import { NgModule, LOCALE_ID, DEFAULT_CURRENCY_CODE } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { registerLocaleData } from '@angular/common';
import localeBr from '@angular/common/locales/pt';

// NGX
import { CollapseModule } from 'ngx-bootstrap/collapse';
import { ToastrModule } from 'ngx-toastr';

// Material
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';

// Componentes e módulos de app
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { PagesModule } from './pages/pages.module';
import { ComponentsModule } from './components/components.module';
import { LoginComponent } from './login/login.component';
import { InfoModalComponent } from './login/info-modal/info-modal.component';
import { AutenticacaoInterceptor } from './interceptors/autenticacao.interceptor';
import { AutenticacaoService } from './services/autenticacao.service';
import { EsqueceuSenhaComponent } from './login/esqueceu-senha/esqueceu-senha.component';
import { RecuperarSenhaComponent } from './login/recuperar-senha/recuperar-senha.component';


registerLocaleData(localeBr);

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    InfoModalComponent,
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
    MatDialogModule
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
