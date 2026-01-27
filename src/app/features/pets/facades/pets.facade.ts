import { inject, Injectable } from '@angular/core';
import { PetsService } from '../services/pets.service';
import { BehaviorSubject, finalize, Observable, shareReplay, switchMap, tap } from 'rxjs';
import { Filters } from '../../../shared/model/filters.model';

@Injectable({
  providedIn: 'root'
})
export class PetsFacade {

  private readonly petsService = inject(PetsService);

  private readonly _filters$ = new BehaviorSubject<Filters>({ page: 0, size: 10 });
  private readonly _loading$ = new BehaviorSubject<boolean>(false);

  readonly loading$ = this._loading$.asObservable();

  readonly petsList$ = this._filters$.pipe(
    tap(() => this._loading$.next(true)),
    switchMap((filters) => this.petsService.getAll(filters)),
    finalize(() => this._loading$.next(false)),
    shareReplay(1)
  );

  changePage(page: number): void {
    this._filters$.next({ ...this._filters$.value, page });
  }

  search(nome: string): void {
    this._filters$.next({ ...this._filters$.value, nome, page: 0 });
  }

}
