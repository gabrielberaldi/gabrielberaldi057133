import { Injectable } from '@angular/core';
import { PanelRightCloseIcon, PanelRightOpenIcon } from 'lucide-angular';
import { BehaviorSubject, map } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LayoutFacade {

  private readonly _isSidebarOpen$ = new BehaviorSubject<boolean>(true);
  readonly isSidebarOpen$ = this._isSidebarOpen$.asObservable();
  
  readonly sidebarIcon$ = this.isSidebarOpen$.pipe(
    map(isOpen => isOpen ? PanelRightCloseIcon : PanelRightOpenIcon)
  );

  toggleSidebar(): void { 
    this._isSidebarOpen$.next(!this._isSidebarOpen$.getValue());
  }
  
}
