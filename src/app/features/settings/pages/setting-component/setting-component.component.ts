import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/features/auth/services/auth.service';

interface AppSettings {
  // General Settings
  theme: 'light' | 'dark' | 'auto';
  language: string;
  timezone: string;
  dateFormat: string;
  
  // Notifications
  emailNotifications: boolean;
  pushNotifications: boolean;
  desktopNotifications: boolean;
  soundEnabled: boolean;
  notificationTypes: {
    messages: boolean;
    updates: boolean;
    reminders: boolean;
    security: boolean;
  };
  
  // Privacy & Security
  profileVisibility: 'public' | 'private' | 'friends';
  twoFactorAuth: boolean;
  activityTracking: boolean;
  dataCollection: boolean;
  autoLogout: number; // minutes
  
  // Display & Interface
  compactMode: boolean;
  animationsEnabled: boolean;
  highContrast: boolean;
  fontSize: 'small' | 'medium' | 'large';
  sidebarCollapsed: boolean;
  
  // Advanced
  developerMode: boolean;
  betaFeatures: boolean;
  performanceMode: boolean;
  autoSave: boolean;
  backupFrequency: 'daily' | 'weekly' | 'monthly';
}

interface LanguageOption {
  code: string;
  name: string;
  flag: string;
}

interface TimezoneOption {
  value: string;
  label: string;
}

@Component({
  selector: 'app-settings',
  templateUrl: './setting-component.component.html',
  styleUrls: ['./setting-component.component.css']
})
export class SettingsComponent implements OnInit {
  
  activeTab: string = 'general';
  settings: AppSettings = {
    // General Settings
    theme: 'light',
    language: 'en',
    timezone: 'America/New_York',
    dateFormat: 'MM/dd/yyyy',
    
    // Notifications
    emailNotifications: true,
    pushNotifications: true,
    desktopNotifications: false,
    soundEnabled: true,
    notificationTypes: {
      messages: true,
      updates: true,
      reminders: true,
      security: true
    },
    
    // Privacy & Security
    profileVisibility: 'public',
    twoFactorAuth: false,
    activityTracking: true,
    dataCollection: false,
    autoLogout: 30,
    
    // Display & Interface
    compactMode: false,
    animationsEnabled: true,
    highContrast: false,
    fontSize: 'medium',
    sidebarCollapsed: false,
    
    // Advanced
    developerMode: false,
    betaFeatures: false,
    performanceMode: false,
    autoSave: true,
    backupFrequency: 'weekly'
  };

  languages: LanguageOption[] = [
    { code: 'en', name: 'English', flag: '🇺🇸' },
    { code: 'es', name: 'Español', flag: '🇪🇸' },
    { code: 'fr', name: 'Français', flag: '🇫🇷' },
    { code: 'de', name: 'Deutsch', flag: '🇩🇪' },
    { code: 'it', name: 'Italiano', flag: '🇮🇹' },
    { code: 'pt', name: 'Português', flag: '🇵🇹' },
    { code: 'ru', name: 'Русский', flag: '🇷🇺' },
    { code: 'ja', name: '日本語', flag: '🇯🇵' },
    { code: 'ko', name: '한국어', flag: '🇰🇷' },
    { code: 'zh', name: '中文', flag: '🇨🇳' }
  ];

  timezones: TimezoneOption[] = [
    { value: 'America/New_York', label: '(UTC-5) Eastern Time' },
    { value: 'America/Chicago', label: '(UTC-6) Central Time' },
    { value: 'America/Denver', label: '(UTC-7) Mountain Time' },
    { value: 'America/Los_Angeles', label: '(UTC-8) Pacific Time' },
    { value: 'Europe/London', label: '(UTC+0) Greenwich Mean Time' },
    { value: 'Europe/Paris', label: '(UTC+1) Central European Time' },
    { value: 'Asia/Tokyo', label: '(UTC+9) Japan Standard Time' },
    { value: 'Asia/Shanghai', label: '(UTC+8) China Standard Time' },
    { value: 'Australia/Sydney', label: '(UTC+10) Australian Eastern Time' }
  ];

