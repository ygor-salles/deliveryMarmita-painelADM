import { ITokenDecoded } from './../models/ITokenDecoded.model';
import { AutenticacaoService } from 'src/app/services/autenticacao.service';
import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import jwt_decode from 'jwt-decode';

@Injectable({
  providedIn: 'root'
})
export class SessaoService {
  private loggedSubject = new Subject<boolean>();
  private tokenExp: number;
  private perfil_id: number | null;
  private logged$ = this.loggedSubject.asObservable();

  constructor(private autenticacaoService: AutenticacaoService) {
    this.loggedSubject.next(this.isLogged());
    this.decodeToken(this.getToken());
  }

  isLogged(): boolean {
    return !!this.getToken();
  }

  isLoggedAsObservable(): Observable<boolean> {
    return this.logged$;
  }

  getToken(): any {
    return window.localStorage.getItem('token');
  }

  getRefreshToken(): any {
    return window.localStorage.getItem('refresh_token');
  }

  setToken(token: string): void {
    window.localStorage.setItem('token', token);
    this.decodeToken(token);
    this.loggedSubject.next(true);
  }

  setRefreshToken(refresh_token: string): void {
    window.localStorage.setItem('refresh_token', refresh_token);
  }

  checkTokenValidity(): boolean {
    const current_time = Date.now().valueOf() / 1000;
    if (current_time > this.tokenExp) {
      return false;
    }
    return true;
  }

  private decodeToken(token: string): ITokenDecoded | null {
    if (token) {
      const decode = jwt_decode<ITokenDecoded>(token);
      this.tokenExp = decode.exp;

      if (this.checkTokenValidity()) {
        this.perfil_id = decode.perfil_id;
        return decode;
      }
    }
    return null;
  }

  atualizarToken(): Promise<string> {
    return new Promise((resolve, reject) => {
      const refreshToken = this.getRefreshToken();

      const decode = jwt_decode<ITokenDecoded>(refreshToken);

      const current_time = Date.now().valueOf() / 1000;
      if (current_time > decode.exp) {
        reject();
      }

      this.autenticacaoService.atualizarAutenticacao(refreshToken).subscribe(
        (result) => {
          this.setToken(result.data.token);
          this.setRefreshToken(result.data.refresh_token);
          resolve(result.data.token);
        },
        err => reject(err),
      );
    });
  }

  logout(): void {
    window.localStorage.removeItem('token');
    // window.localStorage.removeItem('refresh_token');
    // this.perfil_id = null;
    this.loggedSubject.next(false);
  }

}
