import { Route } from "@angular/router";
import { ShellComponent } from "./shell.component";

export const SHELL_ROUTES: Route[] = [
  {
    path: '',
    component: ShellComponent,
    children: [
      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'pets'
      },
      {
        path: 'pets',
        loadChildren: () => import('../../features/pets/pet.routes').then(m => m.PET_ROUTES)
      },
      {
        path: 'tutors',
        component: ShellComponent
      }
    ]
  }
]