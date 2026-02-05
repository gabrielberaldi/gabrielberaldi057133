import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Tutor } from '../../models/tutor.model';
import { ChevronRight, LucideAngularModule, Mail, Phone, UserRound } from 'lucide-angular';
import { ProfileCardComponent } from '../../../../shared/components/profile-card/profile-card.component';
import { PhonePipe } from '../../../../shared/pipes/phone.pipe';

@Component({
  selector: 'app-tutor-card',
  standalone: true,
  imports: [LucideAngularModule, PhonePipe, ProfileCardComponent],
  templateUrl: './tutor-card.component.html',
  styleUrl: './tutor-card.component.scss'
})
export class TutorCardComponent {

  @Input({ required: true }) tutor!: Tutor;
  @Output() viewDetails = new EventEmitter<number>();

  protected readonly ChevronRight = ChevronRight;
  protected readonly Mail = Mail;
  protected readonly Phone = Phone;
  protected readonly UserRound = UserRound;

  protected onDetail(): void {
    if (!this.tutor.id) return;
    this.viewDetails.emit(this.tutor.id);
  }

}
