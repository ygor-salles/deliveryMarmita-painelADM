import { SessaoService } from 'src/app/services/sessao.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { EMPTY, Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import ICEP from '../models/ICep.model';

const { brasilApiUrl } = environment

@Injectable({
  providedIn: 'root'
})
export class CEPserviceService {
  constructor(
    private http: HttpClient,
    private snackBar: MatSnackBar,
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

  buscarUm(cep: string): Observable<ICEP> {
    return this.http.get<ICEP>(`${brasilApiUrl}/cep/v1/${cep}`);
  }
}
