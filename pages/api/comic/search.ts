import ComicModel, { IComic } from "./../../../models/Comic";
import { db } from "../../../database";
import type { NextApiRequest, NextApiResponse } from "next";

type Data = { message: string } | IComic[] | IComic;

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  switch (req.method) {
    case "POST":
      return searchComics(req, res);

    default:
      return res.status(401).json({
        message: "Method not allowed",
      });
  }
}

const searchComics = async (
  req: NextApiRequest,
  res: NextApiResponse<Data>
) => {
  await db.connect();

  const { tag, searchText } = req.body;

  console.log(tag, searchText);
  console.log(req.body);

  if (!tag && !searchText) {
    const entries = await ComicModel.find().limit(20);
    return res.status(200).json(entries);
  }

  if (tag && searchText) {
    const regex = new RegExp(searchText, "i");
    const entries = await ComicModel.find({
      name: { $regex: regex },
      tags: tag,
    }).limit(20);
    return res.status(200).json(entries);
  } else if (tag) {
    const entries = await ComicModel.find({ tags: tag }).limit(20);
    return res.status(200).json(entries);
  } else if (searchText) {
    const regex = new RegExp(searchText, "i");
    const entries = await ComicModel.find({
      name: { $regex: regex },
    }).limit(20);
    return res.status(200).json(entries);
  }
};
