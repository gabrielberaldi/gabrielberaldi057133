import { ToastType } from "./toast-type.model";

export interface ToastConfig {
  id: number;
  message: string;
  type: ToastType;
  expirationTimer?: number;
}