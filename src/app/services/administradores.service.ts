import { HttpClient, HttpParams } from '@angular/common/http';
import { MatSnackBar } from '@angular/material/snack-bar';
import { environment } from 'src/environments/environment';
import { Injectable } from '@angular/core';
import { Administrador } from '../models/administrador.model';
import { Observable, EMPTY } from 'rxjs';
import { IadministradorPaginado } from '../models/IadministradorPaginado.model';
import { map, catchError } from 'rxjs/operators';

const { apiUrl } = environment;

interface RespostaCadastroAdministrador {
  operador_id: number;
}

@Injectable({
  providedIn: 'root'
})
export class AdministradoresService {

  constructor(private snackBar: MatSnackBar, private http: HttpClient) {}

  showMessage(msg: string, isError: boolean = false): void {
    this.snackBar.open(msg, 'X', {
      duration: 3000,
      horizontalPosition: 'right',
      verticalPosition: 'top',
      panelClass: isError ? ['msg-error'] : ['msg-success'],
    });
  }

  create(admin: Administrador): Observable<RespostaCadastroAdministrador> {
    return this.http.post<Administrador>(`${apiUrl}/administrador`, admin).pipe(
      map((obj) => obj),
      catchError((e) => this.errorHandler(e))
    );
  }

  read(): Observable<IadministradorPaginado> {
    return this.http.get<IadministradorPaginado>(`${apiUrl}/administrador`).pipe(
      map((obj) => obj),
      catchError((e) => this.errorHandler(e))
    );
  }

  readPaginator(pagina: number, limite: number): Observable<IadministradorPaginado> {
    let params = new HttpParams();
    params = params.append('pagina', pagina.toString());
    params = params.append('limite', limite.toString());

    return this.http.get<IadministradorPaginado>(`${apiUrl}/administrador`, { params }).pipe(
      map((obj) => obj),
      catchError((e) => this.errorHandler(e))
    );
  }

  readById(id: number): Observable<Administrador> {
    const url = `${apiUrl}/administrador/${id}`;
    return this.http.get<Administrador>(url).pipe(
      map((obj) => obj),
      catchError((e) => this.errorHandler(e))
    );
  }

  update(admin: Administrador): Observable<Administrador> {
    const url = `${apiUrl}/administrador/${admin.id}`;
    return this.http.put<Administrador>(url, admin).pipe(
      map((obj) => obj),
      catchError((e) => this.errorHandler(e))
    );
  }

  delete(id: number): Observable<Administrador> {
    const url = `${apiUrl}/administrador/${id}`;
    return this.http.delete<Administrador>(url).pipe(
      map((obj) => obj),
      catchError((e) => this.errorHandler(e))
    );
  }

  errorHandler(e: any): Observable<any> {
    this.showMessage(e, true);
    return EMPTY;
  }
}
