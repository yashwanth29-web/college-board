import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { Router } from '@angular/router';
import { AuthService } from './auth.service';
import { User } from '../../shared/models/user.model';
import { ApiResponse, AuthResponse } from '../../shared/models/api.model';

describe('AuthService', () => {
  let service: AuthService;
  let httpMock: HttpTestingController;
  let routerSpy: jasmine.SpyObj<Router>;

  const mockUser: User = {
    id: 1,
    email: 'test@college.edu',
    name: 'Test User',
    isStudent: true,
    isStaff: false,
    isActive: true,
    dateJoined: '2024-01-15T00:00:00Z'
  };

  const mockAuthResponse: ApiResponse<AuthResponse> = {
    status: 'success',
    data: {
      access: 'mock-access-token',
      refresh: 'mock-refresh-token',
      user: mockUser
    }
  };

  beforeEach(() => {
    const routerSpyObj = jasmine.createSpyObj('Router', ['navigate']);

    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        AuthService,
        { provide: Router, useValue: routerSpyObj }
      ]
    });

    service = TestBed.inject(AuthService);
    httpMock = TestBed.inject(HttpTestingController);
    routerSpy = TestBed.inject(Router) as jasmine.SpyObj<Router>;

    // Clear localStorage before each test
    localStorage.clear();
  });

  afterEach(() => {
    httpMock.verify();
    localStorage.clear();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('login', () => {
    it('should login successfully and store tokens', (done) => {
      const email = 'test@college.edu';
      const password = 'password123';

      service.login(email, password).subscribe(response => {
        expect(response.access).toBe('mock-access-token');
        expect(response.refresh).toBe('mock-refresh-token');
        expect(response.user).toEqual(mockUser);
        expect(localStorage.getItem('access_token')).toBe('mock-access-token');
        expect(localStorage.getItem('refresh_token')).toBe('mock-refresh-token');
        expect(service.getCurrentUser()).toEqual(mockUser);
        done();
      });

      const req = httpMock.expectOne('http://localhost:8000/api/auth/login');
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual({ email, password });
      req.flush(mockAuthResponse);
    });

    it('should handle login error', (done) => {
      const email = 'test@college.edu';
      const password = 'wrongpassword';
      const errorResponse = {
        status: 'error',
        message: 'Invalid credentials'
      };

      service.login(email, password).subscribe({
        next: () => fail('should have failed'),
        error: (error) => {
          expect(error.error).toEqual(errorResponse);
          expect(localStorage.getItem('access_token')).toBeNull();
          done();
        }
      });

      const req = httpMock.expectOne('http://localhost:8000/api/auth/login');
      req.flush(errorResponse, { status: 401, statusText: 'Unauthorized' });
    });
  });

  describe('logout', () => {
    it('should clear tokens and user data', () => {
      // Set up some data
      localStorage.setItem('access_token', 'token');
      localStorage.setItem('refresh_token', 'refresh');
      localStorage.setItem('current_user', JSON.stringify(mockUser));

      service.logout();

      expect(localStorage.getItem('access_token')).toBeNull();
      expect(localStorage.getItem('refresh_token')).toBeNull();
      expect(localStorage.getItem('current_user')).toBeNull();
      expect(service.getCurrentUser()).toBeNull();
      expect(routerSpy.navigate).toHaveBeenCalledWith(['/login']);
    });
  });

  describe('isAuthenticated', () => {
    it('should return false when no token exists', () => {
      expect(service.isAuthenticated()).toBe(false);
    });

    it('should return false when token is expired', () => {
      // Create an expired token (exp in the past)
      const expiredToken = createMockToken(Math.floor(Date.now() / 1000) - 3600);
      localStorage.setItem('access_token', expiredToken);

      expect(service.isAuthenticated()).toBe(false);
    });

    it('should return true when token is valid', () => {
      // Create a valid token (exp in the future)
      const validToken = createMockToken(Math.floor(Date.now() / 1000) + 3600);
      localStorage.setItem('access_token', validToken);

      expect(service.isAuthenticated()).toBe(true);
    });
  });

  describe('refreshToken', () => {
    it('should refresh access token successfully', (done) => {
      localStorage.setItem('refresh_token', 'mock-refresh-token');
      const newAccessToken = 'new-access-token';

      service.refreshToken().subscribe(response => {
        expect(response.access).toBe(newAccessToken);
        expect(localStorage.getItem('access_token')).toBe(newAccessToken);
        done();
      });

      const req = httpMock.expectOne('http://localhost:8000/api/auth/token/refresh');
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual({ refresh: 'mock-refresh-token' });
      req.flush({ access: newAccessToken });
    });

    it('should logout on refresh failure', (done) => {
      localStorage.setItem('refresh_token', 'invalid-refresh-token');

      service.refreshToken().subscribe({
        next: () => fail('should have failed'),
        error: () => {
          expect(routerSpy.navigate).toHaveBeenCalledWith(['/login']);
          done();
        }
      });

      const req = httpMock.expectOne('http://localhost:8000/api/auth/token/refresh');
      req.flush({ error: 'Invalid token' }, { status: 401, statusText: 'Unauthorized' });
    });
  });

  describe('register', () => {
    it('should register a new user successfully', (done) => {
      const registerData = {
        name: 'New User',
        email: 'newuser@college.edu',
        password: 'password123',
        student_id: 'STU2024001'
      };

      const registerResponse: ApiResponse<User> = {
        status: 'success',
        message: 'Student registered successfully',
        data: mockUser
      };

      service.register(registerData).subscribe(response => {
        expect(response).toEqual(mockUser);
        done();
      });

      const req = httpMock.expectOne('http://localhost:8000/api/auth/register');
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual(registerData);
      req.flush(registerResponse);
    });
  });

  describe('getAccessToken', () => {
    it('should return access token from localStorage', () => {
      localStorage.setItem('access_token', 'test-token');
      expect(service.getAccessToken()).toBe('test-token');
    });

    it('should return null when no token exists', () => {
      expect(service.getAccessToken()).toBeNull();
    });
  });

  describe('getCurrentUser', () => {
    it('should return current user', () => {
      localStorage.setItem('current_user', JSON.stringify(mockUser));
      // Create new service instance to load from storage
      const newService = new AuthService(TestBed.inject(HttpClientTestingModule) as any, routerSpy);
      expect(newService.getCurrentUser()).toEqual(mockUser);
    });

    it('should return null when no user exists', () => {
      expect(service.getCurrentUser()).toBeNull();
    });
  });
});

/**
 * Helper function to create a mock JWT token
 */
function createMockToken(exp: number): string {
  const header = btoa(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));
  const payload = btoa(JSON.stringify({ user_id: 1, exp }));
  const signature = 'mock-signature';
  return `${header}.${payload}.${signature}`;
}
