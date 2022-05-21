import type { NextApiRequest, NextApiResponse } from "next";
import bcrypt from "bcryptjs";
import { db } from "../../../database";
import { UserModel } from "../../../models";
import { isValidEmail, JWT } from "../../../utils";
import { ComicMin } from "../../../interfaces";

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
    case "POST":
      return register(req, res);

    default:
      return res.status(400).json({ message: "Method not allowed" });
  }
}

const register = async (req: NextApiRequest, res: NextApiResponse<Data>) => {
  const {
    email = "",
    password = "",
    username = "",
  } = req.body as { username: string; email: string; password: string };

  if (password.length < 6) {
    return res
      .status(400)
      .json({ message: "Password should be at least 6 characters long" });
  }

  if (!username || username === "") {
    return res.status(400).json({ message: "You have to enter a username" });
  }

  if (!isValidEmail(email)) {
    return res.status(400).json({ message: "The email is invalid" });
  }

  await db.connect();
  let user = await UserModel.findOne({ email }).select("_id").lean();

  if (user) {
    return res.status(400).json({ message: "The email is already in use" });
  }

  user = await UserModel.findOne({ username }).select("_id").lean();

  if (user) {
    return res.status(400).json({ message: "Username already taken" });
  }

  const newUser = new UserModel({
    email: email.toLocaleLowerCase(),
    password: bcrypt.hashSync(password),
    role: "user",
    username,
  });

  try {
    await newUser.save({ validateBeforeSave: true });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ message: "An error has ocurred on the server" });
  }

  const { _id, role } = newUser;

  const token = JWT.signToken(_id.toString(), email);

  return res.status(200).json({
    token,
    user: {
      email,
      role,
      username,
      comicsFollowing: [],
    },
  });
};
