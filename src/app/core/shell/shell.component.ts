import { Component } from '@angular/core';
import { SidebarComponent } from './components/sidebar/sidebar.component';
import { MENU_ITEMS } from '../configs/menu-config';


@Component({
  selector: 'app-shell',
  standalone: true,
  imports: [SidebarComponent],
  templateUrl: './shell.component.html',
  styleUrl: './shell.component.scss'
})
export class ShellComponent {

  readonly menuItems = MENU_ITEMS;

}
