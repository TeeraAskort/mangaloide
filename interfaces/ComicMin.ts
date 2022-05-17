import { ChapterMin } from "./ChapterMin";

export interface ComicMin {
  _id: string;
  name: string;
  chaptersRead?: ChapterMin[];
}
