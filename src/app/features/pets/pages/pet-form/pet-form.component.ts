import { Component, DestroyRef, inject, OnDestroy, OnInit } from '@angular/core';
import { ShellFacade } from '../../../../core/facades/shell.facade';
import { BreadcrumbConfig } from '../../../../core/models/breadcrumb-config.model';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { InputComponent } from '../../../../shared/components/input/input.component';
import { LucideAngularModule, PawPrintIcon } from 'lucide-angular';
import { PetsFacade } from '../../facades/pets.facade';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { filter } from 'rxjs';
import { Pet } from '../../models/pet.model';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-pet-form',
  standalone: true,
  imports: [InputComponent, LucideAngularModule, ReactiveFormsModule],
  templateUrl: './pet-form.component.html',
  styleUrl: './pet-form.component.scss'
})
export class PetFormComponent implements OnInit, OnDestroy {

  private readonly activatedRoute = inject(ActivatedRoute);
  private readonly destroyRef = inject(DestroyRef);
  private readonly formBuilder = inject(FormBuilder);

  private readonly petsFacade = inject(PetsFacade);
  private readonly shellFacade = inject(ShellFacade);

  protected readonly PawPrintIcon = PawPrintIcon;

  protected readonly petForm = this.formBuilder.nonNullable.group({
    id: [null as number | null],
    nome: ['', Validators.required],
    raca: ['', Validators.required],
    idade: [0, Validators.required]
  });

  protected petId!: number;

  ngOnInit(): void {
    this.petId = Number(this.activatedRoute.snapshot.paramMap.get('id'));
    this.initPetStateListener();
    this.initRouteListener();
  }

  ngOnDestroy(): void {
    this.petsFacade.clearPet();
  }

  protected onSave(): void {
    if (this.petForm.invalid) {
      return this.petForm.markAllAsTouched();
    };

    this.petsFacade.store(this.petForm.getRawValue())
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe();
  }

  private initRouteListener(): void {
    this.activatedRoute.paramMap
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(params => {
        const id = params.get('id');
        console.log(params, ' prms');
        
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
