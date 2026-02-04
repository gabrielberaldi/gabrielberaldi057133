import { Component, inject, Input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ArrowLeftIcon, LucideAngularModule } from 'lucide-angular';
import { ButtonComponent } from '../../../../shared/components/button/button.component';
import { ShellFacade } from '../../../facades/shell.facade';
import { AsyncPipe, NgClass } from '@angular/common';

@Component({
  selector: 'app-breadcrumb',
  standalone: true,
  imports: [AsyncPipe, ButtonComponent, RouterLink, LucideAngularModule, NgClass],
  templateUrl: './breadcrumb.component.html',
  styleUrl: './breadcrumb.component.scss'
})
export class BreadcrumbComponent {

  protected readonly shellFacade = inject(ShellFacade);
  protected readonly ArrowLeftIcon = ArrowLeftIcon;

}
