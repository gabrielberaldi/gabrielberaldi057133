import { Attachment } from "../../../shared/model/file.model";

export interface Pet {
  id?: number | null;
  nome: string;
  raca: string;
  idade: number;
  foto: Attachment | null;
}