import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  template: `
    <div class="min-h-screen flex items-center justify-center bg-gray-100 px-4 py-8">
      <div class="max-w-md w-full bg-white rounded-lg shadow-lg p-8">
        <h2 class="text-3xl font-bold text-center text-gray-800 mb-6">Register</h2>
        
        @if (error()) {
          <div class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {{ error() }}
          </div>
        }

        @if (success()) {
          <div class="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
            Registration successful! Redirecting to login...
          </div>
        }

        <form [formGroup]="registerForm" (ngSubmit)="onSubmit()">
          <div class="mb-4">
            <label class="block text-gray-700 text-sm font-bold mb-2">Full Name</label>
            <input 
              type="text" 
              formControlName="name"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="John Doe"
            />
            @if (registerForm.get('name')?.invalid && registerForm.get('name')?.touched) {
              <p class="text-red-500 text-xs mt-1">Name is required</p>
            }
          </div>

          <div class="mb-4">
            <label class="block text-gray-700 text-sm font-bold mb-2">Email</label>
            <input 
              type="email" 
              formControlName="email"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="your.email@college.edu"
            />
            @if (registerForm.get('email')?.invalid && registerForm.get('email')?.touched) {
              <p class="text-red-500 text-xs mt-1">Valid email is required</p>
            }
          </div>

          <div class="mb-4">
            <label class="block text-gray-700 text-sm font-bold mb-2">Student ID</label>
            <input 
              type="text" 
              formControlName="student_id"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="STU2024001"
            />
            @if (registerForm.get('student_id')?.invalid && registerForm.get('student_id')?.touched) {
              <p class="text-red-500 text-xs mt-1">Student ID is required</p>
            }
          </div>

          <div class="mb-6">
            <label class="block text-gray-700 text-sm font-bold mb-2">Password</label>
            <input 
              type="password" 
              formControlName="password"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Minimum 8 characters"
            />
            @if (registerForm.get('password')?.invalid && registerForm.get('password')?.touched) {
              <p class="text-red-500 text-xs mt-1">Password must be at least 8 characters</p>
            }
          </div>

          <button 
            type="submit" 
            [disabled]="registerForm.invalid || loading()"
            class="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            @if (loading()) {
              <span>Registering...</span>
            } @else {
              <span>Register</span>
            }
          </button>
        </form>

        <div class="mt-4 text-center">
          <p class="text-gray-600 text-sm">
            Already have an account? 
            <a routerLink="/login" class="text-blue-600 hover:underline">Login here</a>
          </p>
        </div>
      </div>
    </div>
  `
})
export class RegisterComponent {
  registerForm: FormGroup;
  loading = signal(false);
  error = signal<string | null>(null);
  success = signal(false);

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.registerForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      student_id: ['', Validators.required],
      password: ['', [Validators.required, Validators.minLength(8)]]
    });
  }

  onSubmit() {
    if (this.registerForm.valid) {
      this.loading.set(true);
      this.error.set(null);

      this.authService.register(this.registerForm.value).subscribe({
        next: () => {
          this.loading.set(false);
          this.success.set(true);
          setTimeout(() => {
            this.router.navigate(['/login']);
          }, 2000);
        },
        error: (err) => {
          this.loading.set(false);
          this.error.set(err.error?.message || 'Registration failed. Please try again.');
        }
      });
    }
  }
}
