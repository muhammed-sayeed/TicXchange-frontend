// src/app/core/services/base-http.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';
import { environment } from '../../../environments/environment';

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  errors?: any;
}

@Injectable({
  providedIn: 'root'
})
export class BaseHttpService {
  private readonly baseUrl: string;

  constructor(private http: HttpClient) {
    this.baseUrl = `${environment.apiUrl}`;
  }

  private getHttpOptions(customHeaders?: HttpHeaders) {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      ...customHeaders?.keys().reduce((acc, key) => {
        acc[key] = customHeaders.get(key) || '';
        return acc;
      }, {} as any)
    });

    return { headers };
  }

  // GET request
  get<T>(endpoint: string, params?: HttpParams, customHeaders?: HttpHeaders): Observable<T> {
    const options = {
      ...this.getHttpOptions(customHeaders),
      params
    };

    return this.http.get<T>(`${this.baseUrl}${endpoint}`, options)
      .pipe(
        retry(1),
        catchError(this.handleError)
      );
  }

  // POST request
  post<T>(endpoint: string, data: any, customHeaders?: HttpHeaders): Observable<T> {
    return this.http.post<T>(`${this.baseUrl}${endpoint}`, data, this.getHttpOptions(customHeaders))
      .pipe(
        catchError(this.handleError)
      );
  }

  // PUT request
  put<T>(endpoint: string, data: any, customHeaders?: HttpHeaders): Observable<T> {
    return this.http.put<T>(`${this.baseUrl}${endpoint}`, data, this.getHttpOptions(customHeaders))
      .pipe(
        catchError(this.handleError)
      );
  }

  // DELETE request
  delete<T>(endpoint: string, customHeaders?: HttpHeaders): Observable<T> {
    return this.http.delete<T>(`${this.baseUrl}${endpoint}`, this.getHttpOptions(customHeaders))
      .pipe(
        catchError(this.handleError)
      );
  }

  // PATCH request
  patch<T>(endpoint: string, data: any, customHeaders?: HttpHeaders): Observable<T> {
    return this.http.patch<T>(`${this.baseUrl}${endpoint}`, data, this.getHttpOptions(customHeaders))
      .pipe(
        catchError(this.handleError)
      );
  }

  // File upload
  uploadFile<T>(endpoint: string, file: File, additionalData?: any): Observable<T> {
    const formData = new FormData();
    formData.append('file', file);
    
    if (additionalData) {
      Object.keys(additionalData).forEach(key => {
        formData.append(key, additionalData[key]);
      });
    }

    const headers = new HttpHeaders();
    // Don't set Content-Type for FormData, let browser set it with boundary

    return this.http.post<T>(`${this.baseUrl}${endpoint}`, formData, { headers })
      .pipe(
        catchError(this.handleError)
      );
  }

  private handleError(error: any): Observable<never> {
  let errorMessage = 'An unknown error occurred';
  console.error('Full HTTP Error:', error); // Log full error object

  if (error.error instanceof ErrorEvent) {
    errorMessage = `Client Error: ${error.error.message}`;
  } else {
    errorMessage = `Server Error Code: ${error.status}\nMessage: ${error.message}`;
    if (error.error) {
      console.log('Server Response Body:', error.error); // Log the error response body
      errorMessage = error.error.message || error.error.msg || 'Bad Request';
    }
  }

  return throwError(() => ({ ...error, userMessage: errorMessage }));
}
}