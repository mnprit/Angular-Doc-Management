import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable, tap, catchError, throwError } from 'rxjs';
import { Router } from '@angular/router';
import { isPlatformBrowser } from '@angular/common';

interface AuthResponse {
  success: string;
  data: {
    user: any;
    tokens: {
      access: string;
      refresh: string;
    };
    data: {
      role: string;
    };
  };
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly API_URL = 'http://localhost:8000/api';
  private isAuthenticatedSubject = new BehaviorSubject<boolean>(false);
  isAuthenticated$ = this.isAuthenticatedSubject.asObservable();

  constructor(
    private http: HttpClient,
    private router: Router,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    if (isPlatformBrowser(this.platformId)) {
      this.isAuthenticatedSubject.next(!!localStorage.getItem('access_token'));
    }
  }

  private getHeaders(): HttpHeaders {
    return new HttpHeaders({
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    });
  }

  private handleError(error: HttpErrorResponse) {
    console.error('API Error:', error);
    let errorMessage = 'An error occurred';
    
    if (error.error instanceof ErrorEvent) {
      // Client-side error
      errorMessage = error.error.message;
    } else {
      // Server-side error
      errorMessage = error.error?.error || error.message || 'Server error occurred';
    }
    
    return throwError(() => ({ error: errorMessage }));
  }

  login(email: string, password: string): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(
      `${this.API_URL}/auth/login/`, 
      { email, password },
      { headers: this.getHeaders() }
    ).pipe(
      tap((response) => {
        if (isPlatformBrowser(this.platformId)) {
          localStorage.setItem('access_token', response.data.tokens.access);
          localStorage.setItem('refresh_token', response.data.tokens.refresh);
          localStorage.setItem('role', response.data.data.role);
        }
        this.isAuthenticatedSubject.next(true);
      }),
      catchError(this.handleError)
    );
  }

  signup(name: string, email: string, password: string, confirm_password: string): Observable<AuthResponse> {
    const signupData = {
      name,
      email,
      password,
      confirm_password,
      role: 'viewer'
    };
    
    return this.http.post<AuthResponse>(
      `${this.API_URL}/auth/register/`, 
      signupData,
      { headers: this.getHeaders() }
    ).pipe(
      catchError(this.handleError)
    );
  }

  logout(): Observable<any> {

    const refresh_token = isPlatformBrowser(this.platformId)
      ? localStorage.getItem('refresh_token')
      : null;
      if (isPlatformBrowser(this.platformId)) {
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        localStorage.removeItem('role');
      }
    return this.http.post(
      `${this.API_URL}/auth/logout/`, 
      { refresh: refresh_token },
      { headers: this.getHeaders() }
    ).pipe(
      tap(() => {
        this.isAuthenticatedSubject.next(false);
        this.router.navigate(['/login']);
      }),
      catchError(this.handleError)
    );
  }

  getAuthToken(): string | null {
    if (isPlatformBrowser(this.platformId)) {
      return localStorage.getItem('access_token');
    }
    return null;
  }

  refreshToken(): Observable<AuthResponse> {
    const refresh_token = isPlatformBrowser(this.platformId)
      ? localStorage.getItem('refresh_token')
      : null;

    if (!refresh_token) {
      this.logout();
      return throwError(() => new Error('No refresh token available'));
    }
    
    return this.http.post<AuthResponse>(
      `${this.API_URL}/auth/token/refresh/`, 
      { refresh: refresh_token },
      { headers: this.getHeaders() }
    ).pipe(
      tap((response) => {
        if (isPlatformBrowser(this.platformId)) {
          localStorage.setItem('access_token', response.data.tokens.access);
          localStorage.setItem('refresh_token', response.data.tokens.refresh);
        }
        this.isAuthenticatedSubject.next(true);
      }),
      catchError((error) => {
        this.logout();
        return throwError(() => error);
      })
    );
  }
}

