import { IPagedOrder } from '../models/IPagedOrder.model';
import { HttpClient, HttpParams, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { EMPTY, Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { IOrder } from '../models/IOrder.model';
import { catchError, map } from 'rxjs/operators';
import { IFilterOrder } from '../models/IFilterOrder.model';

const { apiUrl } = environment;

interface IPedidoUpdate {
  status: string;
}

@Injectable({
  providedIn: 'root'
})
export class PedidoService {

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

  create(pedido: IOrder): Observable<IOrder> {
    return this.http
      .post<IOrder>(`${apiUrl}/orders`, pedido)
      .pipe(
        map(obj => obj),
        catchError(e => this.errorHandler(e)),
      );
  }

  read(): Observable<IOrder[]> {
    return this.http
      .get<IOrder[]>(`${apiUrl}/orders`)
      .pipe(
        map(obj => obj),
        catchError(e => this.errorHandler(e)),
      );
  }

  readPaginator(
    pagina: number,
    limite: number,
    filtros?: IFilterOrder,
  ): Observable<IPagedOrder> {
    let params = new HttpParams();
    params = params.append('page', pagina.toString());
    params = params.append('limit', limite.toString());

    if (filtros) {
      // eslint-disable-next-line no-restricted-syntax
      for (const key in filtros) {
        if (filtros[key as keyof IFilterOrder]) {
          params = params.append(
            key,
            filtros[key as keyof IFilterOrder]?.toString() || '',
          );
        }
      }
    }

    return this.http
      .get<IPagedOrder>(`${apiUrl}/orders/paged`, { params })
      .pipe(
        map(obj => obj),
        catchError(e => this.errorHandler(e)),
      );
  }

  readById(id: number): Observable<IOrder> {
    const url = `${apiUrl}/orders/${id}`;
    return this.http.get<IOrder>(url).pipe(
      map(obj => obj),
      catchError(e => this.errorHandler(e)),
    );
  }

  update(pedido: IOrder, idPedido: number): Observable<IOrder> {
    const url = `${apiUrl}/orders/${idPedido}`;
    return this.http.put<IOrder>(url, pedido).pipe(
      map(obj => obj),
      catchError(e => this.errorHandler(e)),
    );
  }

  patch(status: string, idPedido: number): Observable<IPedidoUpdate> {
    const url = `${apiUrl}/orders/${idPedido}/changeStatus`;
    return this.http.put<IPedidoUpdate>(url, { status: status }).pipe(
      map(obj => obj),
      catchError(e => this.errorHandler(e)),
    );
  }

  delete(id: number): Observable<IOrder> {
    const url = `${apiUrl}/orders/${id}`;
    return this.http.delete<IOrder>(url).pipe(
      map(obj => obj),
      catchError(e => this.errorHandler(e)),
    );
  }
}
