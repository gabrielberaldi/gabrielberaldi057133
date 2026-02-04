import { Component, inject, OnInit } from '@angular/core';
import { AsyncPipe } from '@angular/common';
import { PetsFacade } from '../../facades/pets.facade';
import { InputComponent } from '../../../../shared/components/input/input.component';
import { LucideAngularModule, PlusIcon } from 'lucide-angular';
import { ShellFacade } from '../../../../core/facades/shell.facade';
import { BreadcrumbConfig } from '../../../../core/models/breadcrumb-config.model';
import { PetCardComponent } from '../../components/pet-card/pet-card.component';
import { Router } from '@angular/router';
import { CardListComponent } from '../../../../shared/components/card-list/card-list.component';

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

  ngOnInit(): void {
    this.setBreadcrumbs();
  }

  protected onPageChange(page: number): void {
    this.petsFacade.changePage(page);
  }

  protected onSearch(value: string): void {
    this.petsFacade.search(value);
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
