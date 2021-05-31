import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpErrorResponse } from '@angular/common/http';
import { BehaviorSubject, Observable, throwError } from 'rxjs';

import { catchError, filter, switchMap, take } from 'rxjs/operators';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import { SessaoService } from '../services/sessao.service';

const { apiUrl } = environment;

// Envia o token para o servidor automaticamente
@Injectable()
export class AutenticacaoInterceptor implements HttpInterceptor {
  constructor(private sessaoService: SessaoService, private router: Router) {}

  private isRefreshing = false;

  private refreshTokenSubject: BehaviorSubject<any> = new BehaviorSubject<any>(
    null,
  );

  intercept(
    req: HttpRequest<any>,
    next: HttpHandler,
  ): Observable<HttpEvent<any>> {
    const token = this.sessaoService.getToken();

    return next.handle(this.setTokenHeaders(req, token)).pipe(
      catchError(error => {
        if (req.url !== `${apiUrl}/administrador/login`) {
          if (error instanceof HttpErrorResponse && error.status === 401) {
            return this.handle401Error(req, next);
          }
        }
        return throwError(error);
      }),
    );
  }

  private handle401Error(request: HttpRequest<any>, next: HttpHandler) {
    if (!this.isRefreshing) {
      this.isRefreshing = true;
      this.refreshTokenSubject.next(null);

      this.sessaoService
        .atualizarToken()
        .then(token => {
          this.isRefreshing = false;
          this.refreshTokenSubject.next(token);
          return next.handle(this.setTokenHeaders(request, token));
        })
        .catch(() => {
          this.sessaoService.logout();
          this.router.navigate(['login']);
        });
    }
    return this.refreshTokenSubject.pipe(
      filter(token => token != null),
      take(1),
      switchMap(token => {
        return next.handle(this.setTokenHeaders(request, token));
      }),
    );
  }

  private setTokenHeaders(
    req: HttpRequest<any>,
    token: string,
  ): HttpRequest<any> {
    req = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`,
      },
    });

    return req;
  }
}
