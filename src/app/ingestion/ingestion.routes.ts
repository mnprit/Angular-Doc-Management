import { Routes } from '@angular/router';

export const INGESTION_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () => import('./ingestion-list/ingestion-list.component').then(m => m.IngestionListComponent)
  },
  {
    path: 'create',
    loadComponent: () => import('./ingestion-create/ingestion-create.component').then(m => m.IngestionCreateComponent)
  },
  {
    path: ':slug/view',
    loadComponent: () => import('./ingestion-edit/ingestion-edit.component').then(m => m.IngestionEditComponent)
  }
]; 