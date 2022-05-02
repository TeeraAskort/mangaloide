import { IComic } from "./../../../../../models/Comic";
import type { NextApiRequest, NextApiResponse } from "next";
import { db } from "../../../../../database";
import { ComicModel } from "../../../../../models";

type Data =
  | {
      message: string;
    }
  | IComic;

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  switch (req.method) {
    case "PUT":
      return putComic(req, res);

    case "GET":
      return getComic(req, res);

    case "DELETE":
      return deleteComic(req, res);

    default:
      res.status(401).json({ message: "Method not allowed" });
      break;
  }
}

const putComic = async (req: NextApiRequest, res: NextApiResponse<Data>) => {
  const { comicId } = req.query;

  await db.connect();

  const comicToUpdate = await ComicModel.findById(comicId);

  if (!comicToUpdate) {
    return res
      .status(404)
      .json({ message: "No comic found with id " + comicId });
  }

  const {
    name = comicToUpdate.name,
    author = comicToUpdate.author,
    description = comicToUpdate.description,
  } = req.body;

  try {
    const updatedComic = await ComicModel.findByIdAndUpdate(
      comicId,
      {
        name,
        description,
        author,
      },
      {
        runValidators: true,
        new: true,
      }
    );

    return res.status(200).json(updatedComic!);
  } catch (error: any) {
    console.log(error);

    return res.status(400).json({ message: error.errors.status.message });
  }
};

const getComic = async (req: NextApiRequest, res: NextApiResponse<Data>) => {
  const { comicId } = req.query;

  await db.connect();

  const comic = await ComicModel.findById(comicId);

  if (!comic) {
    return res.status(404).json({ message: "Comic not found: " + comicId });
  }

  return res.status(200).json(comic);
};

const deleteComic = async (req: NextApiRequest, res: NextApiResponse<Data>) => {
  const { comicId } = req.query;

  await db.connect();

  const comic = await ComicModel.findById(comicId);

  if (!comic) {
    return res
      .status(404)
      .json({ message: "Comic not found with id " + comicId });
  }

  await ComicModel.findByIdAndDelete(comicId);

  return res.status(200).json({ message: `Comic with id ${comicId} deleted` });
};
