import { Attachment } from "../../../shared/model/attachment.model";
import { Tutor } from "../../tutors/models/tutor.model";

export interface Pet {
  id?: number | null;
  nome: string;
  raca: string;
  idade: number;
  foto: Attachment | null;
  tutores?: Tutor[];
}