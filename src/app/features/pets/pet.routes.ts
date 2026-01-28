import { Route } from "@angular/router";
import { PetsListComponent } from "./pages/pets-list/pets-list.component";
import { PetsDetailComponent } from "./pages/pets-detail/pets-detail.component";
import { PetFormComponent } from "./pages/pet-form/pet-form.component";

export const PET_ROUTES: Route[] = [
  {
    path: 'list',
    component: PetsListComponent,
  },
  {
    path: 'details/:id',
    component: PetsDetailComponent,
  },
  {
    path: 'new',
    component: PetFormComponent,
  },
  {
    path: 'edit/:id',
    component: PetFormComponent,
  },
  {
    path: '',
    redirectTo: 'list',
    pathMatch: 'full'
  }
];