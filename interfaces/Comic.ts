import { Chapter } from "./";

export interface Comic {
  _id: string;
  name: string;
  description: string;
  author: string;
  chapters: Chapter[];
}
