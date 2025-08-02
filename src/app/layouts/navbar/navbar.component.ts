import { Component, Output, EventEmitter, Input, OnInit, HostListener, TrackByFunction } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from 'src/app/features/auth/services/auth.service';

interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  timestamp: Date;
  read: boolean;
  actionUrl?: string;
  avatar?: string;
}

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {
  isAthenticate$: Observable<boolean>;
  @Input() isSidebarOpen: boolean | null = false;
  @Output() toggleSidebar = new EventEmitter<void>();

  isNotificationDropdownOpen = false;
  expandedNotifications: Set<string> = new Set();
  notifications: Notification[] = [];
  unreadCount = 0;
trackByNotificationId: TrackByFunction<Notification> | undefined;

  constructor(
    private router: Router,
    private authServise: AuthService
  ) {
    this.isAthenticate$ = authServise.isAuthenticated$;
  }

  ngOnInit(): void {
    this.loadNotifications();
  }

  // Close dropdown when clicking outside
  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    const target = event.target as HTMLElement;
    const notificationButton = document.querySelector('.notification-btn');
    const notificationDropdown = document.querySelector('.notification-dropdown');
    
    if (notificationButton && notificationDropdown) {
      if (!notificationButton.contains(target) && !notificationDropdown.contains(target)) {
        this.isNotificationDropdownOpen = false;
      }
    }
  }

  viewAllNotifications() {
    this.router.navigate(['/notifications']);
    this.isNotificationDropdownOpen = false;
  }

  onToggleSidebar(): void {
    this.toggleSidebar.emit();
  }

  navigateToLogin(): void {
    this.router.navigate(['/auth/login']);
  }

  toggleNotificationDropdown(): void {
    this.isNotificationDropdownOpen = !this.isNotificationDropdownOpen;
  }

  toggleNotificationExpansion(notificationId: string): void {
    if (this.expandedNotifications.has(notificationId)) {
      this.expandedNotifications.delete(notificationId);
    } else {
      this.expandedNotifications.add(notificationId);
    }
  }

  isNotificationExpanded(notificationId: string): boolean {
    return this.expandedNotifications.has(notificationId);
  }

  markAsRead(notification: Notification): void {
    if (!notification.read) {
      notification.read = true;
      this.updateUnreadCount();
    }
  }

  markAllAsRead(): void {
    this.notifications.forEach(notification => {
      notification.read = true;
    });
    this.updateUnreadCount();
  }

  deleteNotification(notificationId: string): void {
    this.notifications = this.notifications.filter(n => n.id !== notificationId);
    this.updateUnreadCount();
  }

  navigateToNotification(notification: Notification): void {
    this.markAsRead(notification);
    if (notification.actionUrl) {
      this.router.navigate([notification.actionUrl]);
      this.isNotificationDropdownOpen = false;
    }
  }

  getNotificationIcon(type: string): string {
    switch (type) {
      case 'success': return '✅';
      case 'warning': return '⚠️';
      case 'error': return '❌';
      case 'info':
      default: return 'ℹ️';
    }
  }

  getTimeAgo(timestamp: Date): string {
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - timestamp.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;
    if (diffInMinutes < 10080) return `${Math.floor(diffInMinutes / 1440)}d ago`;
    return timestamp.toLocaleDateString();
  }

  getTruncatedMessage(message: string, maxLength: number = 80): string {
    if (message.length <= maxLength) return message;
    return message.substring(0, maxLength) + '...';
  }

  private updateUnreadCount(): void {
    this.unreadCount = this.notifications.filter(n => !n.read).length;
  }

  private loadNotifications(): void {
    // Mock data - replace with actual service call
    this.notifications = [
      {
        id: '1',
        title: 'Welcome to the platform!',
        message: 'Thank you for joining our platform. Complete your profile setup to get the most out of your experience. You can add your bio, skills, and social links.',
        type: 'success',
        timestamp: new Date(Date.now() - 2 * 60 * 1000), // 2 minutes ago
        read: false,
        actionUrl: '/profile',
        avatar: '👋'
      },
      {
        id: '2',
        title: 'New message received',
        message: 'You have received a new message from John Doe regarding the project collaboration. Click here to view the full conversation.',
        type: 'info',
        timestamp: new Date(Date.now() - 15 * 60 * 1000), // 15 minutes ago
        read: false,
        actionUrl: '/messages',
        avatar: '📩'
      },
      {
        id: '3',
        title: 'Security Alert',
        message: 'A new login attempt was detected from a different location. If this was not you, please change your password immediately and enable two-factor authentication.',
        type: 'warning',
        timestamp: new Date(Date.now() - 1 * 60 * 60 * 1000), // 1 hour ago
        read: true,
        actionUrl: '/settings',
        avatar: '🔒'
      },
      {
        id: '4',
        title: 'Task deadline approaching',
        message: 'The deadline for "Website Redesign Project" is approaching in 2 days. Make sure to complete all pending tasks.',
        type: 'warning',
        timestamp: new Date(Date.now() - 3 * 60 * 60 * 1000), // 3 hours ago
        read: true,
        actionUrl: '/projects',
        avatar: '⏰'
      },
      {
        id: '5',
        title: 'System maintenance scheduled',
        message: 'Scheduled maintenance will occur on Sunday from 2:00 AM to 4:00 AM. Some features may be temporarily unavailable during this time.',
        type: 'info',
        timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000), // 6 hours ago
        read: true,
        actionUrl: '/announcements',
        avatar: '🔧'
      },
      {
        id: '6',
        title: 'Profile updated successfully',
        message: 'Your profile information has been updated successfully. Your changes are now visible to other users.',
        type: 'success',
        timestamp: new Date(Date.now() - 12 * 60 * 60 * 1000), // 12 hours ago
        read: true,
        avatar: '✨'
      },
      {
        id: '7',
        title: 'New feature available',
        message: 'Check out our new dark mode feature! You can now switch between light and dark themes in your settings.',
        type: 'info',
        timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000), // 1 day ago
        read: true,
        actionUrl: '/settings',
        avatar: '🌙'
      },
      {
        id: '8',
        title: 'Backup completed',
        message: 'Your weekly data backup has been completed successfully. All your data is safely stored.',
        type: 'success',
        timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
        read: true,
        avatar: '💾'
      },
      {
        id: '9',
        title: 'Password expires soon',
        message: 'Your password will expire in 5 days. Please update your password to maintain account security.',
        type: 'warning',
        timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // 3 days ago
        read: true,
        actionUrl: '/settings',
        avatar: '🔑'
      },
      {
        id: '10',
        title: 'Monthly report available',
        message: 'Your monthly activity report is now available for download. Review your progress and achievements.',
        type: 'info',
        timestamp: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // 1 week ago
        read: true,
        actionUrl: '/reports',
        avatar: '📊'
      }
    ];

    this.updateUnreadCount();
  }
}