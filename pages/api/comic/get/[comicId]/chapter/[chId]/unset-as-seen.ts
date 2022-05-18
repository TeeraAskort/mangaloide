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

  const comicIndex = user.comicsFollowing.findIndex(
    (comic) => comic._id === comicId
  );

  if (comicIndex === -1) {
    return res.status(404).json({ message: "Comic not being followed" });
  }

  const chIndex = user.comicsFollowing[comicIndex].chaptersRead.findIndex(
    (chapter) => chapter._id.toString() === chId
  );

  if (chIndex === -1) {
    return res.status(404).json({ message: "Chapter not seen" });
  }

  user.comicsFollowing[comicIndex].chaptersRead.splice(chIndex, 1);

  await user.save();

  return res.status(200).json({ comicsFollowing: user.comicsFollowing });
};
