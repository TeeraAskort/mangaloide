import type { NextApiRequest, NextApiResponse } from "next";
import { db } from "../../../../../../../database";
import { ComicModel } from "../../../../../../../models";
import fs from "fs";

type Data =
  | {
      message: string;
    }
  | File;

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  switch (req.method) {
    case "GET":
      return getPage(req, res);

    default:
      return res.status(400).json({ message: "Method not allowed" });
  }
}

const getPage = async (req: NextApiRequest, res: NextApiResponse<Data>) => {
  try {
    const { comicId, chId, pgNum } = req.query;

    await db.connect();

    const comic = await ComicModel.findById(comicId);

    if (!comic) {
      return res.status(404).json({ message: "Comic not found" });
    }

    const chapter = comic.chapters.filter(
      (chapter) => chapter._id.toString() === chId
    )[0];

    if (!chapter) {
      return res.status(404).json({ message: "Chapter not found" });
    }

    const imagePath = `${process.env.COMICS_PATH}/${comic.name}/${chapter.chNumber}-${chapter.language}/${pgNum}.jpg`;

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
