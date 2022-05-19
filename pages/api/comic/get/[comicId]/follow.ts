import type { NextApiRequest, NextApiResponse } from "next";
import { db } from "../../../../../database";
import { ComicMin } from "../../../../../interfaces";
import { UserModel, ComicModel } from "../../../../../models";
import { JWT } from "../../../../../utils";

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
      return followComic(req, res);

    default:
      return res.status(401).json({ message: "Method not allowed" });
  }
}

const followComic = async (req: NextApiRequest, res: NextApiResponse<Data>) => {
  const { token } = req.cookies;
  const { comicId } = req.query;

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

  const index = user.comicsFollowing.findIndex(
    (comic) => comic._id.toString() === comicId
  );

  if (index !== -1) {
    return res
      .status(400)
      .json({ message: "You're already following the comic" });
  }

  const comic = await ComicModel.findById(comicId).lean();

  if (!comic) {
    return res.status(404).json({ message: "Comic not found" });
  }

  user.comicsFollowing.push({
    _id: comic._id.toString(),
    name: comic.name,
    chaptersRead: [],
  });

  await user.save();

  return res.status(200).json({ comicsFollowing: user.comicsFollowing });
};
