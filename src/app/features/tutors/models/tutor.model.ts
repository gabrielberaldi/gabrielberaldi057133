import { Attachment } from "../../../shared/model/attachment.model";
import { Pet } from "../../pets/models/pet.model";

export interface Tutor {
  id?: number | null;
  nome: string;
  telefone: string;
  endereco: string;
  email: string;
  cpf: number;
  foto: Attachment | null;
  pets?: Pet[];
}