import { NextRouter, useRouter } from "next/router";
import type { NextApiRequest, NextApiResponse } from "next";
import { db } from "../../../../../database";
import { ComicModel } from "../../../../../models";
import fs from "fs";

type Data =
  | {
      message: string;
    }
  | File;

export default function Handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  switch (req.method) {
    case "GET":
      return getImage(req, res);

    default:
      return res.status(401).json({ message: "Method not allowed" });
  }
}

const getImage = async (req: NextApiRequest, res: NextApiResponse<Data>) => {
  try {
    const { comicId } = req.query;

    await db.connect();

    const comic = await ComicModel.findById(comicId);

    if (!comic) {
      return res.status(404).json({ message: "Comic not found" });
    }

    const imagePath = `${process.env.COMICS_PATH}/${comic!._id}/image.jpg`;

    const stat = fs.statSync(imagePath);

    res.writeHead(200, {
      "Content-Type": "image/jpeg",
      "Content-Length": stat.size,
    });

    const readStream = fs.createReadStream(imagePath);
    readStream.pipe(res);
  } catch (error) {
    console.log(error);
    return res.status(404).json({ message: "Image not found" });
  }
};
