import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';
import { map } from 'rxjs/operators';

export interface Document {
  id: number;
  slug: string;
  title: string;
  description: string;
  user_name: string;
  user_email: string;
  created_at: string;
  is_active: boolean;
}

export interface DocumentResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: Document[];
}

export interface DocumentData {
  data: {
    id: number;
    slug: string;
    title: string;
    description: string;
    user_name: string;
}
}

@Injectable({
  providedIn: 'root'
})
export class DocumentService {
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

  getDocuments(): Observable<DocumentResponse> {
    return this.http.get<DocumentResponse>(`${this.apiUrl}/documents/`, {
      headers: this.getHeaders()
    }).pipe(
      map(response => {
        console.log('Service response:', response);
        return response;
      })
    );
  }

  getDocument(slug: string): Observable<DocumentData> {
    return this.http.get<DocumentData>(`${this.apiUrl}/documents/${slug}/`, {
      headers: this.getHeaders()
    });
  }

  createDocument(formData: FormData): Observable<Document> {
    return this.http.post<Document>(`${this.apiUrl}/documents/`, formData, {
      headers: {
        ...this.getHeaders(),
        // Don't set Content-Type for FormData, let the browser set it with the boundary
      }
    });
  }

  updateDocument(slug: string, formData: FormData): Observable<Document> {
    return this.http.put<Document>(`${this.apiUrl}/documents/${slug}/`, formData, {
      headers: {
        ...this.getHeaders(),
        // Don't set Content-Type for FormData, let the browser set it with the boundary
      }
    });
  }

  deleteDocument(slug: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/documents/${slug}`, {
      headers: this.getHeaders()
    });
  }
} 