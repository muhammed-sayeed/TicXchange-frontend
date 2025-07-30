import { Component } from '@angular/core';
import { LayoutService } from './layouts.service';

@Component({
  selector: 'app-layout',
  template: `
    <div class="layout-container">
      <app-navbar 
        (toggleSidebar)="toggleSidebar()"
        [isSidebarOpen]="layoutService.isSidebarOpen$ | async">
      </app-navbar>
      
      <div class="main-content" 
           [class.sidebar-open]="layoutService.isSidebarOpen$ | async">
        <app-sidebar 
          [isOpen]="layoutService.isSidebarOpen$ | async">
        </app-sidebar>
        
        <div class="page-content">
          <router-outlet></router-outlet>
        </div>
      </div>
    </div>
  `,
  styleUrls: ['./layouts.component.css']
})
export class LayoutComponent {
  constructor(public layoutService: LayoutService) {}

  toggleSidebar(): void {
    this.layoutService.toggleSidebar();
  }
}