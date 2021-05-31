import { environment } from 'src/environments/environment';
import { IprodutoDigitalPaginado } from './../models/IprodutoDigitalPaginado.model';
import { ProdutoDigital } from '../models/produtoDigital.model';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Observable, EMPTY } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

const { apiUrl } = environment;

interface RespostaCadastroProduto {
  produto_digital_id: number
}

@Injectable({
  providedIn: 'root'
})
export class ProdutoDigitalService {

  constructor(private snackBar: MatSnackBar, private http: HttpClient) { }

  showMessage(msg: string, isError: boolean = false): void {
    this.snackBar.open(msg, 'X', {
      duration: 3000,
      horizontalPosition: 'right',
      verticalPosition: 'top',
      panelClass: isError ? ['msg-error'] : ['msg-success'],
    });
  }

  create(product: ProdutoDigital): Observable<RespostaCadastroProduto> {
    return this.http.post<ProdutoDigital>(`${apiUrl}/produto_digital`, product).pipe(
      map((obj) => obj),
      catchError((e) => this.errorHandler(e))
    );
  }

  read(): Observable<IprodutoDigitalPaginado> {
    return this.http.get<IprodutoDigitalPaginado>(`${apiUrl}/produto_digital`).pipe(
      map((obj) => obj),
      catchError((e) => this.errorHandler(e))
    );
  }

  readPaginator(pagina: number, limite: number): Observable<IprodutoDigitalPaginado> {
    let params = new HttpParams();
    params = params.append('pagina', pagina.toString());
    params = params.append('limite', limite.toString());

    return this.http.get<IprodutoDigitalPaginado>(`${apiUrl}/produto_digital`, { params }).pipe(
      map((obj) => obj),
      catchError((e) => this.errorHandler('Falha de conexão ao ler os produtos digitais'))
    );
  }

  readById(id: number): Observable<ProdutoDigital> {
    const url = `${apiUrl}/produto_digital/${id}`;
    return this.http.get<ProdutoDigital>(url).pipe(
      map((obj) => obj),
      catchError((e) => this.errorHandler(e))
    );
  }

  update(product: ProdutoDigital): Observable<ProdutoDigital> {
    const url = `${apiUrl}/produto_digital/${product.id}`;
    return this.http.put<ProdutoDigital>(url, product).pipe(
      map((obj) => obj),
      catchError((e) => this.errorHandler(e))
    );
  }

  delete(id: number): Observable<ProdutoDigital> {
    const url = `${apiUrl}/produto_digital/${id}`;
    return this.http.delete<ProdutoDigital>(url).pipe(
      map((obj) => obj),
      catchError((e) => this.errorHandler(e))
    );
  }

  errorHandler(e: any): Observable<any> {
    this.showMessage(e, true);
    return EMPTY;
  }
}
