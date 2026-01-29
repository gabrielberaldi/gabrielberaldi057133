import { Tutor } from "./tutor.model";

export interface TutorList {
  page: number;
  size: number;
  total: number;
  pageCount: number;
  content: Tutor[];
}