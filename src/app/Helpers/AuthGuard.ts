import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { ApiFetcherComponent } from './api-fetcher.component';

@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate {
  constructor(
    private router: Router,
    private apiFetcher : ApiFetcherComponent
) {}

canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    const token = this.apiFetcher.GetLocalToken;
    this.apiFetcher.UpdateSession().subscribe();
    if (token) {
        // authorised so return true
        console.log("Auth guard True")
        return true;
    }

    // not logged in so redirect to login page with the return url
    this.router.navigate(['/data']);
    console.log("Auth guard False")
    return false;
}
}