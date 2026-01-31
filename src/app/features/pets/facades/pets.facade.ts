import { inject, Injectable } from '@angular/core';
import { PetsService } from '../services/pets.service';
import { BehaviorSubject, catchError, finalize, map, Observable, of, shareReplay, switchMap, tap } from 'rxjs';
import { Filters } from '../../../shared/model/filters.model';
import { PetRequest } from '../models/pet-request.model';
import { Pet } from '../models/pet.model';
import { Router } from '@angular/router';
import { Attachment } from '../../../shared/model/attachment.model';
import { ToastService } from '../../../shared/components/toast/services/toast.service';

@Injectable({
  providedIn: 'root'
})
export class PetsFacade {

  private readonly petsService = inject(PetsService);
  private readonly router = inject(Router);
  private readonly toastService = inject(ToastService);

  private readonly _filters$ = new BehaviorSubject<Filters>({ page: 0, size: 10 });
  private readonly _loading$ = new BehaviorSubject<boolean>(false);
  private readonly _pet$ = new BehaviorSubject<Pet | undefined>(undefined);

  readonly loading$ = this._loading$.asObservable();
  readonly pet$ = this._pet$.asObservable();

  readonly petsList$ = this._filters$.pipe(
    tap(() => this._loading$.next(true)),
    switchMap((filters) => this.petsService.getAll(filters).pipe(
      finalize(() => this._loading$.next(false)),
      )
    ),
    shareReplay(1)
  );

  clearPet(): void {
    this._pet$.next(undefined);
  }

  changePage(page: number): void {
    this._filters$.next({ ...this._filters$.value, page });
  }

  deletePet(petId: number): Observable<void> {
    return this.petsService.delete(petId).pipe(
      tap(() => {
        this.toastService.show({ message: 'Pet excluido com sucesso', type: 'success' });
        this.router.navigate(['/shell/pets/list']);
      })
    )
  }

  get currentPetSnapshot(): Pet | undefined {
    return this._pet$.getValue();
  }

  loadPet(id: number): Observable<Pet> {
    this._loading$.next(true);
    return this.petsService.getById(id).pipe(
      tap(pet => this._pet$.next(pet)),
      finalize(() => this._loading$.next(false))
    )
  }

  uploadAttachment(petId: number, file: File): Observable<Attachment> {
    this._loading$.next(true);
    return this.petsService.uploadAttachment(petId, file).pipe(
      tap((foto) => {
        this.toastService.show({ message: 'Upload de foto feito com sucesso', type: 'success' });
        const currentPet = this._pet$.getValue();
        if (currentPet) {
          const updatedPet: Pet = { ...currentPet, foto };
          this._pet$.next(updatedPet);
        }
      }),
      finalize(() => this._loading$.next(false))
    );
  }

  removeAttachment(petId: number, photoId: number): Observable<void> {
    this._loading$.next(true);
    return this.petsService.removeAttachment(petId, photoId).pipe(
      tap(() => {
        const currentPet = this._pet$.getValue();
        if (currentPet) {
          this.toastService.show({ message: 'Foto removida com sucesso', type: 'success' });
          const updatedPet: Pet = { ...currentPet, foto: null };
          this._pet$.next(updatedPet);
        }
      }),
      finalize(() => this._loading$.next(false))
    );
  }

  search(nome: string): void {
    this._filters$.next({ ...this._filters$.value, nome, page: 0 });
  }

  store(petRequest: PetRequest, pendingPhoto: File | null): Observable<Pet> {
    this._loading$.next(true);
    const request$ = this.request(petRequest);
    return request$.pipe(
      switchMap((savedPet) => {
        if (pendingPhoto) {
          return this.petsService.uploadAttachment(savedPet.id!, pendingPhoto).pipe(
            map((photo) => ({ ...savedPet, photo })),
            catchError(() => of(savedPet))
          )
        };
        return of(savedPet);
      }),
      tap((savedPet) => {
        this.toastService.show({ message: `Pet ${petRequest.id? 'atualizado' : 'cadastrado'} com sucesso`, type: 'success' });
        const currentPet = this._pet$.getValue();
        this._pet$.next({ ...currentPet, ...savedPet });
        if (!petRequest.id) this.router.navigate([`/shell/pets/edit/${savedPet.id}`])
      }),
      finalize(() => this._loading$.next(false))
    )
  }

  private request(petRequest: PetRequest): Observable<Pet> {
    return !!petRequest.id ? this.petsService.update(petRequest) : this.petsService.create(petRequest);
  }

}
