import { Component, inject } from '@angular/core';
import { DialogService } from './services/dialog.service';
import { Info, LucideAngularModule, TriangleAlert } from 'lucide-angular';
import { AsyncPipe, NgClass } from '@angular/common';
import { ButtonComponent } from '../button/button.component';

@Component({
  selector: 'app-dialog',
  standalone: true,
  imports: [AsyncPipe, ButtonComponent, LucideAngularModule, NgClass],
  templateUrl: './dialog.component.html',
  styleUrl: './dialog.component.scss'
})
export class DialogComponent {

  protected readonly dialogService = inject(DialogService);
  protected readonly TriangleAlert = TriangleAlert;
  protected readonly Info = Info;

  protected onAction(confirmed: boolean): void {
    this.dialogService.close(confirmed);
  }

}
