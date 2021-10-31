import { SessaoService } from 'src/app/services/sessao.service';
import { IAcrescimo } from './../models/IAcrescimo.model';
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
export class AcrescimoService {

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

  create(acrescimo: IAcrescimo): Observable<IAcrescimo> {
    return this.http
      .post<IAcrescimo>(`${apiUrl}/additions`, acrescimo)
      .pipe(
        map(obj => obj),
        catchError(e => this.errorHandler(e)),
      );
  }

  read(): Observable<IAcrescimo[]> {
    return this.http
      .get<IAcrescimo[]>(`${apiUrl}/additions`)
      .pipe(
        map(obj => obj),
        catchError(e => this.errorHandler(e)),
      );
  }

  readById(id: number): Observable<IAcrescimo> {
    const url = `${apiUrl}/additions/${id}`;
    return this.http.get<IAcrescimo>(url).pipe(
      map(obj => obj),
      catchError(e => this.errorHandler(e)),
    );
  }

  update(acrescimo: IAcrescimo, idAcrescimo: number): Observable<IAcrescimo> {
    const url = `${apiUrl}/additions/${idAcrescimo}`;
    return this.http.put<IAcrescimo>(url, acrescimo).pipe(
      map(obj => obj),
      catchError(e => this.errorHandler(e)),
    );
  }

  patch(status: boolean, idAcrescimo: number): Observable<IAcrescimo> {
    const url = `${apiUrl}/additions/${idAcrescimo}/update-status`;
    return this.http.put<IAcrescimo>(url, { status: status }).pipe(
      map(obj => obj),
      catchError(e => this.errorHandler(e)),
    );
  }

  delete(id: number): Observable<IAcrescimo> {
    const url = `${apiUrl}/additions/${id}/destroy`;
    return this.http.delete<IAcrescimo>(url).pipe(
      map(obj => obj),
      catchError(e => this.errorHandler(e)),
    );
  }
}
