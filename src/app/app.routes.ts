import { Routes } from '@angular/router';
import { authGuard } from './core/auth/guards/auth.guard';

export const routes: Routes = [
  { 
    path: 'login', 
    loadComponent: () => import('./features/login/login.component').then(m => m.LoginComponent) 
  },
  { 
    path: 'shell', 
    loadChildren: () => import('./core/shell/shell.routes').then(m => m.SHELL_ROUTES),
    canActivate: [authGuard],
  },
  {
    path: '**',
    redirectTo: 'login'
  }
];
