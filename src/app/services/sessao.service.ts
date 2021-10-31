import { Injectable } from '@angular/core';
import jwt_decode from 'jwt-decode';
import { Observable, Subject } from 'rxjs';
import { AutenticacaoService } from 'src/app/services/autenticacao.service';
import { ITokenDecoded } from './../models/ITokenDecoded.model';

@Injectable({
  providedIn: 'root'
})
export class SessaoService {
  private loggedSubject = new Subject<boolean>();
  private tokenExp: number;
  private idUser: number;
  private username: string;
  private role: string;
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

  clearLocalStorage(): void {
    window.localStorage.clear();
    setTimeout(() => { window.location.reload() }, 3000)
  }

  getIdUser(): number {
    return this.idUser;
  }

  getUsername(): string {
    return this.username;
  }

  getRoleUser(): string {
    return this.role;
  }

  setToken(token: string): string {
    window.localStorage.setItem('token', token);
    this.decodeToken(token);
    this.loggedSubject.next(true);
    return this.role;
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
        this.idUser = decode.id;
        this.username = decode.username;
        this.role = decode.role;
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
        ({ token, refresh_token }) => {
          this.setToken(token);
          this.setRefreshToken(refresh_token);
          resolve(token);
        },
        err => reject(err),
      );
    });
  }

  logout(): void {
    window.localStorage.removeItem('token');
    // window.localStorage.removeItem('refresh_token');
    this.idUser = null;
    this.username = null;
    this.role = null;
    this.loggedSubject.next(false);
  }

  checkPermission(): boolean {
    return this.role === 'admin';
  }

  checkIdUser(idUser: number): boolean {
    return this.idUser === idUser;
  }

}
