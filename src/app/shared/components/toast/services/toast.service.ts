import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { ToastConfig } from '../models/toast-config.model';

@Injectable({
  providedIn: 'root'
})
export class ToastService {

  private readonly _toasts$ = new BehaviorSubject<ToastConfig[]>([]);
  readonly toasts$ = this._toasts$.asObservable();

  show({ message, type, expirationTimer = 5000 }: Omit<ToastConfig, 'id'>): void {
    const id = Date.now();
    const newToast: ToastConfig = { id, message, type, expirationTimer };
    const currentToasts = this._toasts$.getValue();
    this._toasts$.next([...currentToasts, newToast]);
    setTimeout(() => this.remove(id), expirationTimer);
  }

  remove(id: number): void {
    const currentToasts = this._toasts$.getValue();
    this._toasts$.next(currentToasts.filter(t => t.id !== id));
  }

}
