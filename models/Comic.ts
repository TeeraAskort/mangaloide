import { Chapter } from "./../interfaces/Chapter";
import { Comic } from "../interfaces";
import mongoose, { Model, Schema, Types } from "mongoose";

export interface IComic extends Comic {}

const comicSchema = new Schema<IComic>({
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  author: {
    type: String,
    required: true,
  },
  nsfw: {
    type: Boolean,
    required: true,
  },
  chapters: [
    {
      name: String,
      pages: {
        type: Number,
        required: true,
      },
      chNumber: {
        type: Number,
        required: true,
      },
      language: {
        type: String,
        required: true,
        enum: ["EN", "ES", "CAT", "VA"],
        message: "{VALUE} is not permitted as a language",
      },
    },
  ],
});

const ComicModel: Model<IComic> =
  mongoose.models.Comic || mongoose.model("Comic", comicSchema);

export default ComicModel;
