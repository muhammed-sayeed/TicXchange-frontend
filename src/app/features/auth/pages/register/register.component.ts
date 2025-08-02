// src/app/features/auth/components/register/register.component.ts
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService, RegisterRequest, OtpVerifyRequest } from '../../services/auth.service';

interface RegisterData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
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
    confirmPassword: ''
  };

  // OTP related properties
  showOtpModal: boolean = false;
   otpDigits: string[] = new Array(6).fill('');
  otpValue: string = '';
  
  // UI state properties
  showPassword: boolean = false;
  isLoading: boolean = false;
  isOtpLoading: boolean = false;
  registerMessage: string = '';
  otpMessage: string = '';
  isRegisterSuccess: boolean = false;
  otpError: boolean = false;

  // Timer for OTP resend
  resendTimer: number = 0;
  resendInterval: any;

  constructor(
    private router: Router,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    console.log('Register component initialized');
  }

  onSubmit(): void {
    if (this.isFormValid()) {
      this.isLoading = true;
      this.registerMessage = '';

      const registerRequest: RegisterRequest = {
        firstname: this.registerData.firstName,
        lastname: this.registerData.lastName,
        email: this.registerData.email,
        password: this.registerData.password,
        role: 'user' // Default role
      };

      this.authService.signup(registerRequest).subscribe({
        next: (response) => {
          this.isLoading = false;
          this.registerMessage = response.message;
          this.isRegisterSuccess = true;
          
          // Show OTP modal
          this.showOtpModal = true;
          this.startResendTimer();
        },
        error: (error) => {
          this.isLoading = false;
          this.isRegisterSuccess = false;
          this.registerMessage = error.userMessage || 'Registration failed. Please try again.';
          console.error('Registration error:', error);
        }
      });
    }
  }

 onOtpDigitInput(event: any, index: number): void {
  const input = event.target as HTMLInputElement;
  const value = input.value;

  console.log(`Input at index ${index}: value = ${value}`); // Debug log

  // Validate and update otpDigits via ngModel
  if (value.length === 1 && /^\d$/.test(value)) {
    // ngModel will update otpDigits[i], no need to set it manually here
    if (index < 5) {
      setTimeout(() => {
        const nextInput = document.getElementById(`otp-${index + 1}`) as HTMLInputElement;
        if (nextInput) {
          nextInput.focus();
          nextInput.select(); // Select content for immediate typing
        }
      }, 10); // Delay to ensure DOM updates
    }
  } else if (value.length === 0 && index > 0) {
    // Handle backspace or clearing
    const prevInput = document.getElementById(`otp-${index - 1}`) as HTMLInputElement;
    if (prevInput) {
      prevInput.focus();
    }
  } else if (value.length > 1 || !/^\d*$/.test(value)) {
    input.value = this.otpDigits[index]; // Revert to last valid value
  }

  this.otpValue = this.otpDigits.join('');
  this.otpError = false;
  this.otpMessage = '';
}

  onOtpKeyDown(event: KeyboardEvent, index: number): void {
    if (event.key === 'Backspace' && this.otpDigits[index] === '' && index > 0) {
      // Move to previous input on backspace
      const prevInput = document.getElementById(`otp-${index - 1}`) as HTMLInputElement;
      if (prevInput) {
        prevInput.focus();
      }
    }
  }

  onOtpPaste(event: ClipboardEvent): void {
    event.preventDefault();
    const pastedData = event.clipboardData?.getData('text') || '';
    
    if (/^\d{6}$/.test(pastedData)) {
      // Valid 6-digit OTP
      for (let i = 0; i < 6; i++) {
        this.otpDigits[i] = pastedData[i];
        const input = document.getElementById(`otp-${i}`) as HTMLInputElement;
        if (input) {
          input.value = pastedData[i];
        }
      }
      this.otpValue = pastedData;
      this.otpError = false;
      this.otpMessage = '';
    }
  }

  verifyOtp(): void {
    if (this.otpValue.length !== 6) {
      this.otpError = true;
      this.otpMessage = 'Please enter all 6 digits';
      return;
    }

    this.isOtpLoading = true;
    this.otpMessage = '';
    this.otpError = false;

    const otpRequest: OtpVerifyRequest = {
      email: this.registerData.email,
      otp: this.otpValue
    };

    this.authService.verifyOtp(otpRequest).subscribe({
      next: (response) => {
        this.isOtpLoading = false;
        this.otpMessage = response.message || 'Registration successful!';
        
        // Clear timer
        this.clearResendTimer();
        
        // Close modal and redirect after short delay
        setTimeout(() => {
          this.showOtpModal = false;
          this.router.navigate(['/home']);
        }, 1500);
      },
      error: (error) => {
        this.isOtpLoading = false;
        this.otpError = true;
        this.otpMessage = error.userMessage || 'Invalid OTP. Please try again.';
        
        // Clear OTP inputs on error
        this.clearOtpInputs();
        
        console.error('OTP verification error:', error);
      }
    });
  }

  resendOtp(): void {
    if (this.resendTimer > 0) return;

    this.authService.resendOtp(this.registerData.email).subscribe({
      next: (response) => {
        this.otpMessage = 'OTP resent successfully!';
        this.otpError = false;
        this.clearOtpInputs();
        this.startResendTimer();
      },
      error: (error) => {
        this.otpError = true;
        this.otpMessage = error.userMessage || 'Failed to resend OTP';
        console.error('Resend OTP error:', error);
      }
    });
  }

  closeOtpModal(): void {
    this.showOtpModal = false;
    this.clearOtpInputs();
    this.clearResendTimer();
    this.otpMessage = '';
    this.otpError = false;
  }

  private clearOtpInputs(): void {
    this.otpDigits = ['', '', '', '', '', ''];
    this.otpValue = '';
    
    // Clear input fields
    for (let i = 0; i < 6; i++) {
      const input = document.getElementById(`otp-${i}`) as HTMLInputElement;
      if (input) {
        input.value = '';
      }
    }
    
    // Focus first input
    const firstInput = document.getElementById('otp-0') as HTMLInputElement;
    if (firstInput) {
      firstInput.focus();
    }
  }

  private startResendTimer(): void {
    this.resendTimer = 60; // 60 seconds
    this.resendInterval = setInterval(() => {
      this.resendTimer--;
      if (this.resendTimer <= 0) {
        this.clearResendTimer();
      }
    }, 1000);
  }

  private clearResendTimer(): void {
    if (this.resendInterval) {
      clearInterval(this.resendInterval);
      this.resendInterval = null;
    }
    this.resendTimer = 0;
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
           this.isValidEmail(this.registerData.email);
  }

  private isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  ngOnDestroy(): void {
    this.clearResendTimer();
  }
}