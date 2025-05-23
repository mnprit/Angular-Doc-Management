import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { UserService, User } from '../../services/user.service';

interface UserResponse {
  results: User[];
}

@Component({
  selector: 'app-user-list',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="container mt-4">
      <div class="d-flex justify-content-between align-items-center mb-4">
        <h2>Users</h2>
        <button class="btn btn-primary" routerLink="create">Add New User</button>
      </div>

      <div class="row">
        <div class="col-12">
          <div class="card">
            <div class="card-body">
              <div class="table-responsive">
                <table class="table">
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Email</th>
                      <th>Role</th>
                      <th>Created At</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr *ngFor="let user of users">
                      <td>{{ user.name }}</td>
                      <td>{{ user.email }}</td>
                      <td>
                        <span class="badge" [ngClass]="{
                          'bg-primary': user.role === 1,
                          'bg-success': user.role === 2,
                          'bg-info': user.role === 3
                        }">
                          {{ user.role === 1 ? "Admin" : user.role === 2 ? "Editor" : "Viewer" }}
                        </span>
                      </td>
                      <td>{{ user.created_at | date:'medium' }}</td>
                      <td>
                        <div class="btn-group">
                          <!-- <a [routerLink]="['/users', user.slug]" class="btn btn-sm btn-info">View</a> -->
                          <a [routerLink]="['/users', user.slug, 'edit']" class="btn btn-sm btn-warning">Edit</a>
                          <button class="btn btn-sm btn-danger" (click)="deleteUser(user.slug)">Delete</button>
                        </div>
                      </td>
                    </tr>
                    <tr *ngIf="users.length === 0">
                      <td colspan="5" class="text-center">No users found</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `
})
export class UserListComponent implements OnInit {
  users: User[] = [];

  constructor(private userService: UserService) {}

  ngOnInit() {
    this.loadUsers();
  }

  loadUsers() {
    this.userService.getUsers().subscribe({
      next: (response: UserResponse) => {
        this.users = response.results;
      },
      error: (error) => {
        console.error('Error loading users:', error);
      }
    });
  }

  deleteUser(slug: string) {
    if (confirm('Are you sure you want to delete this user?')) {
      this.userService.deleteUser(slug).subscribe({
        next: () => {
          this.users = this.users.filter(user => user.slug !== slug);
        },
        error: (error) => {
          console.error('Error deleting user:', error);
        }
      });
    }
  }
} 