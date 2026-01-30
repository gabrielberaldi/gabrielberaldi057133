import { Component, inject } from '@angular/core';
import { ToastService } from './services/toast.service';
import { AsyncPipe, NgClass } from '@angular/common';
import { ToastType } from './models/toast-type.model';
import { CircleCheckBig, CircleX, Info, LucideAngularModule, TriangleAlert } from 'lucide-angular';

@Component({
  selector: 'app-toast',
  standalone: true,
  imports: [ AsyncPipe, LucideAngularModule, NgClass ],
  templateUrl: './toast.component.html',
  styleUrl: './toast.component.scss'
})
export class ToastComponent {

  protected readonly toastService = inject(ToastService);

  protected readonly styles: Record<ToastType, { class: string; icon: any }> = {
    success: { class: 'alert-success', icon: CircleCheckBig },
    error: { class: 'alert-error', icon: CircleX },
    info: { class: 'alert-info', icon: Info },
    warning: { class: 'alert-warning', icon: TriangleAlert }
  };

}
