import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { DocumentService } from '../../services/document.service';

@Component({
  selector: 'app-document-detail',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="container mt-4">
      <div class="row justify-content-center">
        <div class="col-md-8">
          <div class="card">
            <div class="card-body">
              <h2 class="card-title mb-4">Document Details</h2>
              <form [formGroup]="documentForm">
                <div class="mb-3">
                  <label for="title" class="form-label">Title</label>
                  <input
                    type="text"
                    class="form-control"
                    id="title"
                    formControlName="title"
                    [class.is-invalid]="submitted && documentForm.get('title')?.invalid"
                  >
                </div>

                <div class="mb-3">
                  <label for="description" class="form-label">Description</label>
                  <textarea
                    class="form-control"
                    id="description"
                    rows="3"
                    formControlName="description"
                    [class.is-invalid]="submitted && documentForm.get('description')?.invalid"
                  ></textarea>
                </div>

                <div class="d-flex justify-content-between">
                  <button type="button" class="btn btn-secondary" (click)="goBack()">Cancel</button>
                  <button type="submit" class="btn btn-primary" [disabled]="isSubmitting">
                    {{ isSubmitting ? 'Saving...' : 'Save Changes' }}
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
export class DocumentDetailComponent implements OnInit {
  documentForm: FormGroup;
  submitted = false;
  isSubmitting = false;
  selectedFile: File | null = null;
  documentId: string | null = null;

  constructor(
    private fb: FormBuilder,
    private documentService: DocumentService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.documentForm = this.fb.group({
      title: ['', Validators.required],
      description: ['', Validators.required]
    });
  }

  ngOnInit() {
    this.documentId = this.route.snapshot.paramMap.get('id');
    if (this.documentId) {
      this.loadDocument();
    }
  }

  loadDocument() {
    if (this.documentId) {
      this.documentService.getDocument(this.documentId).subscribe({
        next: (document) => {
          this.documentForm.patchValue({
            title: document.title,
            description: document.description
          });
        },
        error: (error) => {
          console.error('Error loading document:', error);
          this.router.navigate(['/documents']);
        }
      });
    }
  }

  goBack() {
    this.router.navigate(['/documents']);
  }
} 