import { Attachment } from "../../../shared/model/file.model";

export interface Pet {
  id: string;
  nome: string;
  raca: string;
  idade: number;
  foto: Attachment | null;
}