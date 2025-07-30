import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LayoutService {
  private sidebarOpenSubject = new BehaviorSubject<boolean>(true);
  public isSidebarOpen$: Observable<boolean> = this.sidebarOpenSubject.asObservable();

  constructor() {
    // Check if running in browser before accessing localStorage
    if (typeof window !== 'undefined' && window.localStorage) {
      const saved = localStorage.getItem('sidebarOpen');
      if (saved !== null) {
        this.sidebarOpenSubject.next(JSON.parse(saved));
      }
    }
  }

  toggleSidebar(): void {
    const newState = !this.sidebarOpenSubject.value;
    this.sidebarOpenSubject.next(newState);
    
    // Save state to localStorage if available
    if (typeof window !== 'undefined' && window.localStorage) {
      localStorage.setItem('sidebarOpen', JSON.stringify(newState));
    }
  }

  setSidebarState(isOpen: boolean): void {
    this.sidebarOpenSubject.next(isOpen);
    
    // Save state to localStorage if available
    if (typeof window !== 'undefined' && window.localStorage) {
      localStorage.setItem('sidebarOpen', JSON.stringify(isOpen));
    }
  }

  get isSidebarOpen(): boolean {
    return this.sidebarOpenSubject.value;
  }
}