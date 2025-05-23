import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { DocumentService, Document, DocumentResponse } from '../../services/document.service';


@Component({
  selector: 'app-document-list',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="container mt-4">
      <div class="d-flex justify-content-between align-items-center mb-4">
        <h2>Documents</h2>
        <button class="btn btn-primary" routerLink="create">Add New Document</button>
      </div>

      <div class="row">
        <div class="col-12">
          <div class="card">
            <div class="card-body">
              <div class="table-responsive">
                <table class="table">
                  <thead>
                    <tr>
                      
                      <th>User</th>
                      <th>Title</th>
                      <th>Description</th>
                      <th>Created At</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr *ngFor="let doc of documents">
                      <td>{{ doc.user_email }}</td>
                      <td>{{ doc.title }}</td>
                      <td>{{ doc.description }}</td>
                      <td>{{ doc.created_at | date:'medium' }}</td>
                      <td>
                        <div class="btn-group">
                          <!-- <a [routerLink]="[doc.slug]" class="btn btn-sm btn-info">View</a> -->
                          <a [routerLink]="[doc.slug, 'edit']" class="btn btn-sm btn-warning">Edit</a>
                          <button class="btn btn-sm btn-danger" (click)="deleteDocument(doc.slug)">Delete</button>
                        </div>
                      </td>
                    </tr>
                    <tr *ngIf="documents.length === 0">
                      <td colspan="5" class="text-center">No documents found</td>
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
export class DocumentListComponent implements OnInit {
  documents: Document[] = [];

  constructor(private documentService: DocumentService) {}

  ngOnInit() {
    this.loadDocuments();
  }

  loadDocuments() {
    this.documentService.getDocuments().subscribe({
      next: (response: any) => {
        console.log('API Response:', response);
        if (response && Array.isArray(response.results)) {
          this.documents = response.results;
          console.log('Documents array:', this.documents);
        } else {
          console.log('Invalid response format');
          this.documents = [];
        }
      },
      error: (error) => {
        console.error('Error loading documents:', error);
        this.documents = [];
      }
    });
  }

  deleteDocument(slug: string) {
    if (confirm('Are you sure you want to delete this document?')) {
      this.documentService.deleteDocument(slug).subscribe({
        next: () => {
          this.documents = this.documents.filter(doc => doc.slug !== slug);
        },
        error: (error) => {
          console.error('Error deleting document:', error);
        }
      });
    }
  }
} 