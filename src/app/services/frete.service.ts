import { SessaoService } from 'src/app/services/sessao.service';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { EMPTY, Observable } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { IFrete } from './../models/IFrete.model';

const { apiUrl } = environment;

@Injectable({
  providedIn: 'root'
})
export class FreteService {

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

  create(frete: IFrete): Observable<IFrete> {
    return this.http
      .post<IFrete>(`${apiUrl}/shippings`, frete)
      .pipe(
        map(obj => obj),
        catchError(e => this.errorHandler(e)),
      );
  }

  read(): Observable<IFrete[]> {
    return this.http
      .get<IFrete[]>(`${apiUrl}/shippings`)
      .pipe(
        map(obj => obj),
        catchError(e => this.errorHandler(e)),
      );
  }

  readById(id: number): Observable<IFrete> {
    const url = `${apiUrl}/shippings/${id}`;
    return this.http.get<IFrete>(url).pipe(
      map(obj => obj),
      catchError(e => this.errorHandler(e)),
    );
  }

  update(frete: IFrete, idFrete: number): Observable<IFrete> {
    const url = `${apiUrl}/shippings/${idFrete}`;
    return this.http.put<IFrete>(url, frete).pipe(
      map(obj => obj),
      catchError(e => this.errorHandler(e)),
    );
  }

  delete(id: number): Observable<IFrete> {
    const url = `${apiUrl}/shippings/${id}/destroy`;
    return this.http.delete<IFrete>(url).pipe(
      map(obj => obj),
      catchError(e => this.errorHandler(e)),
    );
  }
}
