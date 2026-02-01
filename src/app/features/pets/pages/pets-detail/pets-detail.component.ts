import { AsyncPipe, Location } from '@angular/common';
import { Component, DestroyRef, inject, OnDestroy, OnInit } from '@angular/core';
import { LucideAngularModule, Phone, User, Users } from 'lucide-angular';
import { PetsFacade } from '../../facades/pets.facade';
import { ActivatedRoute, Router } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ShellFacade } from '../../../../core/facades/shell.facade';
import { DetailContainerComponent } from '../../../../shared/components/detail-container/detail-container.component';
import { filter, map, switchMap, tap } from 'rxjs';
import { InfoCardComponent } from '../../../../shared/components/info-card/info-card.component';

@Component({
  selector: 'app-pets-detail',
  standalone: true,
  imports: [AsyncPipe, DetailContainerComponent, InfoCardComponent, LucideAngularModule],
  templateUrl: './pets-detail.component.html',
  styleUrl: './pets-detail.component.scss'
})
export class PetsDetailComponent implements OnInit, OnDestroy {
  
  protected readonly petsFacade = inject(PetsFacade);
  private readonly activatedRoute = inject(ActivatedRoute);
  private readonly destroyRef = inject(DestroyRef);
  private readonly shellFacade = inject(ShellFacade);
  private readonly location = inject(Location);
  private readonly router = inject(Router);

  protected readonly Phone = Phone;
  protected readonly User = User;
  protected readonly Users = Users;

  protected id!: number;

  ngOnInit(): void {
    this.id = Number(this.activatedRoute.snapshot.paramMap.get('id'));
    this.initRouteListener();
  }

  ngOnDestroy(): void {
    this.petsFacade.clearPet();
  }

  protected onBack(): void {
    this.location.back();
  }

  protected onEdit(): void {
    this.router.navigateByUrl(`/shell/pets/edit/${this.id}`);
  }

  protected onItemClick(id: number): void {
    this.router.navigateByUrl(`/shell/tutors/details/${id}`);
  }

  private initRouteListener(): void {
    this.activatedRoute.paramMap
      .pipe(
        map(params => Number(params.get('id'))),
        filter(id => !!id),
        switchMap(id => this.petsFacade.loadPet(id)), 
        tap(pet => {
          if (pet) {
            this.shellFacade.setBreadCrumbs({ 
              breadcrumbs: [
                { label: 'Pets', link: '/shell/pets' },
                { label: 'Detalhes' }, 
                { label: pet.nome } 
              ] 
            });
          }
        }),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe();
  }

}
