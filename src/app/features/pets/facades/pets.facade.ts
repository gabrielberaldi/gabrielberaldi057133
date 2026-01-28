import { inject, Injectable } from '@angular/core';
import { PetsService } from '../services/pets.service';
import { BehaviorSubject, finalize, Observable, shareReplay, switchMap, tap } from 'rxjs';
import { Filters } from '../../../shared/model/filters.model';
import { PetRequest } from '../models/pet-request.model';
import { Pet } from '../models/pet.model';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class PetsFacade {

  private readonly petsService = inject(PetsService);
  private readonly router = inject(Router);

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
      tap(() => this.router.navigate(['/shell/pets/list']))
    )
  }

  loadPet(id: number): Observable<Pet> {
    this._loading$.next(true);
    return this.petsService.getById(id).pipe(
      tap(pet => this._pet$.next(pet)),
      finalize(() => this._loading$.next(false))
    )
  }

  search(nome: string): void {
    this._filters$.next({ ...this._filters$.value, nome, page: 0 });
  }

  store(petRequest: PetRequest): Observable<Pet> {
    this._loading$.next(true);
    const request$ = this.request(petRequest);
    return request$.pipe(
      tap(savedPet => { 
        this._pet$.next(savedPet);
        if (!petRequest.id) this.router.navigate([`/shell/pets/edit/${savedPet.id}`])
      }),
      finalize(() => this._loading$.next(false))
    )
  }

  private request(petRequest: PetRequest): Observable<Pet> {
    return !!petRequest.id ? this.petsService.update(petRequest) : this.petsService.create(petRequest);
  }

}
