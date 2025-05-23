// import { NgModule } from '@angular/core';
// import { CommonModule } from '@angular/common';
// import { ReactiveFormsModule } from '@angular/forms';
// import { LoginComponent } from './login/login.component';

// @NgModule({
//   declarations: [],
//   imports: [
//     CommonModule,
//     ReactiveFormsModule,
//     LoginComponent
//   ]
// })
// export class AuthModule { }


import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  { path: 'login', loadComponent: () => import('./login/login.component').then(m => m.LoginComponent) },
  { path: 'signup', loadComponent: () => import('./signup/signup.component').then(m => m.SignupComponent) }
];

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(routes)
  ]
})
export class AuthModule { }
