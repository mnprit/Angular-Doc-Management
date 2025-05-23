import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { IngestionService, IngestionDetail } from '../../services/ingestion.service';
import { DocumentService, DocumentResponse } from '../../services/document.service';

@Component({
  selector: 'app-ingestion-edit',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="container mt-4">
      <div class="row justify-content-center">
        <div class="col-md-8">
          <div class="card">
            <div class="card-body">
              <h2 class="card-title mb-4">View Ingestion</h2>
              <form [formGroup]="ingestionForm">
                <div class="mb-3">
                  <label for="document_title" class="form-label">Title</label>
                  <input
                    type="text"
                    class="form-control"
                    id="document_title"
                    formControlName="document_title"
                    [class.is-invalid]="submitted && ingestionForm.get('document_title')?.invalid"
                    readonly>
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
                  readonly></textarea>
                  <div class="invalid-feedback" *ngIf="submitted && ingestionForm.get('document_description')?.errors?.['required']">
                    Description is required
                  </div>
                </div>
                
                <div class="mb-3">
                  <label for="status" class="form-label">Status</label>
                  <select
                    class="form-select"
                    id="status"
                    formControlName="status"
                    [class.is-invalid]="submitted && ingestionForm.get('status')?.invalid"
                  readonly>
                    <option value="pending">Pending</option>
                    <option value="processing">Processing</option>
                    <option value="completed">Completed</option>
                    <option value="failed">Failed</option>
                  </select>
                  <div class="invalid-feedback" *ngIf="submitted && ingestionForm.get('status')?.errors?.['required']">
                    Status is required
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  `
})
export class IngestionEditComponent implements OnInit {
  ingestionForm: FormGroup;
  submitted = false;
  isSubmitting = false;
  documents: any[] = [];
  ingestionId: string | null = null;

  constructor(
    private fb: FormBuilder,
    private ingestionService: IngestionService,
    private documentService: DocumentService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.ingestionForm = this.fb.group({
      document_title: ['', Validators.required],
      document_description: ['', Validators.required],
      status: ['', Validators.required]
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

  ngOnInit() {
    this.ingestionId = this.route.snapshot.paramMap.get('slug');
    if (this.ingestionId) {
      this.loadIngestion();
    }
  }

  loadIngestion() {
    if (this.ingestionId) {
      this.ingestionService.getIngestion(this.ingestionId).subscribe({
        next: (ingestion: IngestionDetail) => {
          this.ingestionForm.patchValue({
            document_title: ingestion.data.document_title,
            document_description: ingestion.data.document_description,
            status: ingestion.data.status
          });
        },
        error: (error) => {
          console.error('Error loading ingestion:', error);
          this.router.navigate(['/ingestion']);
        }
      });
    }
  }

  goBack() {
    this.router.navigate(['/ingestion']);
  }
} 