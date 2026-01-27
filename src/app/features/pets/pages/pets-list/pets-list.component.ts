import { Component, DestroyRef, inject, OnInit } from '@angular/core';
import { AsyncPipe } from '@angular/common';
import { PetsFacade } from '../../facades/pets.facade';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { debounceTime, distinctUntilChanged, startWith } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { InputComponent } from '../../../../shared/components/input/input.component';
import { LucideAngularModule, SearchIcon } from 'lucide-angular';
import { CardSkeletonComponent } from '../../../../shared/components/card-skeleton/card-skeleton.component';
import { PetCardComponent } from '../components/pet-card/pet-card.component';
import { PaginatorComponent } from '../../../../shared/components/paginator/paginator.component';
import { ShellFacade } from '../../../../core/facades/shell.facade';
import { Breadcrumb } from '../../../../core/models/breadcrumb.model';

@Component({
  selector: 'app-pets-list',
  standalone: true,
  imports: [AsyncPipe, CardSkeletonComponent, InputComponent, LucideAngularModule, PetCardComponent, PaginatorComponent, ReactiveFormsModule],
  templateUrl: './pets-list.component.html',
  styleUrl: './pets-list.component.scss'
})
export class PetsListComponent implements OnInit {

  protected readonly petsFacade = inject(PetsFacade);
  protected readonly shellFacade = inject(ShellFacade);

  protected readonly SearchIcon = SearchIcon;
  protected readonly searchControl = new FormControl('');

  private readonly destroyRef = inject(DestroyRef);

  ngOnInit(): void {
    this.searchControl.valueChanges.pipe(
      startWith(''),
      debounceTime(300),
      distinctUntilChanged(),
      takeUntilDestroyed(this.destroyRef)
    ).subscribe(value => this.petsFacade.search(value ?? ''));

    this.setBreadcrumbs();
  }

  
  protected onPageChange(page: number): void {
    this.petsFacade.changePage(page);
  }
  
  protected onViewDetails(petId: number): void {

  }
  
  private setBreadcrumbs(): void {
    this.shellFacade.setBreadCrumbs([{ label: 'Lista de pets '}]);
  }

}
