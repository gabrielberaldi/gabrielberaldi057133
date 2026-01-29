import { Tutor } from "./tutor.model";

export type TutorRequest = Omit<Tutor, 'foto'>;