import { Component, DestroyRef, inject, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { DialogService } from '../../../../shared/components/dialog/services/dialog.service';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { ArrowLeft, LucideAngularModule, Save, Trash2, UserRound } from 'lucide-angular';
import { TutorsFacade } from '../../facades/tutors.facade';
import { ShellFacade } from '../../../../core/facades/shell.facade';
import { InputComponent } from '../../../../shared/components/input/input.component';
import { UploadComponent } from '../../../../shared/components/upload/upload.component';
import { BreadcrumbConfig } from '../../../../core/models/breadcrumb-config.model';
import { DialogData } from '../../../../shared/components/dialog/models/dialog-data.model';
import { filter, switchMap } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Tutor } from '../../models/tutor.model';
import { ButtonComponent } from '../../../../shared/components/button/button.component';
import { AsyncPipe } from '@angular/common';

@Component({
  selector: 'app-tutors-form',
  standalone: true,
  imports: [AsyncPipe, ButtonComponent, InputComponent, LucideAngularModule, ReactiveFormsModule, RouterLink, UploadComponent],
  templateUrl: './tutors-form.component.html',
  styleUrl: './tutors-form.component.scss'
})
export class TutorsFormComponent implements OnInit, OnDestroy {

  private readonly activatedRoute = inject(ActivatedRoute);
  private readonly destroyRef = inject(DestroyRef);
  private readonly formBuilder = inject(FormBuilder);

  private readonly dialogService = inject(DialogService);

  private readonly shellFacade = inject(ShellFacade);
  protected readonly tutorsFacade = inject(TutorsFacade);

  protected readonly ArrowLeft = ArrowLeft;
  protected readonly UserRound = UserRound;
  protected readonly Trash2 = Trash2;
  protected readonly Save = Save;
  

  protected readonly tutorForm = this.formBuilder.nonNullable.group({
    id: [null as number | null],
    nome: ['', [Validators.required, Validators.maxLength(100)]],
    telefone: ['', [Validators.required, Validators.maxLength(20)]],
    endereco: ['', Validators.maxLength(200)]
  });

  protected tutorId!: number;

  ngOnInit(): void {
    this.tutorId = Number(this.activatedRoute.snapshot.paramMap.get('id'));
    this.initTutorStateListener();
    this.initRouteListener();
  }

  ngOnDestroy(): void {
    this.tutorsFacade.clearTutor();
  }

  protected onDelete(): void {

    const dialogData: DialogData = {
      title: 'Excluir Tutor',
      message: `Tem certeza que deseja remover ${this.tutorForm.get('nome')?.value}? Essa ação não pode ser desfeita.`,
      confirmText: 'Sim',
      cancelText: 'Cancelar',
      type: 'danger'
    };

    this.dialogService.open(dialogData)
      .pipe(
        filter(confirmed => confirmed),
        switchMap(() => this.tutorsFacade.deleteTutor(this.tutorId)),
        takeUntilDestroyed(this.destroyRef)
      ).subscribe()
  }

  protected onFileChange(event: File): void {
    if (!this.tutorId) return;
    this.tutorsFacade.uploadAttachment(this.tutorId, event)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe();
  }

  protected onRemoveRequest(): void {

    const dialogData: DialogData = {
      title: 'Remover Foto',
      message: 'Tem certeza que deseja remover a foto deste tutor?',
      confirmText: 'Sim',
      type: 'danger'
    };

    const photoId = this.tutorsFacade.currentTutorSnapshot?.foto?.id;

    if (!this.tutorId || !photoId) {
      return;
    }

    this.dialogService.open(dialogData)
      .pipe(
        filter(confirmed => confirmed),
        switchMap(() => this.tutorsFacade.removeAttachment(this.tutorId, photoId)),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe();
  }

  protected onSave(): void {
    if (this.tutorForm.invalid) {
      return this.tutorForm.markAllAsTouched();
    };

    this.tutorsFacade.store(this.tutorForm.getRawValue())
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe();
  }

  private initRouteListener(): void {
    this.activatedRoute.paramMap
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(params => {
        const id = params.get('id');
        if (id) {
          this.tutorsFacade.loadTutor(Number(id)).subscribe();
        } else {
          this.tutorsFacade.clearTutor();
          this.setBreadcrumbs();
        }
      }
      );
  }

  private initTutorStateListener(): void {
    this.tutorsFacade.tutor$
      .pipe(
        filter((tutor): tutor is Tutor => !!tutor),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe(tutor => {
        this.tutorForm.patchValue(tutor);
        this.setBreadcrumbs(tutor.nome);
      }
      );
  }

  private setBreadcrumbs(tutorName?: string): void {
    const config: BreadcrumbConfig = { breadcrumbs: [{ label: 'Tutores' }, { label: tutorName ?? 'Cadastro' }] };
    this.shellFacade.setBreadCrumbs(config);
  }

}
