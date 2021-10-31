import { SessaoService } from 'src/app/services/sessao.service';
import { IUsuario } from './../models/IUsuario.model';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { EMPTY, Observable } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';

const { apiUrl } = environment;

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {

  constructor(
    private snackBar: MatSnackBar,
    private http: HttpClient,
    private sessaoService: SessaoService
  ) { }

  showMessage(msg: string, isError = false): void {
    this.snackBar.open(msg, 'X', {
      duration: 3000,
      horizontalPosition: 'right',
      verticalPosition: 'top',
      panelClass: isError ? ['msg-error'] : ['msg-success'],
    });
  }

  errorHandler(e: HttpErrorResponse): Observable<never> {
    if (e.status) {
      this.showMessage(e.error.message, true);
    } else {
      this.sessaoService.clearLocalStorage();
      this.showMessage('Falha de conexão com a API!', true);
    }
    return EMPTY;
  }

  create(usuario: IUsuario): Observable<IUsuario> {
    return this.http
      .post<IUsuario>(`${apiUrl}/users`, usuario)
      .pipe(
        map(obj => obj),
        catchError(e => this.errorHandler(e)),
      );
  }

  read(): Observable<IUsuario[]> {
    return this.http
      .get<IUsuario[]>(`${apiUrl}/users`)
      .pipe(
        map(obj => obj),
        catchError(e => this.errorHandler(e)),
      );
  }

  readById(id: number): Observable<IUsuario> {
    const url = `${apiUrl}/users/${id}`;
    return this.http.get<IUsuario>(url).pipe(
      map(obj => obj),
      catchError(e => this.errorHandler(e)),
    );
  }

  update(usuario: IUsuario, idUsuario: number): Observable<IUsuario> {
    const url = `${apiUrl}/users/${idUsuario}`;
    return this.http.put<IUsuario>(url, usuario).pipe(
      map(obj => obj),
      catchError(e => this.errorHandler(e)),
    );
  }

  patch(usuario: IUsuario, idUsuario: number): Observable<IUsuario> {
    const url = `${apiUrl}/users/${idUsuario}`;
    const obj = {
      name: usuario.name,
      username: usuario.username,
      email: usuario.email,
      role: usuario.role
    }
    return this.http.put<IUsuario>(url, obj).pipe(
      map(obj => obj),
      catchError(e => this.errorHandler(e)),
    );
  }

  delete(id: number): Observable<IUsuario> {
    const url = `${apiUrl}/users/${id}/destroy`;
    return this.http.delete<IUsuario>(url).pipe(
      map(obj => obj),
      catchError(e => this.errorHandler(e)),
    );
  }
}
