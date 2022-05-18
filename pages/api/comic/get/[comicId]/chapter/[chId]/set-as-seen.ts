import type { NextApiRequest, NextApiResponse } from "next";
import { JWT } from "../../../../../../../utils";
import { db } from "../../../../../../../database";
import { ComicModel, UserModel } from "../../../../../../../models";
import { ComicMin } from "../../../../../../../interfaces";

type Data =
  | {
      message: string;
    }
  | {
      comicsFollowing: ComicMin[];
    };

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  switch (req.method) {
    case "GET":
      return setAsSeen(req, res);

    default:
      return res.status(401).json({ message: "Method not allowed" });
  }
}

const setAsSeen = async (req: NextApiRequest, res: NextApiResponse<Data>) => {
  const { token } = req.cookies;

  const { comicId, chId } = req.query;

  let userId;
  try {
    userId = await JWT.isValidToken(token);
  } catch (error) {
    return res.status(401).json({ message: "Invalid token" });
  }

  await db.connect();
  const user = await UserModel.findById(userId);

  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  const comic = await ComicModel.findById(comicId);

  if (!comic) {
    return res.status(404).json({ message: "Comic not found" });
  }

  const chapter = comic.chapters.find(
    (chapter) => chapter._id!.toString() === chId
  );

  if (!chapter) {
    return res.status(404).json({ message: "Chapter not found" });
  }

  let index = user.comicsFollowing.findIndex(
    (followed) => followed._id.toString() === comic._id.toString()
  );

  if (index === -1) {
    user.comicsFollowing.push({
      _id: comic._id,
      name: comic.name,
      chaptersRead: [],
    });
    index = user.comicsFollowing.length - 1;
  }

  const chIndex = user.comicsFollowing[index].chaptersRead!.findIndex(
    (chRead) => chRead._id.toString() === chapter._id!.toString()
  );

  if (chIndex !== -1) {
    return res.status(400).json({ message: "Chapter already followed" });
  }

  user.comicsFollowing[index].chaptersRead!.push({
    _id: chapter._id!.toString(),
    language: chapter.language,
    name: chapter.name,
  });

  await user.save();

  return res.status(200).json({ comicsFollowing: user.comicsFollowing });
};
