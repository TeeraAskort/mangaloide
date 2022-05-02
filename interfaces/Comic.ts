import { Chapter } from "./";
import { Tag } from "./Tag";

export interface Comic {
  _id: string;
  name: string;
  description: string;
  author: string;
  chapters: Chapter[];
  nsfw: boolean;
  tags: string[];
}
