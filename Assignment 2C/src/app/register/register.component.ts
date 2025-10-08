import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';  // ✅ Import CommonModule
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  standalone: true,  // ✅ Ensure this is a standalone component
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
  imports: [CommonModule, ReactiveFormsModule]  // ✅ Add CommonModule & ReactiveFormsModule
})
export class RegisterComponent {
  registerForm: FormGroup;
  
  constructor(private fb: FormBuilder, private authService: AuthService, private router: Router) {
    this.registerForm = this.fb.group({ name: '', email: '', password: '' });
  }
  navigateToLogin() {
    this.router.navigate(['/login']);
  }

  register() {
    this.authService.register(this.registerForm.value);
    this.navigateToLogin()
  }

  

 
}


