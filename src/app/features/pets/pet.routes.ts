import { Routes } from "@angular/router";

export const PET_ROUTES: Routes = [
  {
    path: 'list',
    loadComponent: () => 
      import('./pages/pets-list/pets-list.component').then(m => m.PetsListComponent),
  },
  {
    path: 'details/:id',
    loadComponent: () => 
      import('./pages/pets-detail/pets-detail.component').then(m => m.PetsDetailComponent),
  },
  {
    path: 'new',
    loadComponent: () => 
      import('./pages/pet-form/pet-form.component').then(m => m.PetFormComponent),
  },
  {
    path: 'edit/:id',
    loadComponent: () => 
      import('./pages/pet-form/pet-form.component').then(m => m.PetFormComponent),
  },
  {
    path: '',
    redirectTo: 'list',
    pathMatch: 'full'
  }
];