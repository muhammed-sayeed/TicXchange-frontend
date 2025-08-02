// src/app/features/auth/services/auth.service.ts
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, catchError, map, tap, throwError } from 'rxjs';
import { Router } from '@angular/router';
import { BaseHttpService, ApiResponse } from '../../../core/services/base-http.service';

export interface User {
  id: string;
  firstname: string;
  lastname: string;
  email?: string;
  role?: string;
  avatar?: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  firstname: string;
  lastname: string;
  email: string;
  mobile?: string;
  password: string;
  role?: string;
}

export interface OtpVerifyRequest {
  email: string;
  otp: string;
}

export interface AuthResponse {
  message: string;
  token: string;
  refreshToken?: string;
  user: User;
  expiresIn?: number;
}

export interface SignupResponse {
  message: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  private isAuthenticatedSubject = new BehaviorSubject<boolean>(false);

  public currentUser$ = this.currentUserSubject.asObservable();
  public isAuthenticated$ = this.isAuthenticatedSubject.asObservable();

  constructor(
    private baseHttp: BaseHttpService,
    private router: Router
  ) {
    this.initializeAuth();
  }

  private initializeAuth(): void {
    const token = this.getToken();
    const userData = localStorage.getItem('user_data');
    
    if (token && userData) {
      try {
        const user = JSON.parse(userData);
        this.currentUserSubject.next(user);
        this.isAuthenticatedSubject.next(true);
      } catch (error) {
        this.logout();
      }
    }
  }

  login(credentials: LoginRequest): Observable<AuthResponse> {
    return this.baseHttp.post<ApiResponse<AuthResponse>>('/auth/login', credentials)
      .pipe(
        map(response => response.data),
        tap(authData => this.handleAuthSuccess(authData))
      );
  }

 signup(userData: RegisterRequest): Observable<SignupResponse> {
  const signupPayload = {
    firstname: userData.firstname,
    lastname: userData.lastname,
    email: userData.email,
    role: userData.role || 'user', // Default to 'user'
    password: userData.password
  };

  return this.baseHttp.post<ApiResponse<SignupResponse>>('/auth/signup', signupPayload)
    .pipe(
      tap(response => console.log('Raw API Response:', response)), // Log full response before mapping
      map(response => response.data),
      catchError(error => {
        console.error('Signup Error:', error); // Log full error details
        return throwError(() => error); // Re-throw error for downstream handling
      })
    );
}

verifyOtp(otpData: OtpVerifyRequest): Observable<AuthResponse> {
    return this.baseHttp.post<ApiResponse<AuthResponse>>('/auth/verify', otpData)
      .pipe(
        map(response => response.data),
        tap(authData => this.handleAuthSuccess(authData))
      );
  }

  // Resend OTP (optional feature)
  resendOtp(email: string): Observable<SignupResponse> {
    return this.baseHttp.post<ApiResponse<SignupResponse>>('/auth/resend-otp', { email })
      .pipe(
        map(response => response.data)
      );
  }


  logout(): void {
    // Call logout API endpoint if needed
    this.baseHttp.post('/auth/logout', {}).subscribe({
      next: () => this.handleLogout(),
      error: () => this.handleLogout() // Still logout on client side even if API call fails
    });
  }

  refreshToken(): Observable<AuthResponse> {
    const refreshToken = localStorage.getItem('refresh_token');
    return this.baseHttp.post<ApiResponse<AuthResponse>>('/auth/refresh', { refreshToken })
      .pipe(
        map(response => response.data),
        tap(authData => this.handleAuthSuccess(authData))
      );
  }

  forgotPassword(email: string): Observable<any> {
    return this.baseHttp.post<ApiResponse<any>>('/auth/forgot-password', { email })
      .pipe(map(response => response.data));
  }

  resetPassword(token: string, newPassword: string): Observable<any> {
    return this.baseHttp.post<ApiResponse<any>>('/auth/reset-password', { token, newPassword })
      .pipe(map(response => response.data));
  }

  changePassword(currentPassword: string, newPassword: string): Observable<any> {
    return this.baseHttp.post<ApiResponse<any>>('/auth/change-password', { 
      currentPassword, 
      newPassword 
    }).pipe(map(response => response.data));
  }

  updateProfile(userData: Partial<User>): Observable<User> {
    return this.baseHttp.put<ApiResponse<User>>('/auth/profile', userData)
      .pipe(
        map(response => response.data),
        tap(user => {
          this.currentUserSubject.next(user);
          localStorage.setItem('user_data', JSON.stringify(user));
        })
      );
  }

  private handleAuthSuccess(authData: AuthResponse): void {
    // Store token and user data
    localStorage.setItem('auth_token', authData.token);
    localStorage.setItem('user_data', JSON.stringify(authData.user));
    
    if (authData.refreshToken) {
      localStorage.setItem('refresh_token', authData.refreshToken);
    }

    // Update subjects
    this.currentUserSubject.next(authData.user);
    this.isAuthenticatedSubject.next(true);
  }

  private handleLogout(): void {
    // Clear stored data
    localStorage.removeItem('auth_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('user_data');
    sessionStorage.clear();

    // Update subjects
    this.currentUserSubject.next(null);
    this.isAuthenticatedSubject.next(false);

    // Redirect to login
    this.router.navigate(['/auth/login']);
  }

  // Utility methods
  getToken(): string | null {
    return localStorage.getItem('auth_token') || sessionStorage.getItem('auth_token');
  }

  getCurrentUser(): User | null {
    return this.currentUserSubject.value;
  }

  isAuthenticated(): boolean {
    return this.isAuthenticatedSubject.value;
  }

  hasRole(role: string): boolean {
    const user = this.getCurrentUser();
    return user?.role === role;
  }

  isTokenExpired(): boolean {
    const token = this.getToken();
    if (!token) return true;

    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const currentTime = Math.floor(Date.now() / 1000);
      return payload.exp < currentTime;
    } catch (error) {
      return true;
    }
  }
}