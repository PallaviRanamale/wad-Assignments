import { Component } from '@angular/core';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';

@Component({ selector: 'app-profile', templateUrl: './profile.component.html' })
export class ProfileComponent {
  user: any;

  constructor(private authService: AuthService, private router: Router) {
    this.user = this.authService.getUser();
  }

  logout() {
    this.authService.logout();
  }
}
