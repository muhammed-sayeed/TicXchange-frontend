import { Component, OnInit } from '@angular/core';
import { LayoutService } from '../../../../layouts/layouts.service';

@Component({
  selector: 'app-home',
  templateUrl: './homepage.component.html',
  styleUrls: ['./homepage.component.css']
})
export class HomeComponent implements OnInit {

  constructor(public layoutService: LayoutService) {}

  ngOnInit(): void {
    console.log('Home component loaded with layout');
  }

  toggleSidebar(): void {
    this.layoutService.toggleSidebar();
  }

  openSidebar(): void {
    this.layoutService.setSidebarState(true);
  }

  closeSidebar(): void {
    this.layoutService.setSidebarState(false);
  }
}