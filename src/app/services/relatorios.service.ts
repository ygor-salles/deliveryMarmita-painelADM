import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { MatSnackBar } from '@angular/material/snack-bar';
import { EMPTY, Observable } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

const { apiUrl } = environment;

interface IReports {
  arrayDay: { value: number; name: string; }[];
  totalDay: number;
  arrayWeek: { value: number; name: string; }[];
  totalWeek: number;
  arrayMonth: { value: number; name: string; }[];
  totalMonth: number;
}

@Injectable({
  providedIn: 'root'
})
export class RelatoriosService {

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

  handle(): Observable<IReports> {
    return this.http.get<IReports>(`${apiUrl}/orders/bestSellers/dashboard`).pipe(
      map(obj => obj),
      catchError(e => this.errorHandler(e)),
    );
  }
}
