import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { DialogData } from '../models/dialog-data.model';

@Injectable({
  providedIn: 'root'
})
export class DialogService {

  private readonly _data$ = new BehaviorSubject<DialogData | null>(null);
  readonly data$ = this._data$.asObservable();

  private _currentDialogResolver$ = new Subject<boolean>();

   close(result: boolean): void {
    if (this._data$.value) {
      this._currentDialogResolver$.next(result);
      this._currentDialogResolver$.complete();
      this._data$.next(null);
    }
  }

  open(data: DialogData): Observable<boolean> {
    this.close(false); 
    this._currentDialogResolver$ = new Subject<boolean>();
    this._data$.next(data);
    return this._currentDialogResolver$.asObservable();
  }
 
}

