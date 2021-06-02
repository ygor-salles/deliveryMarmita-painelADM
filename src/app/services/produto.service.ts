import { IProduto } from './../models/IProduto.model';
import { HttpClient, HttpParams } from '@angular/common/http';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { EMPTY, Observable } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { IProdutoPaginado } from '../models/IProdutoPaginado.model';

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

  create(product: IProduto): Observable<IProduto> {
    return this.http
      .post<IProduto>(`${apiUrl}/produto_fisico`, product)
      .pipe(
        map(obj => obj),
        catchError(_ => this.errorHandler('Erro ao cadastrar produto!')),
      );
  }

  read(): Observable<IProduto[]> {
    return this.http
      .get<IProduto[]>(`${apiUrl}/produto_fisico/sem_paginacao`)
      .pipe(
        map(obj => obj),
        catchError(_ => this.errorHandler('Erro ao ler dados de produtos!')),
      );
  }

  readPaginator(
    pagina: number,
    limite: number,
  ): Observable<IProdutoPaginado> {
    let params = new HttpParams();
    params = params.append('pagina', pagina.toString());
    params = params.append('limite', limite.toString());

    return this.http
      .get<IProdutoPaginado>(`${apiUrl}/produto_fisico`, { params })
      .pipe(
        map(obj => obj),
        catchError(e =>
          this.errorHandler(
            `Erro ao ler dados de produtos! \n${e.error ? e.error : ''}`,
          ),
        ),
      );
  }

  readById(id: number): Observable<IProduto> {
    const url = `${apiUrl}/produto_fisico/${id}`;
    return this.http.get<IProduto>(url).pipe(
      map(obj => obj),
      catchError(_ => this.errorHandler('Erro ao ler produto!')),
    );
  }

  update(product: IProduto): Observable<IProduto> {
    const url = `${apiUrl}/produto_fisico/${product.id}`;
    return this.http.put<IProduto>(url, product).pipe(
      map(obj => obj),
      catchError(_ =>
        this.errorHandler('Erro ao atualizar dados de produto!'),
      ),
    );
  }

  delete(id: number): Observable<IProduto> {
    const url = `${apiUrl}/produto_fisico/${id}`;
    return this.http.delete<IProduto>(url).pipe(
      map(obj => obj),
      catchError(_ => this.errorHandler('Erro ao deletar produto!')),
    );
  }

  /* ******************************************** */
  readTeste(pagina: number, limite: number): Observable<IProdutoPaginado> {
    console.log(pagina, limite);
    return this.http.get<IProdutoPaginado>(`${apiUrl}/produtos`).pipe(
      map(obj => obj),
      catchError(_ => this.errorHandler('Erro ao ler dados de produtos!')),
    );
  }
}
