import type { NextApiRequest, NextApiResponse } from "next";
import { JWT } from "../../../../../utils";
import { db } from "../../../../../database";
import { UserModel } from "../../../../../models";
import bcrypt from "bcryptjs";

type Data =
  | {
      message: string;
    }
  | {
      ok: boolean;
    };

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  switch (req.method) {
    case "POST":
      return changePassword(req, res);

    default:
      return res.status(400).json({ message: "Method not allowed" });
  }
}

const changePassword = async (
  req: NextApiRequest,
  res: NextApiResponse<Data>
) => {
  const { token } = req.cookies;
  const { id } = req.query;

  const { lastPassword, newPassword, newPasswordRepeat } = req.body;

  let tokenId;

  try {
    tokenId = await JWT.isValidToken(token);
  } catch (error) {
    return res.status(401).json({ message: "Invalid token" });
  }

  if (tokenId !== id) {
    return res
      .status(401)
      .json({ message: "Trying to modify another user, access denied" });
  }

  await db.connect();
  const user = await UserModel.findById(id);

  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  if (newPassword !== newPasswordRepeat) {
    return res.status(400).json({ message: "Passwords don't match" });
  }

  if (!bcrypt.compareSync(lastPassword, user.password)) {
    return res
      .status(400)
      .json({ message: "You have to enter your last password" });
  }

  user.password = bcrypt.hashSync(newPassword);

  user.save();

  return res.status(200).json({ ok: true });
};
