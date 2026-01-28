import { Pet } from "./pet.model";

export type PetRequest = Omit<Pet, 'foto'>;