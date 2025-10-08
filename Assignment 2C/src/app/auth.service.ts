import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private isAuthenticated = false;
  private userData: any = null;

  constructor(private router: Router) {}

  register(user: any) {
    localStorage.setItem('user', JSON.stringify(user));
  }

  login(email: string, password: string): boolean {
    const storedUser = JSON.parse(localStorage.getItem('user') || '{}');
    if (storedUser.email === email && storedUser.password === password) {
      this.isAuthenticated = true;
      this.userData = storedUser;
      return true;
    }
    return false;
  }

  getUser() {
    return this.userData;
  }

  logout() {
    this.isAuthenticated = false;
    this.router.navigate(['/login']);
  }
}
