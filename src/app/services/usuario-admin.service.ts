import { MatSnackBar } from '@angular/material/snack-bar';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

const { apiUrl } = environment

@Injectable({
  providedIn: 'root'
})
export class UsuarioAdminService {

  constructor(private http: HttpClient, private snackBar: MatSnackBar) { }

  showMessage(msg: string, isError: boolean = false): void {
    this.snackBar.open(msg, 'X', {
      duration: 3000,
      horizontalPosition: 'right',
      verticalPosition: 'top',
      panelClass: isError ? ['msg-error'] : ['msg-success'],
    });
  }

  esqueceuSenha(email: string): Observable<Object> {
    return this.http.post<Object>(`${apiUrl}/administrador/recuperar_senha`, { email });
  }

  redefinirSenha(email: string, senha: string, token: string): Observable<Object> {
    // let headers = new HttpHeaders();
    // headers = headers.append('recovery_token', token);
    return this.http.post<Object>(`${apiUrl}/administrador/redefinir_renha`, { email, senha, token });
  }
}
