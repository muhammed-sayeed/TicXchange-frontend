import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

interface RegisterData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
  agreeTerms: boolean;
}

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  
  registerData: RegisterData = {
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    agreeTerms: false
  };

  showPassword: boolean = false;
  isLoading: boolean = false;
  registerMessage: string = '';
  isRegisterSuccess: boolean = false;

  constructor(private router: Router) {}

  ngOnInit(): void {
    console.log('Register component initialized');
  }

  onSubmit(): void {
    if (this.isFormValid()) {
      this.isLoading = true;
      this.registerMessage = '';

      // Simulate API call
      setTimeout(() => {
        this.performRegistration();
      }, 2000);
    }
  }

  private performRegistration(): void {
    // Simulate successful registration
    this.isRegisterSuccess = true;
    this.registerMessage = 'Account created successfully! Redirecting to login...';
    
    // Redirect to login page after successful registration
    setTimeout(() => {
      this.router.navigate(['/auth/login']);
    }, 2000);
    
    this.isLoading = false;
  }

  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }

  private isFormValid(): boolean {
    return this.registerData.firstName.length > 0 &&
           this.registerData.lastName.length > 0 &&
           this.registerData.email.length > 0 &&
           this.registerData.password.length >= 8 &&
           this.registerData.password === this.registerData.confirmPassword &&
           this.registerData.agreeTerms &&
           this.isValidEmail(this.registerData.email);
  }

  private isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }
}