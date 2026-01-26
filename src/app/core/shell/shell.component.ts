import { Component, inject } from '@angular/core';
import { SidebarComponent } from './components/sidebar/sidebar.component';
import { MENU_ITEMS } from '../configs/menu-config';
import { LayoutFacade } from '../facades/layout.facade';
import { AsyncPipe } from '@angular/common';
import { AuthFacade } from '../auth/facades/auth.facade';
import { LucideAngularModule, PanelRightCloseIcon } from 'lucide-angular';


@Component({
  selector: 'app-shell',
  standalone: true,
  imports: [SidebarComponent, AsyncPipe, LucideAngularModule],
  templateUrl: './shell.component.html',
  styleUrl: './shell.component.scss'
})
export class ShellComponent {

  protected readonly authFacade = inject(AuthFacade);
  protected readonly layoutFacade = inject(LayoutFacade);
  
  protected readonly menuItems = MENU_ITEMS;
  protected readonly PanelRightCloseIcon = PanelRightCloseIcon;
}
