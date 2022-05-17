import type { NextApiRequest, NextApiResponse } from "next";
import bcrypt from "bcryptjs";
import { db } from "../../../database";
import { UserModel } from "../../../models";
import { JWT } from "../../../utils";
import { IUser } from "../../../models/User";

type Data =
  | {
      message: string;
    }
  | {
      token: string;
      user: {
        email: string;
        role: string;
        username: string;
      };
    };

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  switch (req.method) {
    case "POST":
      return login(req, res);

    default:
      return res.status(401).json({ message: "Method not allowed" });
  }
}

const login = async (req: NextApiRequest, res: NextApiResponse<Data>) => {
  const { email = "", password = "" } = req.body;

  await db.connect();
  const user = await UserModel.findOne({ email }).lean();

  if (!user) {
    return res.status(400).json({ message: "Invalid email or password" });
  }

  if (!bcrypt.compareSync(password, user.password)) {
    return res.status(400).json({ message: "Invalid email or password" });
  }

  const { role, username, _id } = user;

  const token = JWT.signToken(_id.toString(), email);

  return res.status(200).json({
    token,
    user: {
      email,
      role,
      username,
    },
  });
};
