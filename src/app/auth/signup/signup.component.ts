import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css'],
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, RouterModule, HttpClientModule]
})
export class SignupComponent {
  signupForm: FormGroup;
  submitted = false;
  errorMessage = '';
  isLoading = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.signupForm = this.fb.group({
      name: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', [Validators.required]]
    }, {
      validators: this.passwordMatchValidator.bind(this)
    });
  }

  private passwordMatchValidator(g: FormGroup) {
    const password = g.get('password')?.value;
    const confirmPassword = g.get('confirmPassword')?.value;
    return password === confirmPassword ? null : { mismatch: true };
  }

  testSubmit() {
    this.submitted = true;
    this.errorMessage = '';
    this.isLoading = true;

    if (this.signupForm.valid) {
      const { name, email, password, confirmPassword } = this.signupForm.value;
      
      this.authService.signup(name, email, password, confirmPassword).subscribe({
        next: (response) => {
          this.isLoading = false;
          // After successful signup, login the user
          this.authService.login(email, password).subscribe({
            next: () => {
              this.router.navigate(['/dashboard']);
            },
            error: (error) => {
              this.errorMessage = error.error?.error || 'Auto-login failed. Please login manually.';
              this.router.navigate(['/login']);
            }
          });
        },
        error: (error) => {
          this.isLoading = false;
          if (error.error?.error) {
            this.errorMessage = error.error.error;
          } else if (error.status === 0) {
            this.errorMessage = 'Unable to connect to the server. Please check your internet connection.';
          } else {
            this.errorMessage = 'Registration failed. Please try again.';
          }
        }
      });
    } else {
      this.isLoading = false;
      // Mark all fields as touched to trigger validation messages
      Object.keys(this.signupForm.controls).forEach(key => {
        const control = this.signupForm.get(key);
        control?.markAsTouched();
      });
    }
  }

  // Helper methods for form validation
  getErrorMessage(controlName: string): string {
    const control = this.signupForm.get(controlName);
    if (!control) return '';

    if (control.hasError('required')) {
      return `${controlName.charAt(0).toUpperCase() + controlName.slice(1)} is required`;
    }
    if (control.hasError('email')) {
      return 'Please enter a valid email address';
    }
    if (control.hasError('minlength')) {
      return 'Password must be at least 6 characters long';
    }
    if (this.signupForm.hasError('mismatch') && controlName === 'confirmPassword') {
      return 'Passwords do not match';
    }
    return '';
  }
}
