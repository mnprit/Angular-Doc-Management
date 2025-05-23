import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { DocumentService } from '../../services/document.service';
import { ToastService } from '../../services/toast.service';

@Component({
  selector: 'app-document-create',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="container mt-4">
      <div class="row justify-content-center">
        <div class="col-md-8">
          <div class="card">
            <div class="card-body">
              <h2 class="card-title mb-4">Create New Document</h2>
              <form [formGroup]="documentForm" (ngSubmit)="onSubmit()">
                <div class="mb-3">
                  <label for="title" class="form-label">Title</label>
                  <input
                    type="text"
                    class="form-control"
                    id="title"
                    formControlName="title"
                    [class.is-invalid]="submitted && documentForm.get('title')?.invalid"
                  >
                  <div class="invalid-feedback" *ngIf="submitted && documentForm.get('title')?.errors?.['required']">
                    Title is required
                  </div>
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
                  <div class="invalid-feedback" *ngIf="submitted && documentForm.get('description')?.errors?.['required']">
                    Description is required
                  </div>
                </div>

                <div class="d-flex justify-content-between">
                  <button type="button" class="btn btn-secondary" (click)="goBack()">Cancel</button>
                  <button type="submit" class="btn btn-primary" [disabled]="isSubmitting">
                    {{ isSubmitting ? 'Creating...' : 'Create Document' }}
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
export class DocumentCreateComponent {
  documentForm: FormGroup;
  submitted = false;
  isSubmitting = false;
  selectedFile: File | null = null;

  constructor(
    private fb: FormBuilder,
    private documentService: DocumentService,
    private router: Router,
    private toastService: ToastService
  ) {
    this.documentForm = this.fb.group({
      title: ['', Validators.required],
      description: ['', Validators.required]
    });
  }
  onSubmit() {
    this.submitted = true;
    this.isSubmitting = true;

    if (this.documentForm.valid) {
      const formData = new FormData();
      formData.append('title', this.documentForm.get('title')?.value);
      formData.append('description', this.documentForm.get('description')?.value);

      this.documentService.createDocument(formData).subscribe({
        next: () => {
          this.router.navigate(['/documents']);
        },
        error: (error) => {
          this.toastService.show('Error creating document:', error.error.detail);
          console.error('Error creating document:', error);
          this.isSubmitting = false;
        }
      });
    } else {
      this.isSubmitting = false;
    }
  }

  goBack() {
    this.router.navigate(['/documents']);
  }
} 