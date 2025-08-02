// src/app/core/interceptors/loading.interceptor.ts
import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent } from '@angular/common/http';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';
import { LoadingService } from '../services/loading.service';

@Injectable()
export class LoadingInterceptor implements HttpInterceptor {
  
  constructor(private loadingService: LoadingService) {}
  
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // Skip loading for certain requests (like file uploads or background requests)
    const skipLoading = req.headers.has('X-Skip-Loading') || 
                       req.url.includes('/heartbeat') ||
                       req.url.includes('/ping');
    
    if (skipLoading) {
      return next.handle(req);
    }

    // Show loading spinner
    this.loadingService.setLoading(true);
    
    return next.handle(req).pipe(
      finalize(() => {
        // Hide loading spinner when request completes (success or error)
        this.loadingService.setLoading(false);
      })
    );
  }
}