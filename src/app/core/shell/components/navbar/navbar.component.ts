import { Component } from '@angular/core';
import { LucideAngularModule, PanelRightClose } from 'lucide-angular';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [LucideAngularModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss'
})
export class NavbarComponent {

  protected readonly PanelRightCloseIcon = PanelRightClose;

}
