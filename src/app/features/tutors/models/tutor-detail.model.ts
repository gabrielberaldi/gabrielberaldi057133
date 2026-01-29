import { Pet } from "../../pets/models/pet.model";
import { Tutor } from "./tutor.model";

export interface TutorDetail extends Tutor {
  pets: Pet[];
}