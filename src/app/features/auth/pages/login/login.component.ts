import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

interface LoginData {
  email: string;
  password: string;
  rememberMe: boolean;
}
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
   loginData: LoginData = {
    email: '',
    password: '',
    rememberMe: false
  };

  showPassword: boolean = false;
  isLoading: boolean = false;
  loginMessage: string = '';
  isLoginSuccess: boolean = false;

  constructor(private router: Router) {}

  ngOnInit(): void {
    console.log('Login component initialized');
  }

  onSubmit(): void {
    if (this.isFormValid()) {
      this.isLoading = true;
      this.loginMessage = '';

      // Simulate API call
      setTimeout(() => {
        this.performLogin();
      }, 1500);
    }
  }

  private performLogin(): void {
    // Demo login logic
    if (this.loginData.email === 'demo@example.com' && this.loginData.password === 'demo123') {
      this.isLoginSuccess = true;
      this.loginMessage = 'Login successful! Redirecting to dashboard...';
      
      // Simulate successful login and redirect
      setTimeout(() => {
        this.router.navigate(['/home']);
      }, 1000);
    } else {
      this.isLoginSuccess = false;
      this.loginMessage = 'Invalid email or password. Please try again.';
    }
    
    this.isLoading = false;
  }

  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }

  fillDemoCredentials(): void {
    this.loginData.email = 'demo@example.com';
    this.loginData.password = 'demo123';
  }

  private isFormValid(): boolean {
    return this.loginData.email.length > 0 && 
           this.loginData.password.length >= 6 &&
           this.isValidEmail(this.loginData.email);
  }

  private isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  // Social login methods (placeholder)
  loginWithGoogle(): void {
    console.log('Google login clicked');
    this.loginMessage = 'Google login is not implemented yet.';
    this.isLoginSuccess = false;
  }

  loginWithGitHub(): void {
    console.log('GitHub login clicked');
    this.loginMessage = 'GitHub login is not implemented yet.';
    this.isLoginSuccess = false;
  }
}
