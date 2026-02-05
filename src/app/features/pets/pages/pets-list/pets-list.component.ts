import { Component, DestroyRef, inject, OnInit } from '@angular/core';
import { AsyncPipe } from '@angular/common';
import { PetsFacade } from '../../facades/pets.facade';
import { InputComponent } from '../../../../shared/components/input/input.component';
import { LucideAngularModule, PlusIcon } from 'lucide-angular';
import { ShellFacade } from '../../../../core/facades/shell.facade';
import { BreadcrumbConfig } from '../../../../core/models/breadcrumb-config.model';
import { PetCardComponent } from '../../components/pet-card/pet-card.component';
import { Router } from '@angular/router';
import { CardListComponent } from '../../../../shared/components/card-list/card-list.component';
import { filter, switchMap } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { DialogData } from '../../../../shared/components/dialog/models/dialog-data.model';
import { DialogService } from '../../../../shared/components/dialog/services/dialog.service';
import { Pet } from '../../models/pet.model';

@Component({
  selector: 'app-pets-list',
  standalone: true,
  imports: [AsyncPipe, CardListComponent, InputComponent, LucideAngularModule, PetCardComponent],
  templateUrl: './pets-list.component.html',
  styleUrl: './pets-list.component.scss'
})
export class PetsListComponent implements OnInit {

  protected readonly router = inject(Router);
  protected readonly petsFacade = inject(PetsFacade);
  protected readonly shellFacade = inject(ShellFacade);

  private readonly dialogService = inject(DialogService);
  private readonly destroyRef = inject(DestroyRef);

  ngOnInit(): void {
    this.setBreadcrumbs();
    this.petsFacade.refreshList();
  }

  protected onPageChange(page: number): void {
    this.petsFacade.changePage(page);
  }

  protected onSearch(value: string): void {
    this.petsFacade.search(value);
  }
  
  protected onDelete({ nome, id }: Pet): void {
    const dialogData: DialogData = {  
      title: 'Excluir Pet',
      message: `Tem certeza que deseja remover ${nome}? Essa ação não pode ser desfeita.`,
      type: 'danger'
    };

    this.dialogService.open(dialogData)
      .pipe(
        filter(confirmed => confirmed),
        switchMap(() => this.petsFacade.deletePet(id!, true)),
        takeUntilDestroyed(this.destroyRef)
      ).subscribe()
  }

  protected onEdit(tutorId: number): void {
    this.router.navigate([`/shell/pets/edit/${tutorId}`]);
  }

  protected onViewDetails(petId: number): void {
    this.router.navigate([`/shell/pets/details/${petId}`]);
  }

  private setBreadcrumbs(): void {
    const config: BreadcrumbConfig = {
      breadcrumbs: [{ label: 'Pets' }, { label: 'Listagem' }],
      button: { 
        icon: PlusIcon,
        label: 'Adicionar novo pet',
        link: '/shell/pets/new',
      }
    };
    this.shellFacade.setBreadCrumbs(config);
  }

}
