import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router, UrlTree, } from '@angular/router';
import { Observable } from 'rxjs';
import { SessaoService } from '../services/sessao.service';

@Injectable({ providedIn: 'root' })
export class AutenticacaoGuard implements CanActivate {
  constructor(private sessaoService: SessaoService, private router: Router) {}

  canActivate(_route: ActivatedRouteSnapshot, _state: RouterStateSnapshot, ):
    | boolean
    | UrlTree
    | Observable<boolean | UrlTree>
    | Promise<boolean | UrlTree> {
    if (!this.sessaoService.isLogged()) {
      return this.router.parseUrl('/login');
    }
    return true;
  }
}
