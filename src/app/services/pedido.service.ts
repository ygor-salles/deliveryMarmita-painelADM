import { IPedidoPaginado } from './../models/IPedidoPaginado.model';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { EMPTY, Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { IPedido } from '../models/IPedido.model';
import { catchError, map } from 'rxjs/operators';
import { IFiltroPedido } from '../models/IFiltroPedido.model';

const { apiUrl } = environment;

interface IPedidoUpdate {
  status_id?: number;
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

  errorHandler(e: string): Observable<any> {
    this.showMessage(e, true);
    return EMPTY;
  }

  create(pedido: IPedido): Observable<IPedido> {
    return this.http
      .post<IPedido>(`${apiUrl}/pedido`, pedido)
      .pipe(
        map(obj => obj),
        catchError(_ => this.errorHandler('Erro ao cadastrar pedido!')),
      );
  }

  read(): Observable<IPedido[]> {
    return this.http
      .get<IPedido[]>(`${apiUrl}/pedido/sem_paginacao`)
      .pipe(
        map(obj => obj),
        catchError(_ => this.errorHandler('Erro ao ler dados de produtos!')),
      );
  }

  readPaginator(
    pagina: number,
    limite: number,
    filtros?: IFiltroPedido,
  ): Observable<IPedidoPaginado> {
    let params = new HttpParams();

    if (filtros) {
      // eslint-disable-next-line no-restricted-syntax
      for (const key in filtros) {
        if (filtros[key as keyof IFiltroPedido]) {
          params = params.append(
            key,
            filtros[key as keyof IFiltroPedido]?.toString() || '',
          );
        }
      }
    } else {
      params = params.append('pagina', pagina.toString());
      params = params.append('limite', limite.toString());
    }

    return this.http
      .get<IPedidoPaginado>(`${apiUrl}/pedido`, { params })
      .pipe(
        map(obj => obj),
        catchError(e =>
          this.errorHandler(
            `Erro ao ler dados de pedidos!\n${e.error ? e.error : ''}`,
          ),
        ),
      );
  }

  readById(id: number): Observable<IPedido> {
    const url = `${apiUrl}/pedido/${id}`;
    return this.http.get<IPedido>(url).pipe(
      map(obj => obj),
      catchError(_ => this.errorHandler('Erro ao ler pedido!')),
    );
  }

  update(pedido: IPedido): Observable<IPedido> {
    const url = `${apiUrl}/pedido/${pedido.id}`;
    return this.http.put<IPedido>(url, pedido).pipe(
      map(obj => obj),
      catchError(_ =>
        this.errorHandler('Erro ao atualizar dados de pedido!'),
      ),
    );
  }

  patch(pedido?: IPedidoUpdate, idPedido?: number): Observable<IPedidoUpdate> {
    const url = `${apiUrl}/pedido/${idPedido}/${pedido?.status_id}`;
    return this.http.put<IPedidoUpdate>(url, null).pipe(
      map(obj => obj),
      catchError(_ => this.errorHandler('Erro ao atualizar dados de pedido!')),
    );
  }

  delete(id: number): Observable<IPedido> {
    const url = `${apiUrl}/pedido/${id}`;
    return this.http.delete<IPedido>(url).pipe(
      map(obj => obj),
      catchError(_ => this.errorHandler('Erro ao deletar pedido!')),
    );
  }

  /* ******************************************** */
  readPedido(pagina: number, limite: number): Observable<IPedidoPaginado> {
    console.log(pagina, limite);
    return this.http.get<IPedidoPaginado>(`${apiUrl}/pedidos`).pipe(
      map(obj => obj),
      catchError(_ => this.errorHandler('Erro ao ler dados de pedido!')),
    );
  }
}
