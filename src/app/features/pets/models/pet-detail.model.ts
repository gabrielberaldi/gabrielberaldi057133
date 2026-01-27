import { Pet } from "./pet.model";

export interface PetDetail extends Pet {
  //TODO: definir corretamente o tipo de
  tutores: any[];
}