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

  constructor(private snackBar: MatSnackBar, private http: HttpClient) { }

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
      this.showMessage('Falha de conexão com a API!', true);
    }
    return EMPTY;
  }

  create(usuario: IUsuario): Observable<any> {
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

  delete(id: number): Observable<IUsuario> {
    const url = `${apiUrl}/users/${id}`;
    return this.http.delete<IUsuario>(url).pipe(
      map(obj => obj),
      catchError(e => this.errorHandler(e)),
    );
  }
}
