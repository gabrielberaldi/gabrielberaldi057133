export interface DialogData {
  confirmText?: string;
  cancelText?: string;
  message: string;
  title: string;
  type?: DialogType;
}

export type DialogType = 'danger' | 'info' | 'success';