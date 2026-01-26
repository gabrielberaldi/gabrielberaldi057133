import { Route } from "@angular/router";
import { PetsListComponent } from "./pages/pets-list/pets-list.component";
import { PetsDetailComponent } from "./pages/pets-detail/pets-detail.component";

export const PET_ROUTES: Route[] = [
  {
    path: 'list',
    component: PetsListComponent,
  },
  {
    path: 'detail',
    component: PetsDetailComponent,
  },
  {
    path: '',
    redirectTo: 'list',
    pathMatch: 'full'
  }
];