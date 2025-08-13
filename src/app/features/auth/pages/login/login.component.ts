import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

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
  isGoogleLoading: boolean = false;

  constructor(
    private router: Router,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    console.log('Login component initialized');
  }

  onSubmit(): void {
    if (this.isFormValid()) {
      this.isLoading = true;
      this.loginMessage = '';

      setTimeout(() => {
        this.performLogin();
      }, 1500);
    }
  }

  private performLogin(): void {
    this.authService.login(this.loginData).subscribe({
      next: (response) => {
         this.isLoading = false;
         this.loginMessage = response.message;
         this.isLoginSuccess = true;
         this.router.navigate(['/home']);
      },
      error: (error) => {
        this.isLoading = false;
        this.isLoginSuccess = false;
        this.loginMessage = error.message || 'Login Failed';
        console.error('Login error:', error);
      }
    })
    
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
   async loginWithGoogle(): Promise<void> {
    if (this.isGoogleLoading) return;
    
    this.isGoogleLoading = true;
    this.loginMessage = '';
    
    try {
      console.log('Starting Google login...');
      const idToken = await this.authService.signIn();
      
      console.log('Google ID token received, sending to backend...');
      
      // Send the ID token to your backend
      this.authService.googleLogin(idToken).subscribe({
        next: (response) => {
          this.isGoogleLoading = false;
          this.loginMessage = response.message;
          this.isLoginSuccess = true;
          console.log('Google login successful:', response);
          this.router.navigate(['/home']);
        },
        error: (error) => {
          this.isGoogleLoading = false;
          this.isLoginSuccess = false;
          this.loginMessage = error.message || 'Google login failed';
          console.error('Google login error:', error);
        }
      });
      
    } catch (error) {
      this.isGoogleLoading = false;
      this.isLoginSuccess = false;
      
      // Handle different types of cancellation/errors
      if (error instanceof Error) {
        const errorMessage = error.message;
        
        if (errorMessage.includes('cancelled') || 
            errorMessage.includes('dismissed') || 
            errorMessage.includes('timed out')) {
          // User cancelled - don't show error message, just reset state
          console.log('Google sign-in was cancelled by user');
          this.loginMessage = '';
        } else if (errorMessage.includes('blocked')) {
          this.loginMessage = 'Google sign-in was blocked. Please allow popups and try again.';
        } else {
          this.loginMessage = 'Google login failed. Please try again.';
        }
      } else {
        this.loginMessage = 'Google login failed. Please try again.';
      }
      
      console.error('Google sign-in error:', error);
    }
  }

  loginWithGitHub(): void {
    console.log('GitHub login clicked');
    this.loginMessage = 'GitHub login is not implemented yet.';
    this.isLoginSuccess = false;
  }
}