  tabs = [
    { id: 'general', label: 'General', icon: '⚙️' },
    { id: 'notifications', label: 'Notifications', icon: '🔔' },
    { id: 'privacy', label: 'Privacy & Security', icon: '🔒' },
    { id: 'display', label: 'Display', icon: '🎨' },
    { id: 'advanced', label: 'Advanced', icon: '🔧' }
  ];

  isLoading = false;
  hasUnsavedChanges = false;
  saveMessage = '';

  constructor(
    private authService: AuthService
  ) { }

  ngOnInit(): void {
    this.loadSettings();
  }

  Logout(): void{
    this.authService.logout();
  }

  loadSettings(): void {
    // Load settings from service/localStorage
    const savedSettings = localStorage.getItem('app-settings');
    if (savedSettings) {
      this.settings = { ...this.settings, ...JSON.parse(savedSettings) };
    }
  }

  setActiveTab(tab: string): void {
    this.activeTab = tab;
  }

  onSettingChange(): void {
    this.hasUnsavedChanges = true;
    this.saveMessage = '';
  }

  saveSettings(): void {
    this.isLoading = true;
    
    // Simulate API call
    setTimeout(() => {
      try {
        localStorage.setItem('app-settings', JSON.stringify(this.settings));
        this.hasUnsavedChanges = false;
        this.saveMessage = 'Settings saved successfully!';
        this.isLoading = false;
        
        // Apply theme change immediately
        this.applyTheme();
        
        // Clear success message after 3 seconds
        setTimeout(() => {
          this.saveMessage = '';
        }, 3000);
      } catch (error) {
        this.saveMessage = 'Error saving settings. Please try again.';
        this.isLoading = false;
      }
    }, 1000);
  }

  resetSettings(): void {
    if (confirm('Are you sure you want to reset all settings to default? This action cannot be undone.')) {
      // Reset to default values
      this.settings = {
        theme: 'light',
        language: 'en',
        timezone: 'America/New_York',
        dateFormat: 'MM/dd/yyyy',
        emailNotifications: true,
        pushNotifications: true,
        desktopNotifications: false,
        soundEnabled: true,
        notificationTypes: {
          messages: true,
          updates: true,
          reminders: true,
          security: true
        },
        profileVisibility: 'public',
        twoFactorAuth: false,
        activityTracking: true,
        dataCollection: false,
        autoLogout: 30,
        compactMode: false,
        animationsEnabled: true,
        highContrast: false,
        fontSize: 'medium',
        sidebarCollapsed: false,
        developerMode: false,
        betaFeatures: false,
        performanceMode: false,
        autoSave: true,
        backupFrequency: 'weekly'
      };
      this.hasUnsavedChanges = true;
    }
  }

  exportSettings(): void {
    const dataStr = JSON.stringify(this.settings, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'app-settings.json';
    link.click();
    URL.revokeObjectURL(url);
  }

  importSettings(event: any): void {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        try {
          const importedSettings = JSON.parse(e.target.result);
          this.settings = { ...this.settings, ...importedSettings };
          this.hasUnsavedChanges = true;
          this.saveMessage = 'Settings imported successfully!';
        } catch (error) {
          this.saveMessage = 'Invalid settings file. Please check the format.';
        }
      };
      reader.readAsText(file);
    }
  }

  private applyTheme(): void {
    const body = document.body;
    body.classList.remove('light-theme', 'dark-theme');
    
    if (this.settings.theme === 'auto') {
      const isDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      body.classList.add(isDark ? 'dark-theme' : 'light-theme');
    } else {
      body.classList.add(`${this.settings.theme}-theme`);
    }
  }

  clearCache(): void {
    if (confirm('This will clear all cached data. The page will reload. Continue?')) {
      localStorage.clear();
      sessionStorage.clear();
      location.reload();
    }
  }

  downloadData(): void {
    // Simulate data export
    const userData = {
      profile: 'User profile data...',
      settings: this.settings,
      exportDate: new Date().toISOString()
    };
    
    const dataStr = JSON.stringify(userData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'my-data.json';
    link.click();
    URL.revokeObjectURL(url);
  }

  deleteAccount(): void {
    const confirmation = prompt('Type "DELETE" to confirm account deletion:');
    if (confirmation === 'DELETE') {
      alert('Account deletion request submitted. You will receive an email confirmation.');
    }
  }
}