import { IProduct } from '../models/IProduct.model';
import { HttpClient, HttpParams } from '@angular/common/http';
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

  errorHandler(e: string): Observable<any> {
    this.showMessage(e, true);
    return EMPTY;
  }

  create(produto: IProduct): Observable<IProduct> {
    return this.http
      .post<IProduct>(`${apiUrl}/produto`, produto)
      .pipe(
        map(obj => obj),
        catchError(_ => this.errorHandler('Erro ao cadastrar produto!')),
      );
  }

  read(): Observable<IProduct[]> {
    return this.http
      .get<IProduct[]>(`${apiUrl}/produto/sem_paginacao`)
      .pipe(
        map(obj => obj),
        catchError(_ => this.errorHandler('Erro ao ler dados de produtos!')),
      );
  }

  readPaginator(
    pagina: number,
    limite: number,
  ): Observable<IPagedProduct> {
    let params = new HttpParams();
    params = params.append('pagina', pagina.toString());
    params = params.append('limite', limite.toString());

    return this.http
      .get<IPagedProduct>(`${apiUrl}/produto`, { params })
      .pipe(
        map(obj => obj),
        catchError(e =>
          this.errorHandler(
            `Erro ao ler dados de produtos! \n${e.error ? e.error : ''}`,
          ),
        ),
      );
  }

  readById(id: number): Observable<IProduct> {
    const url = `${apiUrl}/produto/${id}`;
    return this.http.get<IProduct>(url).pipe(
      map(obj => obj),
      catchError(_ => this.errorHandler('Erro ao ler produto!')),
    );
  }

  update(produto: IProduct): Observable<IProduct> {
    const url = `${apiUrl}/produto/${produto.id}`;
    return this.http.put<IProduct>(url, produto).pipe(
      map(obj => obj),
      catchError(_ =>
        this.errorHandler('Erro ao atualizar dados de produto!'),
      ),
    );
  }

  patch(isAtivo: boolean, id?: number): Observable<any> {
    const url = `${apiUrl}/produto/${id}/ativo/${isAtivo}`;
    return this.http.patch(url, null).pipe(
      map(obj => obj),
      catchError(_ => this.errorHandler('Erro ao alterar status do produto!')),
    );
  }

  delete(id: number): Observable<IProduct> {
    const url = `${apiUrl}/produto/${id}`;
    return this.http.delete<IProduct>(url).pipe(
      map(obj => obj),
      catchError(_ => this.errorHandler('Erro ao deletar produto!')),
    );
  }

  /* ******************************************** */
  readMarmita(pagina: number, limite: number): Observable<IPagedProduct> {
    console.log(pagina, limite);
    return this.http.get<IPagedProduct>(`${apiUrl}/marmitas`).pipe(
      map(obj => obj),
      catchError(_ => this.errorHandler('Erro ao ler dados de marmitas!')),
    );
  }

  readBebida(pagina: number, limite: number): Observable<IPagedProduct> {
    console.log(pagina, limite);
    return this.http.get<IPagedProduct>(`${apiUrl}/bebidas`).pipe(
      map(obj => obj),
      catchError(_ => this.errorHandler('Erro ao ler dados de bebidas!')),
    );
  }
}
