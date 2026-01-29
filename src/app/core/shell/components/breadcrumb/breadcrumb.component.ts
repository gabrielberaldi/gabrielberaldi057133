import { Component, Input } from '@angular/core';
import { BreadcrumbConfig } from '../../../models/breadcrumb-config.model';
import { RouterLink } from '@angular/router';
import { ArrowLeftIcon, LucideAngularModule } from 'lucide-angular';
import { ButtonComponent } from '../../../../shared/components/button/button.component';

@Component({
  selector: 'app-breadcrumb',
  standalone: true,
  imports: [ButtonComponent, RouterLink, LucideAngularModule],
  templateUrl: './breadcrumb.component.html',
  styleUrl: './breadcrumb.component.scss'
})
export class BreadcrumbComponent {

  @Input({ required: true }) config!: BreadcrumbConfig;

  protected readonly ArrowLeftIcon = ArrowLeftIcon;

}
