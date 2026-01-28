import { Attachment } from "../../../shared/model/attachment.model";

export interface Pet {
  id?: number | null;
  nome: string;
  raca: string;
  idade: number;
  foto: Attachment | null;
}