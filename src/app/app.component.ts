import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Subscription } from 'rxjs';
import { UserService } from './core/services/user.service';
import { CommonModule } from '@angular/common';
import { FooterComponent } from './common/footer/footer.component';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, FooterComponent, CommonModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'service-provider-app';
  isUserLoggedIn = false;
  private userSubscription!: Subscription;

  constructor(private userService: UserService
  ) { }

  ngOnInit(): void {

    this.isUserLoggedIn = this.userService.isLoggedIn();

    this.userSubscription = this.userService
      .watchUser()
      .subscribe(userLoggedIn => {
        this.isUserLoggedIn = userLoggedIn
      });
  }

  ngOnDestroy(): void {
    if (this.userSubscription) {
      this.userSubscription.unsubscribe();
    }
  }
}
