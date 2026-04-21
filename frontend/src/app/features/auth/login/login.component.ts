import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  template: `
    <div class="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900 px-4 transition-colors duration-300">
      <div class="max-w-md w-full bg-white dark:bg-gray-800 rounded-lg shadow-lg dark:shadow-gray-700/50 p-8 transition-colors">
        <h2 class="text-3xl font-bold text-center text-gray-800 dark:text-white mb-6">Login</h2>
        
        @if (error()) {
          <div class="bg-red-100 dark:bg-red-900/30 border border-red-400 dark:border-red-800 text-red-700 dark:text-red-300 px-4 py-3 rounded mb-4">
            {{ error() }}
          </div>
        }

        <form [formGroup]="loginForm" (ngSubmit)="onSubmit()">
          <div class="mb-4">
            <label class="block text-gray-700 dark:text-gray-300 text-sm font-bold mb-2">Email</label>
            <input 
              type="email" 
              formControlName="email"
              class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 transition-colors"
              placeholder="your.email@college.edu"
            />
            @if (loginForm.get('email')?.invalid && loginForm.get('email')?.touched) {
              <p class="text-red-500 dark:text-red-400 text-xs mt-1">Valid email is required</p>
            }
          </div>

          <div class="mb-6">
            <label class="block text-gray-700 dark:text-gray-300 text-sm font-bold mb-2">Password</label>
            <input 
              type="password" 
              formControlName="password"
              class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 transition-colors"
              placeholder="Enter your password"
            />
            @if (loginForm.get('password')?.invalid && loginForm.get('password')?.touched) {
              <p class="text-red-500 dark:text-red-400 text-xs mt-1">Password is required</p>
            }
          </div>

          <button 
            type="submit" 
            [disabled]="loginForm.invalid || loading()"
            class="w-full bg-blue-600 dark:bg-blue-700 text-white py-2 px-4 rounded-md hover:bg-blue-700 dark:hover:bg-blue-600 disabled:bg-gray-400 dark:disabled:bg-gray-600 disabled:cursor-not-allowed transition-colors"
          >
            @if (loading()) {
              <span>Logging in...</span>
            } @else {
              <span>Login</span>
            }
          </button>
        </form>

        <div class="mt-4 text-center">
          <p class="text-gray-600 dark:text-gray-400 text-sm">
            Don't have an account? 
            <a routerLink="/register" class="text-blue-600 dark:text-blue-400 hover:underline">Register here</a>
          </p>
        </div>
      </div>
    </div>
  `
})
export class LoginComponent {
  loginForm: FormGroup;
  loading = signal(false);
  error = signal<string | null>(null);

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });
  }

  onSubmit() {
    if (this.loginForm.valid) {
      this.loading.set(true);
      this.error.set(null);

      const { email, password } = this.loginForm.value;

      this.authService.login(email, password).subscribe({
        next: () => {
          this.loading.set(false);
          this.router.navigate(['/dashboard']);
        },
        error: (err) => {
          this.loading.set(false);
          this.error.set(err.error?.message || 'Login failed. Please check your credentials.');
        }
      });
    }
  }
}
