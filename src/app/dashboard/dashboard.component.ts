import { Component } from '@angular/core';
import { RouterModule, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../services/auth.service';
import { ToastService } from '../services/toast.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [RouterModule, CommonModule],
  template: `
    <nav class="navbar navbar-expand-lg navbar-dark bg-primary">
      <div class="container">
        <a class="navbar-brand" href="#">Document Management</a>
        <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
          <span class="navbar-toggler-icon"></span>
        </button>
        <div class="collapse navbar-collapse" id="navbarNav">
          <ul class="navbar-nav me-auto">
            <li class="nav-item">
              <a  id="users-link" class="nav-link" (click)="onUserClick()">Users</a>
            </li>
            <li class="nav-item">
              <a id="documents-link" class="nav-link" routerLink="/documents" routerLinkActive="active">Documents</a>
            </li>
            <li class="nav-item">
              <a id="ingestion-link" class="nav-link" (click)="ingestion()">Ingestion</a>
            </li>
          </ul>
          <button class="btn btn-outline-light" (click)="logout()">Logout</button>
        </div>
      </div>
    </nav>
    <div class="container mt-4">
      <router-outlet></router-outlet>
    </div>
  `,
  styles: [`
    .navbar-nav .nav-link.active {
      font-weight: bold;
    }
  `]
})
export class DashboardComponent {
    constructor(private authService: AuthService, private router: Router, private toastService: ToastService) {}

  logout() {
    this.authService.logout().subscribe();
  }

  ingestion() {
    if (localStorage.getItem('role')?.toString() == '1') {
      this.router.navigate(['/ingestion']);
      document.getElementById('ingestion-link')?.classList.add('active');
      document.getElementById('documents-link')?.classList.remove('active');
      document.getElementById('users-link')?.classList.remove('active');  
    } else {
      this.toastService.show('Error', 'You are not authorized to access this page');
    }
    
  }
  onUserClick() {
    if (localStorage.getItem('role')?.toString() == '1') {
      this.router.navigate(['/users']);
      document.getElementById('users-link')?.classList.add('active');
      document.getElementById('documents-link')?.classList.remove('active');
      document.getElementById('ingestion-link')?.classList.remove('active');
    } else {
      this.toastService.error('Error', 'You are not authorized to access this page');
    }
  }
} 