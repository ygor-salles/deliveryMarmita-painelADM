import { IProduct } from '../models/IProduct.model';
import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { EMPTY, Observable } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { IPagedProduct } from '../models/IPagedProduct.model';

const { apiUrl } = environment;

@Injectable({
  providedIn: 'root'
})
export class ProdutoService {

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

  create(produto: IProduct): Observable<any> {
    return this.http
      .post<IProduct>(`${apiUrl}/products`, produto)
      .pipe(
        map(obj => obj),
        catchError(e => this.errorHandler(e)),
      );
  }

  read(): Observable<IProduct[]> {
    return this.http
      .get<IProduct[]>(`${apiUrl}/products`)
      .pipe(
        map(obj => obj),
        catchError(e => this.errorHandler(e)),
      );
  }

  readPaginator(
    pagina: number,
    limite: number,
    type: string,
  ): Observable<IPagedProduct> {
    let params = new HttpParams();
    params = params.append('type', type);
    params = params.append('page', pagina.toString());
    params = params.append('limit', limite.toString());

    return this.http
      .get<IPagedProduct>(`${apiUrl}/products/paged`, { params })
      .pipe(
        map(obj => obj),
        catchError(e => this.errorHandler(e)),
      );
  }

  readById(id: number): Observable<IProduct> {
    const url = `${apiUrl}/products/${id}`;
    return this.http.get<IProduct>(url).pipe(
      map(obj => obj),
      catchError(e => this.errorHandler(e)),
    );
  }

  update(produto: IProduct): Observable<IProduct> {
    const url = `${apiUrl}/products/${produto.id}`;
    return this.http.put<IProduct>(url, produto).pipe(
      map(obj => obj),
      catchError(e => this.errorHandler(e)),
    );
  }

  patch(isAtivo: boolean, id?: number): Observable<any> {
    const url = `${apiUrl}/products/${id}/ativo/${isAtivo}`;
    return this.http.patch(url, null).pipe(
      map(obj => obj),
      catchError(e => this.errorHandler(e)),
    );
  }

  delete(id: number): Observable<IProduct> {
    const url = `${apiUrl}/products/${id}`;
    return this.http.delete<IProduct>(url).pipe(
      map(obj => obj),
      catchError(e => this.errorHandler(e)),
    );
  }

  /* ******************************************** */
  readMarmita(pagina: number, limite: number): Observable<IPagedProduct> {
    console.log(pagina, limite);
    return this.http.get<IPagedProduct>(`${apiUrl}/marmitas`).pipe(
      map(obj => obj),
      catchError(e => this.errorHandler(e)),
    );
  }

  readBebida(pagina: number, limite: number): Observable<IPagedProduct> {
    console.log(pagina, limite);
    return this.http.get<IPagedProduct>(`${apiUrl}/bebidas`).pipe(
      map(obj => obj),
      catchError(e => this.errorHandler(e)),
    );
  }
}
