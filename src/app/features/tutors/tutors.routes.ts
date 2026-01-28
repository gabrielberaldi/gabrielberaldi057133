import { Route } from "@angular/router";
import { TutorsListComponent } from "./pages/tutors-list/tutors-list.component";
import { TutorsDetailComponent } from "./pages/tutors-detail/tutors-detail.component";
import { TutorsFormComponent } from "./pages/tutors-form/tutors-form.component";


export const TUTORS_ROUTE: Route[] = [
  {
    path: 'list',
    component: TutorsListComponent,
  },
  {
    path: 'details/:id',
    component: TutorsDetailComponent,
  },
  {
    path: 'new',
    component: TutorsFormComponent,
  },
  {
    path: 'edit/:id',
    component: TutorsFormComponent,
  },
  {
    path: '',
    redirectTo: 'list',
    pathMatch: 'full'
  }
];