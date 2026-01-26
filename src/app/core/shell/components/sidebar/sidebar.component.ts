import { Component, EventEmitter, Input, Output } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { MenuItem } from '../../../configs/menu-config';
import { LucideAngularModule, LucideIconData } from 'lucide-angular';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [LucideAngularModule, RouterOutlet, RouterLink, RouterLinkActive],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.scss'
})
export class SidebarComponent {

  @Input({ required: true, transform: (value: boolean | null) => value ?? true }) 
  isSidebarOpen!: boolean;
  @Input({ required: true }) menuItems!: MenuItem[];
  @Input({ required: true }) sidebarIcon!: LucideIconData;

  @Output() logout = new EventEmitter<void>();
  @Output() toggleSidebar = new EventEmitter<void>();

  onClick(): void {
    this.logout.emit();
  }

}
