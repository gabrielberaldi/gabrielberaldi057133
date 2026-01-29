import { AsyncPipe } from '@angular/common';
import { Component, DestroyRef, inject, OnDestroy, OnInit } from '@angular/core';
import { ArrowLeft, ExternalLink, LucideAngularModule, PawPrint, Pencil, Phone, Users } from 'lucide-angular';
import { PetsFacade } from '../../facades/pets.facade';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { filter, tap } from 'rxjs';

@Component({
  selector: 'app-pets-detail',
  standalone: true,
  imports: [AsyncPipe, LucideAngularModule, RouterLink],
  templateUrl: './pets-detail.component.html',
  styleUrl: './pets-detail.component.scss'
})
export class PetsDetailComponent implements OnInit, OnDestroy {

  protected readonly petsFacade = inject(PetsFacade);
  private readonly activatedRoute = inject(ActivatedRoute);
  private readonly destroyRef = inject(DestroyRef);

  protected readonly ArrowLeft = ArrowLeft;
  protected readonly ExternalLink = ExternalLink;
  protected readonly Paw = PawPrint;
  protected readonly Pencil = Pencil;
  protected readonly Phone = Phone;
  protected readonly Users = Users;

  protected id!: number;

  ngOnInit(): void {
    this.id = Number(this.activatedRoute.snapshot.paramMap.get('id'));
    this.initRouteListener();
  }

  ngOnDestroy(): void {
    this.petsFacade.clearPet();
  }

  private initRouteListener(): void {
    this.activatedRoute.paramMap
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(params => {
        const id = params.get('id');
        if (id) {
          this.petsFacade.loadPet(Number(id)).subscribe();
        } else {
          this.petsFacade.clearPet();
          // this.setBreadcrumbs();
        }
      }
    );
  }

  

}
