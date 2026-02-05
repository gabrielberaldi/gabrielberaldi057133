import { Component, DestroyRef, inject, OnInit } from '@angular/core';
import { ShellFacade } from '../../../../core/facades/shell.facade';
import { PlusIcon } from 'lucide-angular';
import { Router } from '@angular/router';
import { TutorsFacade } from '../../facades/tutors.facade';
import { BreadcrumbConfig } from '../../../../core/models/breadcrumb-config.model';
import { AsyncPipe } from '@angular/common';
import { TutorCardComponent } from '../../components/tutor-card/tutor-card.component';
import { CardListComponent } from '../../../../shared/components/card-list/card-list.component';
import { DialogData } from '../../../../shared/components/dialog/models/dialog-data.model';
import { DialogService } from '../../../../shared/components/dialog/services/dialog.service';
import { Tutor } from '../../models/tutor.model';
import { filter, switchMap } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

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

  private readonly dialogService = inject(DialogService);
  private readonly destroyRef = inject(DestroyRef);

  ngOnInit(): void {
    this.setBreadcrumbs();
    this.tutorsFacade.refreshList();
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

  protected onDelete({ nome, id }: Tutor): void {
    const dialogData: DialogData = {
      title: 'Excluir Tutor',
      message: `Tem certeza que deseja remover ${nome}? Essa ação não pode ser desfeita.`,
      type: 'danger'
    };
    
    this.dialogService.open(dialogData)
    .pipe(
      filter(confirmed => confirmed),
      switchMap(() => this.tutorsFacade.deleteTutor(id!, true)),
      takeUntilDestroyed(this.destroyRef)
    ).subscribe();
  }
  
  protected onEdit(tutorId: number): void {
    this.router.navigate([`/shell/tutors/edit/${tutorId}`]);
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
