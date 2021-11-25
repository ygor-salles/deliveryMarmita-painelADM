import { HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import firebase from 'firebase/compat/app';
import 'firebase/compat/storage';
import { EMPTY, Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { SessaoService } from './sessao.service';

firebase.initializeApp(environment.firebaseConfig);

const { name_app, folder_app } = environment;

@Injectable({
  providedIn: 'root'
})
export class StorageService {
  storareRef = firebase.app().storage().ref();

  constructor(
    private sessaoService: SessaoService,
    private snackBar: MatSnackBar,
  ) { }

  showMessage(msg: any, isError = false): void {
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


  async subirImagen(nombre: string, imgBase64: any) {
    try {
      let respuesta = await this.storareRef.child(`${folder_app}/${nombre}`).putString(imgBase64, 'data_url');
      return await respuesta.ref.getDownloadURL();
    } catch (err: any) {
      this.showMessage(err.message || 'Falha ao enviar imagem para o Firebase')
      return null;
    }
  }

  async removerImagem(urlImage: string) {
    const name_organization = `${name_app}_`;
    const start = urlImage.indexOf(name_organization) + name_organization.length;
    const dataImg = urlImage.substring(start, start+13);

    try {
      await this.storareRef.child(`${folder_app}/${name_organization}${dataImg}`).delete()
    } catch (err: any) {
      this.showMessage(err.message || 'Falha ao enviar imagem para o Firebase')
    }
  }

  async visualizarImagem(nameFile: string) {
    try {
      return await this.storareRef.child(`${folder_app}/${nameFile}`).getDownloadURL()
    } catch (err: any) {
      this.showMessage(err.message || 'Falha ao enviar imagem para o Firebase')
      return null
    }
  }
}
