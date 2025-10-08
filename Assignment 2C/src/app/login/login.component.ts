import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  imports: [CommonModule, ReactiveFormsModule]
})
export class LoginComponent {
  loginForm: FormGroup;
  loginFailed = false;
  userNotRegistered = false;  // ✅ New state for unregistered user error

  constructor(private fb: FormBuilder, private authService: AuthService, private router: Router) {
    this.loginForm = this.fb.group({ 
      email: ['', Validators.required], 
      password: ['', Validators.required] 
    });
  }

  login() {
    const email = this.loginForm.value.email;
    const password = this.loginForm.value.password;
    const storedUser = JSON.parse(localStorage.getItem('user') || '{}');

    if (!storedUser.email) {
      this.userNotRegistered = true;  // ✅ Show error if user not found
      this.loginFailed = false;
    } else if (this.authService.login(email, password)) {
      this.router.navigate(['/profile']);
    } else {
      this.loginFailed = true;  // ✅ Incorrect password error
      this.userNotRegistered = false;
    }
  }

  navigateToRegister() {
    this.router.navigate(['/register']);
  }
}
