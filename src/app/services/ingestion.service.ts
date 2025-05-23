import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';

export interface Ingestion {
  id: string;
  name: string;
  description: string;
  status: string;
  created_at: string;
  updated_at: string;
  document: string;
  document_title: string;
  document_description: string;
  slug: string;
}

export interface IngestionResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: Ingestion[];
}

export interface IngestionDetail {
  data: { 
    id: string; 
    name: string;
    description: string;
    status: string;
    created_at: string;
    updated_at: string;
    document: string;
    document_title: string;
    document_description: string;
    slug: string;
  }
}

@Injectable({
  providedIn: 'root'
})
export class IngestionService {
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

  getIngestions(): Observable<IngestionResponse> {
    return this.http.get<IngestionResponse>(`${this.apiUrl}/ingestion/`, {
      headers: this.getHeaders()
    });
  }

  getIngestion(slug: string): Observable<IngestionDetail> {
    return this.http.get<IngestionDetail>(`${this.apiUrl}/ingestion/${slug}/`, {
      headers: this.getHeaders()
    });
  }

  createIngestion(formData: FormData): Observable<Ingestion> {
    return this.http.post<Ingestion>(`${this.apiUrl}/ingestion/`, formData, {
      headers: {
        ...this.getHeaders(),
        // Don't set Content-Type for FormData, let the browser set it with the boundary
      }
    });
  }

  updateIngestion(id: string, formData: FormData): Observable<Ingestion> {
    return this.http.put<Ingestion>(`${this.apiUrl}/ingestion/${id}/`, formData, {
      headers: {
        ...this.getHeaders(),
        // Don't set Content-Type for FormData, let the browser set it with the boundary
      }
    });
  }

  deleteIngestion(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/ingestion/${id}/`, {
      headers: this.getHeaders()
    });
  }
} 