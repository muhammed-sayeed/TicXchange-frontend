// src/app/core/interceptors/error.interceptor.ts
import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Router } from '@angular/router';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
  
  constructor(private router: Router) {}
  
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(req).pipe(
      catchError((error: HttpErrorResponse) => {
        let errorMessage = 'An unknown error occurred';
        
        // Handle different types of errors
        if (error.error instanceof ErrorEvent) {
          // Client-side error
          errorMessage = `Client Error: ${error.error.message}`;
        } else {
          // Server-side error
          switch (error.status) {
            case 400:
              errorMessage = error.error?.message || 'Bad Request - Invalid data sent to server';
              break;
            case 401:
              errorMessage = 'Unauthorized - Please login again';
              // Clear stored tokens
              localStorage.removeItem('auth_token');
              sessionStorage.removeItem('auth_token');
              localStorage.removeItem('user_data');
              // Redirect to login
              this.router.navigate(['/auth/login']);
              break;
            case 403:
              errorMessage = 'Forbidden - You don\'t have permission to access this resource';
              this.router.navigate(['/unauthorized']);
              break;
            case 404:
              errorMessage = 'Resource not found';
              break;
            case 422:
              errorMessage = error.error?.message || 'Validation Error';
              break;
            case 500:
              errorMessage = 'Internal server error - Please try again later';
              break;
            case 503:
              errorMessage = 'Service unavailable - Server is temporarily down';
              break;
            case 0:
              errorMessage = 'Network error - Please check your internet connection';
              break;
            default:
              errorMessage = `Server Error: ${error.status} - ${error.message}`;
          }
        }

        // Log error for debugging
        console.error('HTTP Error:', {
          status: error.status,
          message: error.message,
          url: req.url,
          method: req.method,
          error: error.error
        });

        // Add user-friendly message to error object
        const enhancedError = {
          ...error,
          userMessage: errorMessage
        };

        return throwError(() => enhancedError);
      })
    );
  }
}