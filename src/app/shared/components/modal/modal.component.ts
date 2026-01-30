import { NgClass } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-modal',
  standalone: true,
  imports: [NgClass],
  templateUrl: './modal.component.html',
  styleUrl: './modal.component.scss'
})
export class ModalComponent {

  @Input({ required: true }) isOpen = false;
  @Input() customClass = 'max-w-md';
  
  @Output() close = new EventEmitter<void>();

}
