import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router, UrlTree, } from '@angular/router';
import { Observable } from 'rxjs';

import { SessaoService } from '../services/sessao.service';

@Injectable({ providedIn: 'root' })
export class LoginGuard implements CanActivate {
  constructor(private sessaoService: SessaoService, private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot, ):
    | boolean
    | UrlTree
    | Observable<boolean | UrlTree>
    | Promise<boolean | UrlTree> {
    if (this.sessaoService.isLogged()) {
      return this.router.parseUrl('/dashboard');
    }
    return true;
  }
}
