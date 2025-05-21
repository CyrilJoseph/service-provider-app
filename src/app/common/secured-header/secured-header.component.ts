import { Component, OnInit } from '@angular/core';
import { UserService } from '../../core/services/common/user.service';
import { Router } from '@angular/router';
import { AngularMaterialModule } from '../../shared/module/angular-material.module';
import { CommonModule } from '@angular/common';
import { NavigationService } from '../../core/services/common/navigation.service';

@Component({
  selector: 'app-secured-header',
  imports: [AngularMaterialModule, CommonModule],
  templateUrl: './secured-header.component.html',
  styleUrl: './secured-header.component.scss'
})
export class SecuredHeaderComponent implements OnInit {
  userEmail: string = '';
  showProfileMenu: boolean = false;

  constructor(
    private userService: UserService,
    private router: Router,
    private navigationService: NavigationService
  ) { }

  ngOnInit(): void {
    this.userEmail = this.userService.getSafeUser();
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