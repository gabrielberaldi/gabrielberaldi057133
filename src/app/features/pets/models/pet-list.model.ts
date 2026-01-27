import { Pet } from "./pet.model";

export interface PetList {
  page: number;
  size: number;
  total: number;
  pageCount: number;
  content: Pet[];
}