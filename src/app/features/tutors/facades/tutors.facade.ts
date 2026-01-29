import { inject, Injectable } from '@angular/core';
import { BehaviorSubject, finalize, Observable, shareReplay, switchMap, tap } from 'rxjs';
import { Filters } from '../../../shared/model/filters.model';
import { Router } from '@angular/router';
import { Attachment } from '../../../shared/model/attachment.model';
import { TutorRequest } from '../models/tutor-request.model';
import { Tutor } from '../models/tutor.model';
import { TutorsService } from '../services/tutors.service';

@Injectable({
  providedIn: 'root'
})
export class TutorsFacade {

  private readonly tutorsService = inject(TutorsService);
  private readonly router = inject(Router);

  private readonly _filters$ = new BehaviorSubject<Filters>({ page: 0, size: 10 });
  private readonly _loading$ = new BehaviorSubject<boolean>(false);
  private readonly _tutors$ = new BehaviorSubject<Tutor | undefined>(undefined);

  readonly loading$ = this._loading$.asObservable();
  readonly tutors$ = this._tutors$.asObservable();

  readonly tutorsList$ = this._filters$.pipe(
    tap(() => this._loading$.next(true)),
    switchMap((filters) => this.tutorsService.getAll(filters).pipe(
      tap(a => console.log('a')),
      finalize(() => this._loading$.next(false)),
      )
    ),
    shareReplay(1)
  );

  clearTutor(): void {
    this._tutors$.next(undefined);
  }

  changePage(page: number): void {
    this._filters$.next({ ...this._filters$.value, page });
  }

  deleteTutor(tutorId: number): Observable<void> {
    return this.tutorsService.delete(tutorId).pipe(
      tap(() => this.router.navigate(['/shell/tutors/list']))
    )
  }

  get currentTutorSnapshot(): Tutor | undefined {
    return this._tutors$.getValue();
  }

  loadTutor(id: number): Observable<Tutor> {
    this._loading$.next(true);
    return this.tutorsService.getById(id).pipe(
      tap(tutor => this._tutors$.next(tutor)),
      finalize(() => this._loading$.next(false))
    )
  }

  uploadAttachment(tutorId: number, file: File): Observable<Attachment> {
    this._loading$.next(true);
    return this.tutorsService.uploadAttachment(tutorId, file).pipe(
      tap((foto) => {
        const currentTutor = this._tutors$.getValue();
        if (currentTutor) {
          const updatedTutor: Tutor = { ...currentTutor, foto };
          this._tutors$.next(updatedTutor);
        }
      }),
      finalize(() => this._loading$.next(false))
    );
  }

  removeAttachment(tutorId: number, photoId: number): Observable<void> {
    this._loading$.next(true);
    return this.tutorsService.removeAttachment(tutorId, photoId).pipe(
      tap(() => {
        const currentTutor = this._tutors$.getValue();
        if (currentTutor) {
          const updatedTutor: Tutor = { ...currentTutor, foto: null };
          this._tutors$.next(updatedTutor);
        }
      }),
      finalize(() => this._loading$.next(false))
    );
  }

  search(nome: string): void {
    this._filters$.next({ ...this._filters$.value, nome, page: 0 });
  }

  store(tutorRequest: TutorRequest): Observable<Tutor> {
    this._loading$.next(true);
    const request$ = this.request(tutorRequest);
    return request$.pipe(
      tap(savedTutor => { 
        this._tutors$.next(savedTutor);
        if (!tutorRequest.id) this.router.navigate([`/shell/tutors/edit/${savedTutor.id}`])
      }),
      finalize(() => this._loading$.next(false))
    )
  }

  private request(tutorRequest: TutorRequest): Observable<Tutor> {
    return !!tutorRequest.id ? this.tutorsService.update(tutorRequest) : this.tutorsService.create(tutorRequest);
  }
}
