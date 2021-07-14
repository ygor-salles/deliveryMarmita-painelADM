import { MatSnackBar } from '@angular/material/snack-bar';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import IAuthResponse from '../models/IAuthResponse.model';

const { apiUrl } = environment;

@Injectable({
  providedIn: 'root'
})
export class AutenticacaoService {

  constructor(private snackBar: MatSnackBar, private http: HttpClient) { }

  showMessage(msg: string, isError: boolean = false): void {
    this.snackBar.open(msg, 'X', {
      duration: 3000,
      horizontalPosition: 'right',
      verticalPosition: 'top',
      panelClass: isError ? ['msg-error'] : ['msg-success'],
    });
  }

  autenticar(email: string, password: string): Observable<IAuthResponse> {
    return this.http.post<IAuthResponse>(`${apiUrl}/auth/signin`, { email, password });
  }

  atualizarAutenticacao(refresh_token: string): Observable<IAuthResponse> {
    const headers = new HttpHeaders({ refresh_token });
    return this.http.post<IAuthResponse>(`${apiUrl}/auth/signin`, {}, { headers });
  }
}
