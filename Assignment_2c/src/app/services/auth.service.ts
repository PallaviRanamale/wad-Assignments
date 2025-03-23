import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { BehaviorSubject, Observable, of, throwError } from 'rxjs';
import { User, AuthResponse } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  // In-memory storage since we're not using a real backend
  private users: User[] = [];
  
  // Current user BehaviorSubject to track authentication state
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  currentUser$ = this.currentUserSubject.asObservable();
  private isBrowser: boolean;

  constructor(@Inject(PLATFORM_ID) private platformId: Object) { 
    this.isBrowser = isPlatformBrowser(this.platformId);
    // Check if we have a user in localStorage from previous session
    this.loadUserFromStorage();
  }

  private loadUserFromStorage(): void {
    if (this.isBrowser) {
      const storedUser = localStorage.getItem('currentUser');
      const storedToken = localStorage.getItem('token');
      
      if (storedUser && storedToken) {
        this.currentUserSubject.next(JSON.parse(storedUser));
      }
    }
  }

  register(user: User): Observable<AuthResponse> {
    // Check if email already exists
    if (this.users.find(u => u.email === user.email)) {
      return throwError(() => new Error('Email already registered'));
    }

    // In a real app, we would send a request to a backend API
    // For this demo, we'll store the user in our in-memory array
    const newUser: User = {
      ...user,
      id: Date.now().toString() // Generate a simple ID
    };
    
    // Don't expose password in the returned user
    const { password, ...userWithoutPassword } = newUser;
    
    // Store the user in our array with password
    this.users.push(newUser);
    
    // Generate a mock token
    const token = 'TOKEN_' + Math.random().toString(36).substring(2);
    
    // Set the current user and token in localStorage if in browser
    if (this.isBrowser) {
      localStorage.setItem('currentUser', JSON.stringify(userWithoutPassword));
      localStorage.setItem('token', token);
    }
    
    // Update the current user subject
    this.currentUserSubject.next(userWithoutPassword);
    
    return of({ user: userWithoutPassword, token });
  }

  login(email: string, password: string): Observable<AuthResponse> {
    // Find the user by email
    const user = this.users.find(u => u.email === email && u.password === password);
    
    if (!user) {
      return throwError(() => new Error('Invalid email or password'));
    }
    
    // Don't expose password in the returned user
    const { password: _, ...userWithoutPassword } = user;
    
    // Generate a mock token
    const token = 'TOKEN_' + Math.random().toString(36).substring(2);
    
    // Set the current user and token in localStorage if in browser
    if (this.isBrowser) {
      localStorage.setItem('currentUser', JSON.stringify(userWithoutPassword));
      localStorage.setItem('token', token);
    }
    
    // Update the current user subject
    this.currentUserSubject.next(userWithoutPassword);
    
    return of({ user: userWithoutPassword, token });
  }

  logout(): void {
    // Remove user from localStorage if in browser
    if (this.isBrowser) {
      localStorage.removeItem('currentUser');
      localStorage.removeItem('token');
    }
    
    // Set current user to null
    this.currentUserSubject.next(null);
  }

  isLoggedIn(): boolean {
    return this.currentUserSubject.value !== null;
  }

  getCurrentUser(): User | null {
    return this.currentUserSubject.value;
  }
}
