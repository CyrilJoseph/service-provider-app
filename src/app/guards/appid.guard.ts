import { ActivatedRouteSnapshot, CanActivate, CanActivateFn, Router, RouterStateSnapshot } from '@angular/router';
import { NavigationService } from '../core/services/common/navigation.service';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AppIdGuard implements CanActivate {
  constructor(private navigationService: NavigationService, private router: Router) { }

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): boolean {

    const appId = next.params['appId'];
    const currentAppId = this.navigationService.getCurrentAppId();
    if (appId === currentAppId) {
      return true;
    }

    this.router.navigate(['/404']);
    return false;
  }
}