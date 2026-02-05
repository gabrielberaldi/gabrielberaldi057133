import { inject, Injectable } from '@angular/core';
import { BehaviorSubject, catchError, finalize, map, Observable, of, shareReplay, switchMap, tap } from 'rxjs';
import { Filters } from '../../../shared/model/filters.model';
import { Router } from '@angular/router';
import { Attachment } from '../../../shared/model/attachment.model';
import { TutorRequest } from '../models/tutor-request.model';
import { Tutor } from '../models/tutor.model';
import { TutorsService } from '../services/tutors.service';
import { ToastService } from '../../../shared/components/toast/services/toast.service';

@Injectable({
  providedIn: 'root'
})
export class TutorsFacade {

  private readonly tutorsService = inject(TutorsService);
  private readonly router = inject(Router);
  private readonly toastService = inject(ToastService);

  private readonly _filters$ = new BehaviorSubject<Filters>({ page: 0, size: 10 });
  private readonly _loading$ = new BehaviorSubject<boolean>(false);
  private readonly _tutor$ = new BehaviorSubject<Tutor | undefined>(undefined);

  readonly loading$ = this._loading$.asObservable();
  readonly tutor$ = this._tutor$.asObservable();

  readonly tutorsList$ = this._filters$.pipe(
    tap(() => this._loading$.next(true)),
    switchMap((filters) => this.tutorsService.getAll(filters).pipe(
      finalize(() => this._loading$.next(false)),
      )
    ),
    shareReplay(1)
  );

  clearTutor(): void {
    this._tutor$.next(undefined);
  }

  changePage(page: number): void {
    this._filters$.next({ ...this._filters$.value, page });
  }

  deleteTutor(tutorId: number, isOnListPage: boolean = false): Observable<void> {
    return this.tutorsService.delete(tutorId).pipe(
      tap(() => {
        if (isOnListPage) this._filters$.next({ ...this._filters$.getValue() })
        this.toastService.show({ message: 'Tutor excluido com sucesso', type: 'success' });
        this.router.navigate(['/shell/tutors/list'])
      })
    )
  }

  get currentTutorSnapshot(): Tutor | undefined {
    return this._tutor$.getValue();
  }

  loadTutor(id: number): Observable<Tutor> {
    this._loading$.next(true);
    return this.tutorsService.getById(id).pipe(
      tap(tutor => this._tutor$.next(tutor)),
      finalize(() => this._loading$.next(false))
    )
  }

  linkPet(tutorId: number, petId: number): Observable<Tutor> {
    this._loading$.next(true);
    return this.tutorsService.linkPet(tutorId, petId).pipe(
      switchMap(() => this.tutorsService.getById(tutorId)),
      tap((updatedTutor) => {
        this.toastService.show({ message: 'Pet vinculado com sucesso', type: 'success' });
        this._tutor$.next(updatedTutor)
      }),
      finalize(() => this._loading$.next(false))
    )
  }

  unlinkPet(tutorId: number, petId: number): Observable<void> {
    this._loading$.next(true);
    return this.tutorsService.unlinkPet(tutorId, petId).pipe(
      tap(() => {
        this.toastService.show({ message: 'Pet desvinculado com sucesso', type: 'success' });
        const currentTutor = structuredClone(this._tutor$.getValue());
        if (currentTutor && currentTutor.pets) {
          const filteredPets = currentTutor.pets.filter(({ id }) => id !== petId);
          this._tutor$.next({ ...currentTutor, pets: filteredPets });
        }
      }),
      finalize(() => this._loading$.next(false))
    )
  }

  uploadAttachment(tutorId: number, file: File): Observable<Attachment> {
    this._loading$.next(true);
    return this.tutorsService.uploadAttachment(tutorId, file).pipe(
      tap((foto) => {
        this.toastService.show({ message: 'Upload de foto feito com sucesso', type: 'success' });
        const currentTutor = this._tutor$.getValue();
        if (currentTutor) {
          const updatedTutor: Tutor = { ...currentTutor, foto };
          this._tutor$.next(updatedTutor);
        }
      }),
      finalize(() => this._loading$.next(false))
    );
  }

  removeAttachment(tutorId: number, photoId: number): Observable<void> {
    this._loading$.next(true);
    return this.tutorsService.removeAttachment(tutorId, photoId).pipe(
      tap(() => {
        const currentTutor = this._tutor$.getValue();
        if (currentTutor) {
          this.toastService.show({ message: 'Foto removida com sucesso', type: 'success' });
          const updatedTutor: Tutor = { ...currentTutor, foto: null };
          this._tutor$.next(updatedTutor);
        }
      }),
      finalize(() => this._loading$.next(false))
    );
  }

  search(nome: string): void {
    this._filters$.next({ ...this._filters$.value, nome, page: 0 });
  }

  store(tutorRequest: TutorRequest, pendingPhoto: File | null): Observable<Tutor> {
    this._loading$.next(true);
    const request$ = this.request(tutorRequest);
    return request$.pipe(
      switchMap((savedTutor) => {
        if (pendingPhoto) {
          return this.tutorsService.uploadAttachment(savedTutor.id!, pendingPhoto).pipe(
            map((photo) => ({ ...savedTutor, photo })),
            catchError(() => of(savedTutor))
          )
        };
        return of(savedTutor);
      }),
      tap((savedTutor) => {
        this.toastService.show({ message: `Tutor ${tutorRequest.id? 'atualizado' : 'cadastrado'} com sucesso`, type: 'success' });
        const currentTutor = this._tutor$.getValue();
        this._tutor$.next({ ...currentTutor, ...savedTutor });
        if (!tutorRequest.id) this.router.navigate([`/shell/tutors/edit/${savedTutor.id}`], { replaceUrl: true })
      }),
      finalize(() => this._loading$.next(false))
    )
  }

  private request(tutorRequest: TutorRequest): Observable<Tutor> {
    return !!tutorRequest.id ? this.tutorsService.update(tutorRequest) : this.tutorsService.create(tutorRequest);
  }
}
