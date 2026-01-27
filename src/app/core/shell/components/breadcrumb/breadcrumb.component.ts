import { Component, Input } from '@angular/core';
import { Breadcrumb } from '../../../auth/models/breadcrumb.model';
import { RouterLink } from '@angular/router';
import { ArrowLeftIcon, LucideAngularModule } from 'lucide-angular';

@Component({
  selector: 'app-breadcrumb',
  standalone: true,
  imports: [RouterLink, LucideAngularModule],
  templateUrl: './breadcrumb.component.html',
  styleUrl: './breadcrumb.component.scss'
})
export class BreadcrumbComponent {

  @Input({ required: true }) items!: Breadcrumb[];

  protected readonly ArrowLeftIcon = ArrowLeftIcon;

}
