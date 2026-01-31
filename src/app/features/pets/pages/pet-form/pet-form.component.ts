import { Component, DestroyRef, inject, OnDestroy, OnInit } from '@angular/core';
import { ShellFacade } from '../../../../core/facades/shell.facade';
import { BreadcrumbConfig } from '../../../../core/models/breadcrumb-config.model';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { InputComponent } from '../../../../shared/components/input/input.component';
import { ArrowLeft, LucideAngularModule, PawPrint, Save, Trash2 } from 'lucide-angular';
import { PetsFacade } from '../../facades/pets.facade';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { filter, switchMap } from 'rxjs';
import { Pet } from '../../models/pet.model';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { DialogService } from '../../../../shared/components/dialog/services/dialog.service';
import { DialogData } from '../../../../shared/components/dialog/models/dialog-data.model';
import { UploadComponent } from '../../../../shared/components/upload/upload.component';
import { AsyncPipe } from '@angular/common';
import { ButtonComponent } from '../../../../shared/components/button/button.component';

@Component({
  selector: 'app-pet-form',
  standalone: true,
  imports: [AsyncPipe, ButtonComponent, InputComponent, LucideAngularModule, ReactiveFormsModule, RouterLink, UploadComponent],
  templateUrl: './pet-form.component.html',
  styleUrl: './pet-form.component.scss'
})
export class PetFormComponent implements OnInit, OnDestroy {

  private readonly activatedRoute = inject(ActivatedRoute);
  private readonly destroyRef = inject(DestroyRef);
  private readonly formBuilder = inject(FormBuilder);

  private readonly dialogService = inject(DialogService);

  private readonly shellFacade = inject(ShellFacade);
  protected readonly petsFacade = inject(PetsFacade);

  protected readonly ArrowLeft = ArrowLeft;
  protected readonly PawPrint = PawPrint;
  protected readonly Trash2 = Trash2;
  protected readonly Save = Save;

  protected readonly petForm = this.formBuilder.nonNullable.group({
    id: [null as number | null],
    nome: ['', Validators.required],
    raca: ['', Validators.required],
    idade: [0, [Validators.required, Validators.min(0)]]
  });

  protected petId!: number;
  protected pendingPhoto: File | null = null;

  ngOnInit(): void {
    this.petId = Number(this.activatedRoute.snapshot.paramMap.get('id'));
    this.initPetStateListener();
    this.initRouteListener();
  }

  ngOnDestroy(): void {
    this.petsFacade.clearPet();
  }

  protected onDelete(): void {

    const dialogData: DialogData = {  
      title: 'Excluir Pet',
      message: `Tem certeza que deseja remover ${this.petForm.get('nome')?.value}? Essa ação não pode ser desfeita.`,
      type: 'danger'
    };

    this.dialogService.open(dialogData)
      .pipe(
        filter(confirmed => confirmed),
        switchMap(() => this.petsFacade.deletePet(this.petId)),
        takeUntilDestroyed(this.destroyRef)
      ).subscribe()
  }
  
  protected onFileChange(event: File): void {
    if (!this.petId) {
      this.pendingPhoto = event;
      return;
    };

    this.petsFacade.uploadAttachment(this.petId, event)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe();
  }

  protected onRemoveRequest(): void {
    if (!this.petId) {
      this.pendingPhoto = null;
    };

    const dialogData: DialogData = {
      title: 'Remover Foto',
      message: 'Tem certeza que deseja remover a foto deste pet?',
      type: 'danger'
    };

    const photoId = this.petsFacade.currentPetSnapshot?.foto?.id;
    if (!this.petId || !photoId) return;

    this.dialogService.open(dialogData)
      .pipe(
        filter(confirmed => confirmed),
        switchMap(() => this.petsFacade.removeAttachment(this.petId, photoId)),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe();
  }

  protected onSave(): void {
    if (this.petForm.invalid) {
      return this.petForm.markAllAsTouched();
    };

    this.petsFacade.store(this.petForm.getRawValue(), this.pendingPhoto)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe();
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
          this.setBreadcrumbs();
        }
      }
    );
  }

  private initPetStateListener(): void {
    this.petsFacade.pet$
      .pipe(
        filter((pet): pet is Pet => !!pet),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe(pet => {
        this.petForm.patchValue(pet);
        this.setBreadcrumbs(pet.nome);
      }
    );
  }

  private setBreadcrumbs(petName?: string): void {
    const config: BreadcrumbConfig = { breadcrumbs: [{ label: 'Pets' }, { label: petName ?? 'Cadastro' }]  };
    this.shellFacade.setBreadCrumbs(config);
  }

}
