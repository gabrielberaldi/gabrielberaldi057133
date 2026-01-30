import { Component, DestroyRef, inject, OnInit } from '@angular/core';
import { ShellFacade } from '../../../../core/facades/shell.facade';
import { LucideAngularModule, PlusIcon, SearchIcon } from 'lucide-angular';
import { Router } from '@angular/router';
import { TutorsFacade } from '../../facades/tutors.facade';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { debounceTime, distinctUntilChanged, startWith } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { BreadcrumbConfig } from '../../../../core/models/breadcrumb-config.model';
import { PaginatorComponent } from '../../../../shared/components/paginator/paginator.component';
import { AsyncPipe } from '@angular/common';
import { InputComponent } from '../../../../shared/components/input/input.component';
import { TutorCardComponent } from '../../components/tutor-card/tutor-card.component';

@Component({
  selector: 'app-tutors-list',
  standalone: true,
  imports: [ AsyncPipe, InputComponent, LucideAngularModule, PaginatorComponent, ReactiveFormsModule, TutorCardComponent ],
  templateUrl: './tutors-list.component.html',
  styleUrl: './tutors-list.component.scss'
})
export class TutorsListComponent implements OnInit {

  protected readonly router = inject(Router);
  protected readonly shellFacade = inject(ShellFacade);
  protected readonly tutorsFacade = inject(TutorsFacade);

  protected readonly SearchIcon = SearchIcon;
  protected readonly searchControl = new FormControl('');

  private readonly destroyRef = inject(DestroyRef);

  ngOnInit(): void {
    this.listenToSearchControl();
    this.setBreadcrumbs();
  }

  protected onPageChange(page: number): void {
    this.tutorsFacade.changePage(page);
  }
  
  protected onViewDetails(petId: number): void {
    this.router.navigate([`/shell/tutors/edit/${petId}`]);
  }

  private listenToSearchControl(): void {
    this.searchControl.valueChanges.pipe(
      startWith(''),
      debounceTime(300),
      distinctUntilChanged(),
      takeUntilDestroyed(this.destroyRef)
    ).subscribe(value => this.tutorsFacade.search(value ?? ''));
  }

  private setBreadcrumbs(): void {
    const config: BreadcrumbConfig = {
      breadcrumbs: [{ label: 'Tutores' }, { label: 'Listagem' }],
      button: { 
        icon: PlusIcon,
        label: 'Adicionar',
        link: '/shell/tutors/new',
      }
    };
    this.shellFacade.setBreadCrumbs(config);
  }

}
