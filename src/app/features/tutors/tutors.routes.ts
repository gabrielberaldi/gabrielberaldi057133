import { Routes } from '@angular/router';

export const TUTORS_ROUTE: Routes = [
  {
    path: 'list',
    loadComponent: () => 
      import('./pages/tutors-list/tutors-list.component').then(m => m.TutorsListComponent),
  },
  {
    path: 'details/:id',
    loadComponent: () => 
      import('./pages/tutors-detail/tutors-detail.component').then(m => m.TutorsDetailComponent),
  },
  {
    path: 'new',
    loadComponent: () => 
      import('./pages/tutors-form/tutors-form.component').then(m => m.TutorsFormComponent),
  },
  {
    path: 'edit/:id',
    loadComponent: () => 
      import('./pages/tutors-form/tutors-form.component').then(m => m.TutorsFormComponent),
  },
  {
    path: '',
    redirectTo: 'list',
    pathMatch: 'full'
  }
];