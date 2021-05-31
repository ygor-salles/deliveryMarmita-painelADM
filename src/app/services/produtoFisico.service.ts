import { environment } from 'src/environments/environment';
import { IprodutoFisicoPaginado } from './../models/IprodutoFisicoPaginado.model';
import { ProdutoFisico } from '../models/produtoFisico.model';
import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, EMPTY } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

const { apiUrl } = environment;

interface RespostaCadastroProduto {
  produto_fisico_id: number
}

@Injectable({
  providedIn: 'root'
})
export class ProdutoFisicoService {

  constructor(private snackBar: MatSnackBar, private http: HttpClient) { }

  showMessage(msg: string, isError: boolean = false): void {
    this.snackBar.open(msg, 'X', {
      duration: 3000,
      horizontalPosition: 'right',
      verticalPosition: 'top',
      panelClass: isError ? ['msg-error'] : ['msg-success'],
    });
  }

  create(product: ProdutoFisico): Observable<RespostaCadastroProduto> {
    return this.http.post<ProdutoFisico>(`${apiUrl}/produto_fisico`, product).pipe(
      map((obj) => obj),
      catchError((e) => this.errorHandler(e))
    );
  }

  read(): Observable<IprodutoFisicoPaginado> {
    return this.http.get<IprodutoFisicoPaginado>(`${apiUrl}/produto_fisico`).pipe(
      map((obj) => obj),
      catchError((e) => this.errorHandler(e))
    );
  }

  readPaginator(pagina: number, limite: number): Observable<IprodutoFisicoPaginado> {
    let params = new HttpParams();
    params = params.append('pagina', pagina.toString());
    params = params.append('limite', limite.toString());

    return this.http.get<IprodutoFisicoPaginado>(`${apiUrl}/produto_fisico`, { params }).pipe(
      map((obj) => obj),
      catchError((e) => this.errorHandler(e))
    );
  }

  readById(id: number): Observable<ProdutoFisico> {
    const url = `${apiUrl}/produto_fisico/${id}`;
    return this.http.get<ProdutoFisico>(url).pipe(
      map((obj) => obj),
      catchError((e) => this.errorHandler(e))
    );
  }

  update(product: ProdutoFisico): Observable<ProdutoFisico> {
    const url = `${apiUrl}/produto_fisico/${product.id}`;
    return this.http.put<ProdutoFisico>(url, product).pipe(
      map((obj) => obj),
      catchError((e) => this.errorHandler(e))
    );
  }

  delete(id: number): Observable<ProdutoFisico> {
    const url = `${apiUrl}/produto_fisico/${id}`;
    return this.http.delete<ProdutoFisico>(url).pipe(
      map((obj) => obj),
      catchError((e) => this.errorHandler(e))
    );
  }

  errorHandler(e: any): Observable<any> {
    this.showMessage(e, true);
    return EMPTY;
  }
}
