import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AngularMaterialModule } from '../shared/module/angular-material.module';
import { AuthService } from '../core/services/common/auth.service';
import { NavigationService } from '../core/services/common/navigation.service';
import { HomeService } from '../core/services/home.service';
import { UserService } from '../core/services/common/user.service';
import { User } from '../core/models/user';

@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule, CommonModule, AngularMaterialModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
  loginForm: FormGroup;
  isLoading = false;
  errorMessage = '';

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private userService: UserService,
    private homeService: HomeService,
    private navigationService: NavigationService,
    private router: Router
  ) {
    this.loginForm = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    if (this.userService.isLoggedIn()) {
      const appId = this.navigationService.getCurrentAppId();
      if (!appId) {
        this.setUserData();
      } else {
        this.navigationService.navigate(['home']);
      }
    }
  }

  onSubmit(): void {
    if (this.loginForm.valid) {
      this.isLoading = true;
      this.errorMessage = '';

      const { username, password } = this.loginForm.value;

      this.authService.login(username, password).subscribe({
        next: (response) => {
          if (response?.msg) {
            this.userService.setUser(username);
            this.setUserData();
          } else {
            this.errorMessage = response?.error ?? response?.msg;
          }
        },
        error: (error) => {
          this.isLoading = false;
          this.errorMessage = 'Invalid username or password';
          console.error('Login error:', error);
        }
      });
    }
  }

  setUserData() {

    this.userService.setUserDetails().subscribe({
      next: (data: User) => {
        if (data?.userDetails) {
          this.navigationService.setCurrentAppId(data.userDetails.urlKey);
          this.navigationService.navigate(['home']);
        } else {
          this.errorMessage = "User doesn't have permissions.";
          this.isLoading = false;
        }
      },
      error: (error: any) => {
        this.isLoading = false;
        this.errorMessage = "User doesn't have permissions.";
        console.error('Error retrieving app data:', error);
      }
    });
  }
}
