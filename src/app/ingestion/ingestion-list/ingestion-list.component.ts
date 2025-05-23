import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { IngestionService, Ingestion, IngestionResponse } from '../../services/ingestion.service';
import { ToastService } from '../../services/toast.service';

@Component({
  selector: 'app-ingestion-list',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="container mt-4">
      <div class="d-flex justify-content-between align-items-center mb-4">
        <h2>Ingestions</h2>
        <button class="btn btn-primary" routerLink="create">Add New Ingestion</button>
      </div>

      <div class="row">
        <div class="col-12">
          <div class="card">
            <div class="card-body">
              <div class="table-responsive">
                <table class="table">
                  <thead>
                    <tr>
                      <th>Title</th>
                      <th>Description</th>
                      <th>Status</th>
                      <th>Created At</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr *ngFor="let ingestion of ingestions">
                      <td>{{ ingestion.document_title }}</td>
                      <td>{{ ingestion.document_description }}</td>
                      <td>
                        <span class="badge" [ngClass]="{
                          'bg-success': ingestion.status === 'completed',
                          'bg-warning': ingestion.status === 'processing',
                          'bg-danger': ingestion.status === 'failed'
                        }">
                          {{ ingestion.status }}
                        </span>
                      </td>
                      <td>{{ ingestion.created_at | date:'medium' }}</td>
                      <td>
                        <div class="btn-group">
                          <a [routerLink]="[ingestion.slug, 'view']" class="btn btn-sm btn-info">View</a>
                        </div>
                      </td>
                    </tr>
                    <tr *ngIf="ingestions.length === 0">
                      <td colspan="5" class="text-center">No ingestions found</td>
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
export class IngestionListComponent implements OnInit {
  ingestions: Ingestion[] = [];

  constructor(private ingestionService: IngestionService, private toastService: ToastService) {}

  ngOnInit() {
    this.loadIngestions();
  }

  loadIngestions() {
    this.ingestionService.getIngestions().subscribe({
      next: (ingestions) => {
        this.ingestions = ingestions.results;
      },
      error: (error) => {
        console.error('Error loading ingestions:', error);
      }
    });
  }
} 