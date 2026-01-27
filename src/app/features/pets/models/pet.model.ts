import { Attachment } from "../../../shared/model/file.model";

export interface Pet {
  id: number;
  nome: string;
  raca: string;
  idade: number;
  foto: Attachment | null;
}