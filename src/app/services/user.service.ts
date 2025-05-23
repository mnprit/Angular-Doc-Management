import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';

export interface User {
  id: string;
  name: string;
  email: string;
  role: number;
  created_at: string;
  updated_at: string;
  slug: string;
}

export interface UserData {
  data: {
    id: string;
    name: string;
    email: string;
    role: number;
    created_at: string;
    updated_at: string;
    slug: string;
  }
}

export interface UserResponse {
  results: User[];
}

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private apiUrl = 'http://localhost:8000/api';

  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) {}

  private getHeaders() {
    const token = this.authService.getAuthToken();
    return {
      Authorization: `Bearer ${token}`
    };
  }

  getUsers(): Observable<UserResponse> {
    return this.http.get<UserResponse>(`${this.apiUrl}/users/`);
  }

  getUser(slug: string): Observable<UserData> {
    return this.http.get<UserData>(`${this.apiUrl}/users/${slug}/`, {
      headers: this.getHeaders()
    });
  }

  createUser(userData: any): Observable<User> {
    return this.http.post<User>(`${this.apiUrl}/users/`, userData, {
      headers: this.getHeaders()
    });
  }

  updateUser(slug: string, userData: any): Observable<User> {
    return this.http.put<User>(`${this.apiUrl}/users/${slug}/`, userData, {
      headers: this.getHeaders()
    });
  }

  deleteUser(slug: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/users/${slug}/`, {
      headers: this.getHeaders()
    });
  }
} 