import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from '../auth/login/login.component';

const routes: Routes = [
  { path: 'auth', loadChildren: () => import('../auth/auth.module').then(m => m.AuthModule) },
  { path: 'users', loadChildren: () => import('../users/users.module').then(m => m.UsersModule) },
  { path: 'document', loadChildren: () => import('../document/document.module').then(m => m.DocumentModule) },
  { path: 'ingestion', loadChildren: () => import('../ingestion/ingestion.module').then(m => m.IngestionModule) },
  { path: 'login', component: LoginComponent }, // Login route
  { path: '', redirectTo: '/login', pathMatch: 'full' }, // Redirect root path to login
  { path: '**', redirectTo: '/login' } // Wildcard route for undefined paths
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}