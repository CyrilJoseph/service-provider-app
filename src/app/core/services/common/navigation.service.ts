import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Location } from '@angular/common';


@Injectable({
  providedIn: 'root'
})
export class NavigationService {

  private currentAppId: string = '';

  constructor(private router: Router, private location: Location) { }

  setCurrentAppId(appId: string): void {
    this.currentAppId = appId;
  }

  getCurrentAppId(): string {
    return this.currentAppId;
  }

  navigate(commands: any[], extras?: any): void {
    // Prepend appId to all navigations
    this.router.navigate([this.currentAppId, ...commands], extras);
  }

  navigateByUrl(url: string, extras?: any): void {
    // Ensure URL starts with current appId
    const fullUrl = `/${this.currentAppId}${url.startsWith('/') ? url : `/${url}`}`;
    this.router.navigateByUrl(fullUrl, extras);
  }

  goBack(): void {
    this.location.back();
  }

  goForward(): void {
    this.location.forward();
  }
}
