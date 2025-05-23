import { Routes } from '@angular/router';

export const DOCUMENT_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () => import('./document-list/document-list.component').then(m => m.DocumentListComponent)
  },
  {
    path: 'create',
    loadComponent: () => import('./document-create/document-create.component').then(m => m.DocumentCreateComponent)
  },
  // {
  //   path: ':id',
  //   loadComponent: () => import('./document-detail/document-detail.component').then(m => m.DocumentDetailComponent)
  // },
  {
    path: ':id/edit',
    loadComponent: () => import('./document-edit/document-edit.component').then(m => m.DocumentEditComponent)
  }
]; 