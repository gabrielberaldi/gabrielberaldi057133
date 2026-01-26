import { Component, inject, Input } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { NavbarComponent } from '../navbar/navbar.component';
import { AuthFacade } from '../../../auth/facades/auth.facade';
import { MenuItem } from '../../../configs/menu-config';
import { LucideAngularModule } from 'lucide-angular';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [LucideAngularModule, NavbarComponent, RouterOutlet, RouterLink, RouterLinkActive],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.scss'
})
export class SidebarComponent {

  @Input({ required: true }) menuItems!: MenuItem[];

  private readonly authFacade = inject(AuthFacade);
  
  onLogout(): void {
    this.authFacade.logout();
  }

}
