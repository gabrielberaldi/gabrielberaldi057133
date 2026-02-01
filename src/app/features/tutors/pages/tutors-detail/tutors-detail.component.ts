import { Component, DestroyRef, inject, OnDestroy, OnInit } from '@angular/core';
import { DetailContainerComponent } from '../../../../shared/components/detail-container/detail-container.component';
import { InfoCardComponent } from '../../../../shared/components/info-card/info-card.component';
import { LucideAngularModule, PawPrint, User,} from 'lucide-angular';
import { TutorsFacade } from '../../facades/tutors.facade';
import { ActivatedRoute, Router } from '@angular/router';
import { ShellFacade } from '../../../../core/facades/shell.facade';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { AsyncPipe } from '@angular/common';
import { filter, map, switchMap, tap } from 'rxjs';

@Component({
  selector: 'app-tutors-detail',
  standalone: true,
  imports: [ AsyncPipe, DetailContainerComponent, InfoCardComponent, LucideAngularModule, ],
  templateUrl: './tutors-detail.component.html',
  styleUrl: './tutors-detail.component.scss'
})
export class TutorsDetailComponent implements OnInit, OnDestroy {

  protected readonly tutorsFacade = inject(TutorsFacade);
  private readonly activatedRoute = inject(ActivatedRoute);
  private readonly destroyRef = inject(DestroyRef);
  private readonly shellFacade = inject(ShellFacade);
  private readonly router = inject(Router);

  protected readonly PawPrint = PawPrint;
  protected readonly User = User;

  protected id!: number;

  ngOnInit(): void {
    this.id = Number(this.activatedRoute.snapshot.paramMap.get('id'));
    this.initRouteListener();
  }

  ngOnDestroy(): void {
    this.tutorsFacade.clearTutor();
  }

  protected onBack(): void {
    this.router.navigateByUrl('/shell/tutors');
  }

  protected onEdit(): void {
    this.router.navigateByUrl(`/shell/tutors/edit/${this.id}`);
  }

  protected onItemClick(id: number): void {
    this.router.navigateByUrl(`/shell/pets/details/${id}`);
  }

  private initRouteListener(): void {
    this.activatedRoute.paramMap
      .pipe(
        map(params => Number(params.get('id'))),
        filter(id => !!id),
        switchMap(id => this.tutorsFacade.loadTutor(id)), 
        tap(tutor => {
          if (tutor) {
            this.shellFacade.setBreadCrumbs({ 
              breadcrumbs: [
                { label: 'Tutores', link: '/shell/tutors' },
                { label: 'Detalhes' }, 
                { label: tutor.nome } 
              ] 
            });
          }
        }),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe();
    }

}
