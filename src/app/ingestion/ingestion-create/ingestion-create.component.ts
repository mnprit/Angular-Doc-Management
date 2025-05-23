import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { IngestionService } from '../../services/ingestion.service';
import { DocumentResponse, DocumentService } from '../../services/document.service';

@Component({
  selector: 'app-ingestion-create',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="container mt-4">
      <div class="row justify-content-center">
        <div class="col-md-8">
          <div class="card">
            <div class="card-body">
              <h2 class="card-title mb-4">Create New Ingestion</h2>
              <form [formGroup]="ingestionForm" (ngSubmit)="onSubmit()">
                <div class="mb-3">
                  <label for="document_title" class="form-label">Title</label>
                  <input
                    type="text"
                    class="form-control"
                    id="document_title"
                    formControlName="document_title"
                    [class.is-invalid]="submitted && ingestionForm.get('document_title')?.invalid"
                  >
                  <div class="invalid-feedback" *ngIf="submitted && ingestionForm.get('document_title')?.errors?.['required']">
                    Title is required
                  </div>
                </div>

                <div class="mb-3">
                  <label for="document_description" class="form-label">Description</label>
                  <textarea
                    class="form-control"
                    id="document_description"
                    rows="3"
                    formControlName="document_description"
                    [class.is-invalid]="submitted && ingestionForm.get('document_description')?.invalid"
                  ></textarea>
                  <div class="invalid-feedback" *ngIf="submitted && ingestionForm.get('document_description')?.errors?.['required']">
                    Description is required
                  </div>
                </div>

                <div class="d-flex justify-content-between">
                  <button type="button" class="btn btn-secondary" (click)="goBack()">Cancel</button>
                  <button type="submit" class="btn btn-primary" [disabled]="isSubmitting">
                    {{ isSubmitting ? 'Creating...' : 'Create Ingestion' }}
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
export class IngestionCreateComponent {
  ingestionForm: FormGroup;
  submitted = false;
  isSubmitting = false;
  documents: any[] = [];

  constructor(
    private fb: FormBuilder,
    private ingestionService: IngestionService,
    private documentService: DocumentService,
    private router: Router
  ) {
    this.ingestionForm = this.fb.group({
      document_title: ['', Validators.required],
      document_description: ['', Validators.required],
    });

    // Load documents for the dropdown
    this.documentService.getDocuments().subscribe({
      next: (docs: DocumentResponse) => {
        this.documents = docs.results;
      },
      error: (error) => {
        console.error('Error loading documents:', error);
      }
    });
  }

  onSubmit() {
    this.submitted = true;
    this.isSubmitting = true;

    if (this.ingestionForm.valid) {
      const formData = new FormData();
      formData.append('document_title', this.ingestionForm.get('document_title')?.value);
      formData.append('document_description', this.ingestionForm.get('document_description')?.value);

      this.ingestionService.createIngestion(formData).subscribe({
        next: () => {
          this.router.navigate(['/ingestion']);
        },
        error: (error) => {
          console.error('Error creating ingestion:', error);
          this.isSubmitting = false;
        }
      });
    } else {
      this.isSubmitting = false;
    }
  }

  goBack() {
    this.router.navigate(['/ingestion']);
  }
} 