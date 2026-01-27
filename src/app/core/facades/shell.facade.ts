import { Injectable } from '@angular/core';
import { PanelRightCloseIcon, PanelRightOpenIcon } from 'lucide-angular';
import { BehaviorSubject, map } from 'rxjs';
import { Breadcrumb } from '../models/breadcrumb.model';

@Injectable({
  providedIn: 'root'
})
export class ShellFacade {

  private readonly _isSidebarOpen$ = new BehaviorSubject<boolean>(true);
  readonly isSidebarOpen$ = this._isSidebarOpen$.asObservable();

  private readonly _breadCrumbs$ = new BehaviorSubject<Breadcrumb[]>([]);
  readonly breadCrumbs$ = this._breadCrumbs$.asObservable();

  readonly sidebarIcon$ = this.isSidebarOpen$.pipe(
    map(isOpen => isOpen ? PanelRightCloseIcon : PanelRightOpenIcon)
  );

  toggleSidebar(): void { 
    this._isSidebarOpen$.next(!this._isSidebarOpen$.getValue());
  }

  setBreadCrumbs(breadcrumbs: Breadcrumb[]): void {
    this._breadCrumbs$.next(breadcrumbs);
  }
  
}
