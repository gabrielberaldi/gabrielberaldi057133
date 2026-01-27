import { Injectable } from '@angular/core';
import { PanelRightCloseIcon, PanelRightOpenIcon } from 'lucide-angular';
import { BehaviorSubject, map } from 'rxjs';
import { BreadcrumbConfig } from '../models/breadcrumb-config.model';

@Injectable({
  providedIn: 'root'
})
export class ShellFacade {

  private readonly _breadcrumbConfig$ = new BehaviorSubject<BreadcrumbConfig | undefined>(undefined);
  private readonly _isSidebarOpen$ = new BehaviorSubject<boolean>(true);
  
  readonly breadcrumbConfig$ = this._breadcrumbConfig$.asObservable();
  readonly isSidebarOpen$ = this._isSidebarOpen$.asObservable();

  readonly sidebarIcon$ = this.isSidebarOpen$.pipe(
    map(isOpen => isOpen ? PanelRightCloseIcon : PanelRightOpenIcon)
  );

  setBreadCrumbs(config: BreadcrumbConfig): void {
    this._breadcrumbConfig$.next(config);
  }

  toggleSidebar(): void { 
    this._isSidebarOpen$.next(!this._isSidebarOpen$.getValue());
  }

  
}
