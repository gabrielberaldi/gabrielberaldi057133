import { NgClass } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CircleAlert, CircleX, Image, Lock, LucideAngularModule, Trash2, Upload} from 'lucide-angular';

@Component({
  selector: 'app-upload',
  standalone: true,
  imports: [ LucideAngularModule, NgClass ],
  templateUrl: './upload.component.html',
  styleUrl: './upload.component.scss'
})
export class UploadComponent {

  @Input() currentPhotoUrl: string | null | undefined = null;
  @Input() disabled: boolean = false;
  @Input() disabledMessage: string = '';
  @Input() isUploading: boolean | null = false;

  @Output() fileChange = new EventEmitter<File>();
  @Output() removeRequest = new EventEmitter<void>();

  protected errorMessage: string | null = null;
  protected previewUrl: string | null = null;

  private readonly MAX_SIZE_BYTES = 10 * 1024 * 1024;
  private readonly ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/jpg'];

  protected readonly CircleAlert = CircleAlert;
  protected readonly CircleX = CircleX;
  protected readonly Image = Image;
  protected readonly Lock = Lock;
  protected readonly Upload = Upload;
  protected readonly Trash2 = Trash2;

  protected onFileSelected(event: Event): void {
    if (this.disabled) return;

    const input = event.target as HTMLInputElement;
    if (!input.files?.length) return;

    const file = input.files[0];
    this.errorMessage = null;

    if (!this.isValidFile(file)) {
      input.value = '';
      return;
    }

    this.processFile(file);
    input.value = '';
  }

  protected onRemove(event: Event): void {
    event.stopPropagation();
    this.resetState();
    this.removeRequest.emit();
  }

  protected clearError(): void {
    this.errorMessage = null;
  }

  private isValidFile(file: File): boolean {
    if (!this.ALLOWED_TYPES.includes(file.type)) {
      this.errorMessage = 'Formato inválido. Apenas PNG ou JPG.';
      return false;
    };
    if (file.size > this.MAX_SIZE_BYTES) {
      this.errorMessage = 'Arquivo muito grande (Máx 10MB).';
      return false;
    };
    return true;
  }

  private processFile(file: File): void {
    const reader = new FileReader();
    reader.onload = () => {
      this.previewUrl = reader.result as string;
    };
    reader.readAsDataURL(file);
    this.fileChange.emit(file);
  }

  private resetState(): void {
    this.previewUrl = null;
    this.errorMessage = null;
  }

}
