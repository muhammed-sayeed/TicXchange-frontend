import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';

export interface MenuItem {
  id: string;
  label: string;
  icon: string;
  route?: string;
  children?: MenuItem[];
  expanded?: boolean;
}

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent {
  @Input() isOpen: boolean | null = false;

  menuItems: MenuItem[] = [
    {
      id: 'home',
      label: 'Home',
      icon: '🏠',
      route: '/home'
    },
    {
      id: 'auth',
      label: 'Authentication',
      icon: '🔐',
      children: [
        {
          id: 'login',
          label: 'Login',
          icon: '➡️',
          route: '/auth/login'
        },
        {
          id: 'register',
          label: 'Register',
          icon: '📝',
          route: '/auth/register'
        }
      ],
      expanded: false
    },
    {
      id: 'profile',
      label: 'Profile',
      icon: '👤',
      route: '/profile'
    },
    {
      id: 'settings',
      label: 'Settings',
      icon: '⚙️',
      route: '/settings'
    }
  ];

  constructor(private router: Router) {}

  handleItemClick(item: MenuItem): void {
    if (item.children && item.children.length > 0) {
      item.expanded = !item.expanded;
    } else if (item.route) {
      this.navigateTo(item.route);
    }
  }

  navigateTo(route: string | undefined): void {
    if (route) {
      this.router.navigate([route]);
    }
  }

  isActiveRoute(route: string | undefined): boolean {
    if (!route) return false;
    return this.router.url === route || this.router.url.startsWith(route + '/');
  }
}