// src/app/core/services/loading.service.ts
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LoadingService {
  private loadingSubject = new BehaviorSubject<boolean>(false);
  private loadingCounter = 0;

  public loading$: Observable<boolean> = this.loadingSubject.asObservable();

  setLoading(loading: boolean): void {
    if (loading) {
      this.loadingCounter++;
    } else {
      this.loadingCounter--;
      if (this.loadingCounter < 0) {
        this.loadingCounter = 0;
      }
    }

    this.loadingSubject.next(this.loadingCounter > 0);
  }

  isLoading(): boolean {
    return this.loadingSubject.value;
  }

  // Force stop all loading states
  stopAll(): void {
    this.loadingCounter = 0;
    this.loadingSubject.next(false);
  }
}