import type { NextApiRequest, NextApiResponse } from "next";
import { db } from "../../../database";
import { ComicMin } from "../../../interfaces";
import { UserModel } from "../../../models";
import { JWT } from "../../../utils";

type Data =
  | {
      message: string;
    }
  | {
      token: string;
      user: {
        email: string;
        username: string;
        role: string;
        comicsFollowing: ComicMin[];
      };
    };

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  switch (req.method) {
    case "GET":
      return validateToken(req, res);

    default:
      return res.status(400).json({ message: "Method not allowed" });
  }
}

const validateToken = async (
  req: NextApiRequest,
  res: NextApiResponse<Data>
) => {
  const { token = "" } = req.cookies;

  let userId = "";

  try {
    userId = await JWT.isValidToken(token);
  } catch (error) {
    return res.status(401).json({ message: "Invalid token" });
  }

  await db.connect();
  const user = await UserModel.findById(userId).lean();

  if (!user) {
    return res.status(404).json({ message: "User doesn't exist" });
  }

  const { _id, email, role, username, comicsFollowing } = user;

  return res.status(200).json({
    token: JWT.signToken(_id.toString(), email), // jwt
    user: {
      email,
      role,
      username,
      comicsFollowing,
    },
  });
};
