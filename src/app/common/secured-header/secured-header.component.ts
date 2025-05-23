import { Component, effect, OnInit } from '@angular/core';
import { UserService } from '../../core/services/common/user.service';
import { Router } from '@angular/router';
import { AngularMaterialModule } from '../../shared/module/angular-material.module';
import { CommonModule } from '@angular/common';
import { NavigationService } from '../../core/services/common/navigation.service';
import { User } from '../../core/models/user';

@Component({
  selector: 'app-secured-header',
  imports: [AngularMaterialModule, CommonModule],
  templateUrl: './secured-header.component.html',
  styleUrl: './secured-header.component.scss'
})
export class SecuredHeaderComponent implements OnInit {
  userEmail: string = '';
  logoUrl: string | undefined = '';
  showProfileMenu: boolean = false;
  userDetails: User | null = {};

  constructor(
    private userService: UserService,
    private router: Router,
    private navigationService: NavigationService
  ) {

    effect(() => {
      this.userDetails = this.userService.userDetailsSignal();
      this.setLogo();
    });
  }

  ngOnInit(): void {
    this.userEmail = this.userService.getSafeUser();
    this.userDetails = this.userService.getUserDetails();
    this.setLogo();
  }

  setLogo() {
    if (this.userDetails?.userDetails) {
      this.logoUrl = `images/logos/${this.userDetails?.userDetails?.logoName}`;
    }
  }

  toggleProfileMenu(): void {
    this.showProfileMenu = !this.showProfileMenu;
  }

  logout(): void {
    this.userService.clearUser();
    this.router.navigate(['/login']);
    this.showProfileMenu = false;
  }

  navigateTo(route: string): void {

    this.navigationService.navigate([route]);
    this.showProfileMenu = false;
  }
}