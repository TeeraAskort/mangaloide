import { IUser } from "./../../../../models/User";
import type { NextApiRequest, NextApiResponse } from "next";
import { db } from "../../../../database";
import { UserModel } from "../../../../models";

type Data =
  | {
      message: string;
    }
  | IUser;

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  switch (req.method) {
    case "GET":
      return fetchUser(req, res);

    default:
      return res.status(400).json({ message: "Method not allowed" });
  }
}

const fetchUser = async (req: NextApiRequest, res: NextApiResponse<Data>) => {
  const { id } = req.query;

  await db.connect();

  const user = await UserModel.findById(id)
    .select("username email uploadedComics comicsFollowing")
    .lean();

  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  return res.status(200).json(user);
};
