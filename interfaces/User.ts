import { ComicMin } from "./ComicMin";

export interface User {
  _id: string;
  username: string;
  email: string;
  password: string;
  role: "admin" | "user";
  uploadedComics: ComicMin[];
  comicsFollowing: ComicMin[];
}
