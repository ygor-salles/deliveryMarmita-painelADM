import { Imagem } from './../models/imagem.model';
import { environment } from 'src/environments/environment';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, EMPTY } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { MatSnackBar } from '@angular/material/snack-bar';

const { apiUrl } = environment;

@Injectable({
  providedIn: 'root'
})
export class ImagensService {

  constructor(private http: HttpClient, private snackBar: MatSnackBar) { }

  showMessage(msg: string, isError: boolean = false): void {
    this.snackBar.open(msg, 'X', {
      duration: 3000,
      horizontalPosition: 'right',
      verticalPosition: 'top',
      panelClass: isError ? ['msg-error'] : ['msg-success'],
    });
  }

  create(imagens: File[], idProduto: number, typeProduto: string): Observable<Imagem> {
    let params = new HttpParams();
    typeProduto === 'produtoFisico' ?
      params = params.append('produto_fisico_id', idProduto.toString()) :
      params = params.append('produto_digital_id', idProduto.toString())

    const formData: FormData = new FormData();
    imagens.forEach(elem => {
      formData.append('files', elem, elem.name);
    })
    return this.http.post<Imagem>(`${apiUrl}/imagem`, formData, { params }).pipe(
      map((obj) => obj),
      catchError((e) => this.errorHandler(e))
    );
  }

  errorHandler(e: any): Observable<any> {
    this.showMessage('Falha de conexão com o servidor!', true);
    return EMPTY;
  }
}
