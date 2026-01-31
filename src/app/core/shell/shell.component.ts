import { Component, inject } from '@angular/core';
import { SidebarComponent } from './components/sidebar/sidebar.component';
import { MENU_ITEMS } from '../configs/menu-config';
import { ShellFacade } from '../facades/shell.facade';
import { AsyncPipe } from '@angular/common';
import { AuthFacade } from '../auth/facades/auth.facade';
import { DoorOpen, LucideAngularModule, PanelRightCloseIcon } from 'lucide-angular';
import { DialogComponent } from '../../shared/components/dialog/dialog.component';
import { ButtonComponent } from '../../shared/components/button/button.component';


@Component({
  selector: 'app-shell',
  standalone: true,
  imports: [AsyncPipe, ButtonComponent, DialogComponent, LucideAngularModule, SidebarComponent],
  templateUrl: './shell.component.html',
  styleUrl: './shell.component.scss'
})
export class ShellComponent {

  protected readonly authFacade = inject(AuthFacade);
  protected readonly shellFacade = inject(ShellFacade);
  
  protected readonly menuItems = MENU_ITEMS;
  protected readonly PanelRightCloseIcon = PanelRightCloseIcon;

  protected DoorOpen = DoorOpen;
}
