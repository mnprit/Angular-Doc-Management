import { Routes } from '@angular/router';
import { authGuard, publicGuard } from './guards/auth.guard';

export const routes: Routes = [
  {
    path: 'login',
    loadComponent: () => import('./auth/login/login.component').then(m => m.LoginComponent),
    canActivate: [publicGuard]
  },
  {
    path: 'signup',
    loadComponent: () => import('./auth/signup/signup.component').then(m => m.SignupComponent),
    canActivate: [publicGuard]
  },
  {
    path: '',
    loadComponent: () => import('./dashboard/dashboard.component').then(m => m.DashboardComponent),
    canActivate: [authGuard],
    children: [
      {
        path: 'documents',
        loadChildren: () => import('./document/document.routes').then(m => m.DOCUMENT_ROUTES)
      },
      {
        path: 'ingestion',
        loadChildren: () => import('./ingestion/ingestion.routes').then(m => m.INGESTION_ROUTES)
      },
      {
        path: 'users',
        loadChildren: () => import('./users/users.routes').then(m => m.USER_ROUTES)
      },
      {
        path: '',
        redirectTo: 'documents',
        pathMatch: 'full'
      }
    ]
  },
  {
    path: '**',
    redirectTo: ''
  }
];
