import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject, tap, catchError, throwError, map } from 'rxjs';
import { Router } from '@angular/router';
import { User } from '../../shared/models/user.model';
import { AuthResponse, ApiResponse } from '../../shared/models/api.model';

interface RegisterRequest {
  name: string;
  email: string;
  password: string;
  student_id: string;
}

interface TokenResponse {
  access: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly API_URL = 'http://localhost:8000/api/auth';
  private readonly ACCESS_TOKEN_KEY = 'access_token';
  private readonly REFRESH_TOKEN_KEY = 'refresh_token';
  private readonly USER_KEY = 'current_user';

  private currentUserSubject = new BehaviorSubject<User | null>(this.getUserFromStorage());
  public currentUser$ = this.currentUserSubject.asObservable();

  // Signal for reactive state management
  public currentUserSignal = signal<User | null>(this.getUserFromStorage());

  constructor(
    private http: HttpClient,
    private router: Router
  ) {}

  /**
   * Login with email and password
   * Stores tokens and user data in localStorage
   */
  login(email: string, password: string): Observable<AuthResponse> {
    return this.http.post<ApiResponse<any>>(`${this.API_URL}/login`, {
      email,
      password
    }).pipe(
      tap(response => {
        if (response.status === 'success' && response.data) {
          // Transform snake_case to camelCase
          const transformedUser: User = {
            id: response.data.user.id,
            email: response.data.user.email,
            name: response.data.user.name,
            isStudent: response.data.user.is_student,
            isStaff: response.data.user.is_staff,
            isActive: response.data.user.is_active !== undefined ? response.data.user.is_active : true,
            dateJoined: response.data.user.date_joined || new Date().toISOString()
          };
          
          this.storeTokens(response.data.access, response.data.refresh);
          this.storeUser(transformedUser);
          this.currentUserSubject.next(transformedUser);
          this.currentUserSignal.set(transformedUser);
        }
      }),
      map(response => {
        if (response.status === 'success' && response.data) {
          return {
            access: response.data.access,
            refresh: response.data.refresh,
            user: this.currentUserSignal()!
          };
        }
        throw new Error('Invalid response format');
      }),
      catchError(error => {
        console.error('Login error:', error);
        return throwError(() => error);
      })
    );
  }

  /**
   * Register a new student account
   */
  register(userData: RegisterRequest): Observable<User> {
    return this.http.post<ApiResponse<User>>(`${this.API_URL}/register`, userData).pipe(
      tap(response => {
        if (response.status === 'success') {
          // Registration successful, user needs to login
          console.log('Registration successful');
        }
      }),
      map(response => {
        if (response.status === 'success' && response.data) {
          return response.data;
        }
        throw new Error('Invalid response format');
      }),
      catchError(error => {
        console.error('Registration error:', error);
        return throwError(() => error);
      })
    );
  }

  /**
   * Logout user and clear all stored data
   */
  logout(): void {
    localStorage.removeItem(this.ACCESS_TOKEN_KEY);
    localStorage.removeItem(this.REFRESH_TOKEN_KEY);
    localStorage.removeItem(this.USER_KEY);
    this.currentUserSubject.next(null);
    this.currentUserSignal.set(null);
    this.router.navigate(['/login']);
  }

  /**
   * Refresh access token using refresh token
   */
  refreshToken(): Observable<TokenResponse> {
    const refreshToken = this.getRefreshToken();
    
    if (!refreshToken) {
      return throwError(() => new Error('No refresh token available'));
    }

    return this.http.post<TokenResponse>(`${this.API_URL}/token/refresh`, {
      refresh: refreshToken
    }).pipe(
      tap(response => {
        if (response.access) {
          localStorage.setItem(this.ACCESS_TOKEN_KEY, response.access);
        }
      }),
      catchError(error => {
        console.error('Token refresh error:', error);
        this.logout();
        return throwError(() => error);
      })
    );
  }

  /**
   * Check if user is authenticated
   */
  isAuthenticated(): boolean {
    const token = this.getAccessToken();
    if (!token) {
      return false;
    }

    // Check if token is expired
    try {
      const payload = this.decodeToken(token);
      const expirationTime = payload.exp * 1000; // Convert to milliseconds
      return Date.now() < expirationTime;
    } catch (error) {
      return false;
    }
  }

  /**
   * Get current user from memory or storage
   */
  getCurrentUser(): User | null {
    return this.currentUserSubject.value;
  }

  /**
   * Get access token from localStorage
   */
  getAccessToken(): string | null {
    return localStorage.getItem(this.ACCESS_TOKEN_KEY);
  }

  /**
   * Get refresh token from localStorage
   */
  getRefreshToken(): string | null {
    return localStorage.getItem(this.REFRESH_TOKEN_KEY);
  }

  /**
   * Store JWT tokens in localStorage
   */
  private storeTokens(accessToken: string, refreshToken: string): void {
    localStorage.setItem(this.ACCESS_TOKEN_KEY, accessToken);
    localStorage.setItem(this.REFRESH_TOKEN_KEY, refreshToken);
  }

  /**
   * Store user data in localStorage
   */
  private storeUser(user: User): void {
    localStorage.setItem(this.USER_KEY, JSON.stringify(user));
  }

  /**
   * Get user from localStorage
   */
  private getUserFromStorage(): User | null {
    const userJson = localStorage.getItem(this.USER_KEY);
    if (userJson) {
      try {
        return JSON.parse(userJson);
      } catch (error) {
        console.error('Error parsing user from storage:', error);
        return null;
      }
    }
    return null;
  }

  /**
   * Decode JWT token to get payload
   */
  private decodeToken(token: string): any {
    try {
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split('')
          .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
          .join('')
      );
      return JSON.parse(jsonPayload);
    } catch (error) {
      throw new Error('Invalid token');
    }
  }
}
