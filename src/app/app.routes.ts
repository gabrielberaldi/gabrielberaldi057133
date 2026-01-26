import { Routes } from '@angular/router';
import { authGuard } from './core/auth/guards/auth.guard';

export const routes: Routes = [
  { 
    path: 'login', 
    loadComponent: () => import('./features/login/login.component').then(m => m.LoginComponent) 
  },
  { 
    path: 'shell', 
    loadComponent: () => import('./core/shell/shell.component').then(m => m.ShellComponent),
    canActivate: [authGuard],
  },
  {
    path: '**',
    redirectTo: 'login'
  }
];
