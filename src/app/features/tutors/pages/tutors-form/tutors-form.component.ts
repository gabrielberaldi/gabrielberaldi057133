import { Component, DestroyRef, inject, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { DialogService } from '../../../../shared/components/dialog/services/dialog.service';
import { ActivatedRoute } from '@angular/router';
import { LucideAngularModule, SearchIcon, UserRound } from 'lucide-angular';
import { TutorsFacade } from '../../facades/tutors.facade';
import { ShellFacade } from '../../../../core/facades/shell.facade';
import { InputComponent } from '../../../../shared/components/input/input.component';
import { UploadComponent } from '../../../../shared/components/upload/upload.component';
import { BreadcrumbConfig } from '../../../../core/models/breadcrumb-config.model';
import { DialogData } from '../../../../shared/components/dialog/models/dialog-data.model';
import { debounceTime, distinctUntilChanged, filter, startWith, switchMap } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Tutor } from '../../models/tutor.model';
import { ButtonComponent } from '../../../../shared/components/button/button.component';
import { AsyncPipe, Location } from '@angular/common';
import { PetsFacade } from '../../../pets/facades/pets.facade';
import { TutorPetsListComponent } from '../../components/tutor-pets-list/tutor-pets-list.component';
import { ModalComponent } from '../../../../shared/components/modal/modal.component';
import { TutorPetSelectComponent } from '../../components/tutor-pet-select/tutor-pet-select.component';
import { FormActionsComponent } from '../../../../shared/components/form/form-actions/form-actions.component';
import { FormHeaderComponent } from '../../../../shared/components/form/form-header/form-header.component';

@Component({
  selector: 'app-tutors-form',
  standalone: true,
  imports: [AsyncPipe, 
    ButtonComponent,
    FormActionsComponent,
    FormHeaderComponent, 
    InputComponent, 
    LucideAngularModule, 
    ModalComponent, 
    ReactiveFormsModule, 
    UploadComponent, 
    TutorPetsListComponent, 
    TutorPetSelectComponent
  ],
  templateUrl: './tutors-form.component.html',
  styleUrl: './tutors-form.component.scss'
})
export class TutorsFormComponent implements OnInit, OnDestroy {

  private readonly activatedRoute = inject(ActivatedRoute);
  private readonly destroyRef = inject(DestroyRef);
  private readonly formBuilder = inject(FormBuilder);
  private readonly location = inject(Location);
  private readonly dialogService = inject(DialogService);
  protected readonly petsFacade = inject(PetsFacade);
  protected readonly tutorsFacade = inject(TutorsFacade);
  private readonly shellFacade = inject(ShellFacade);

  protected readonly UserRound = UserRound;
  protected readonly SearchIcon = SearchIcon
  
  protected readonly tutorForm = this.formBuilder.nonNullable.group({
    id: [null as number | null],
    nome: ['', [Validators.required, Validators.maxLength(100)]],
    telefone: ['', [Validators.required, Validators.maxLength(20)]],
    endereco: ['', Validators.maxLength(200)]
  });

  protected tutorId!: number;
  protected isModalOpen = false;
  protected readonly petSearchControl = new FormControl('');
  protected pendingPhoto: File | null = null;

  ngOnInit(): void {
    this.initTutorStateListener();
    this.listenToSearchControl();
    this.initRouteListener();
  }

  ngOnDestroy(): void {
    this.tutorsFacade.clearTutor();
  }

  protected onBack(): void {
    this.location.back();
  }

  protected onDelete(): void {
    const dialogData: DialogData = {
      title: 'Excluir Tutor',
      message: `Tem certeza que deseja remover ${this.tutorForm.get('nome')?.value}? Essa ação não pode ser desfeita.`,
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
    
    if (!this.tutorId) {
      this.pendingPhoto = event;
      return;
    }
    
    this.tutorsFacade.uploadAttachment(this.tutorId, event)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe();
  }

  protected onRemoveRequest(): void {
    if (!this.tutorId) {
      this.pendingPhoto = null;
    };

    const dialogData: DialogData = {
      title: 'Remover Foto',
      message: 'Tem certeza que deseja remover a foto deste tutor?',
      type: 'danger'
    };

    const photoId = this.tutorsFacade.currentTutorSnapshot?.foto?.id;

    if (!this.tutorId || !photoId) return;

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

    this.tutorsFacade.store(this.tutorForm.getRawValue(), this.pendingPhoto)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe();
  }
  
  protected openLinkModal(): void {
    this.isModalOpen = true;
  }

  protected onConfirmLink(petId: number): void {
    this.tutorsFacade.linkPet(this.tutorId, petId)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(() => {
        this.onModalClose();
        this.petSearchControl.reset();
      });
  }

  protected onUnlinkPet(petId: number): void {
    const dialogData: DialogData = {
      title: 'Remover Vínculo',
      message: 'Tem certeza que deseja desvincular este pet deste tutor?',
      type: 'danger'
    };

    this.dialogService.open(dialogData).pipe(
      filter(confirmed => confirmed),
      switchMap(() => this.tutorsFacade.unlinkPet(this.tutorId, petId)),
      takeUntilDestroyed(this.destroyRef)
    ).subscribe();
  }

  protected onModalClose(): void {
    this.isModalOpen = false;
  }

  private initRouteListener(): void {
    this.activatedRoute.paramMap
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(params => {
        this.tutorId = Number(params.get('id'));
        if (this.tutorId) {
          this.tutorsFacade.loadTutor(this.tutorId).subscribe();
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
    const config: BreadcrumbConfig = { breadcrumbs: [{ label: 'Tutores', link: 'shell/tutors' }, { label: tutorName ?? 'Cadastro' }] };
    this.shellFacade.setBreadCrumbs(config);
  }

  private listenToSearchControl(): void {
    this.petSearchControl.valueChanges.pipe(
      startWith(''),
      debounceTime(300),
      distinctUntilChanged(),
      takeUntilDestroyed(this.destroyRef)
    ).subscribe(value => this.petsFacade.search(value ?? ''));
  }

}
