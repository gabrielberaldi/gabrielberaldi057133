import { Component, inject, OnInit } from '@angular/core';
import { ShellFacade } from '../../../../core/facades/shell.facade';
import { PlusIcon } from 'lucide-angular';
import { Router } from '@angular/router';
import { TutorsFacade } from '../../facades/tutors.facade';
import { BreadcrumbConfig } from '../../../../core/models/breadcrumb-config.model';
import { AsyncPipe } from '@angular/common';
import { TutorCardComponent } from '../../components/tutor-card/tutor-card.component';
import { CardListComponent } from '../../../../shared/components/card-list/card-list.component';

@Component({
  selector: 'app-tutors-list',
  standalone: true,
  imports: [ AsyncPipe, CardListComponent, TutorCardComponent ],
  templateUrl: './tutors-list.component.html',
  styleUrl: './tutors-list.component.scss'
})
export class TutorsListComponent implements OnInit {

  protected readonly router = inject(Router);
  protected readonly shellFacade = inject(ShellFacade);
  protected readonly tutorsFacade = inject(TutorsFacade);

  ngOnInit(): void {
    this.setBreadcrumbs();
  }

  protected onPageChange(page: number): void {
    this.tutorsFacade.changePage(page);
  }

  protected onSearch(value: string): void {
    this.tutorsFacade.search(value);
  }
  
  protected onViewDetails(tutorId: number): void {
    this.router.navigate([`/shell/tutors/details/${tutorId}`]);
  }

  private setBreadcrumbs(): void {
    const config: BreadcrumbConfig = {
      breadcrumbs: [{ label: 'Tutores' }, { label: 'Listagem' }],
      button: { 
        icon: PlusIcon,
        label: 'Adicionar novo tutor',
        link: '/shell/tutors/new',
      }
    };
    this.shellFacade.setBreadCrumbs(config);
  }

}
