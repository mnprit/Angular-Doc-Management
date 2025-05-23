import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-user-create',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="container mt-4">
      <div class="row justify-content-center">
        <div class="col-md-8">
          <div class="card">
            <div class="card-body">
              <h2 class="card-title mb-4">Create New User</h2>
              <form [formGroup]="userForm" (ngSubmit)="onSubmit()">
                <div class="mb-3">
                  <label for="name" class="form-label">Name</label>
                  <input
                    type="text"
                    class="form-control"
                    id="name"
                    formControlName="name"
                    [class.is-invalid]="submitted && userForm.get('name')?.invalid"
                  >
                  <div class="invalid-feedback" *ngIf="submitted && userForm.get('username')?.errors?.['required']">
                    Name is required
                  </div>
                </div>

                <div class="mb-3">
                  <label for="email" class="form-label">Email</label>
                  <input
                    type="email"
                    class="form-control"
                    id="email"
                    formControlName="email"
                    [class.is-invalid]="submitted && userForm.get('email')?.invalid"
                  >
                  <div class="invalid-feedback" *ngIf="submitted && userForm.get('email')?.errors?.['required']">
                    Email is required
                  </div>
                  <div class="invalid-feedback" *ngIf="submitted && userForm.get('email')?.errors?.['email']">
                    Please enter a valid email address
                  </div>
                </div>

                <div class="mb-3">
                  <label for="password" class="form-label">Password</label>
                  <input
                    type="password"
                    class="form-control"
                    id="password"
                    formControlName="password"
                    [class.is-invalid]="submitted && userForm.get('password')?.invalid"
                  >
                  <div class="invalid-feedback" *ngIf="submitted && userForm.get('password')?.errors?.['required']">
                    Password is required
                  </div>
                  <div class="invalid-feedback" *ngIf="submitted && userForm.get('password')?.errors?.['minlength']">
                    Password must be at least 6 characters
                  </div>
                </div>

                <div class="mb-3">
                  <label for="role" class="form-label">Role</label>
                  <select
                    class="form-select"
                    id="role"
                    formControlName="role"
                    [class.is-invalid]="submitted && userForm.get('role')?.invalid"
                  >
                    <option value="">Select a role</option>
                    <option value="1">Admin</option>
                    <option value="2">Editor</option>
                    <option value="3">Viewer</option>
                  </select>
                  <div class="invalid-feedback" *ngIf="submitted && userForm.get('role')?.errors?.['required']">
                    Role is required
                  </div>
                </div>

                <div class="d-flex justify-content-between">
                  <button type="button" class="btn btn-secondary" (click)="goBack()">Cancel</button>
                  <button type="submit" class="btn btn-primary" [disabled]="isSubmitting">
                    {{ isSubmitting ? 'Creating...' : 'Create User' }}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  `
})
export class UserCreateComponent {
  userForm: FormGroup;
  submitted = false;
  isSubmitting = false;

  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private router: Router
  ) {
    this.userForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      role: ['', Validators.required]
    });
  }

  onSubmit() {
    this.submitted = true;
    this.isSubmitting = true;

    if (this.userForm.valid) {
      this.userService.createUser(this.userForm.value).subscribe({
        next: () => {
          this.router.navigate(['/users']);
        },
        error: (error) => {
          console.error('Error creating user:', error);
          this.isSubmitting = false;
        }
      });
    } else {
      this.isSubmitting = false;
    }
  }

  goBack() {
    this.router.navigate(['/users']);
  }
} 