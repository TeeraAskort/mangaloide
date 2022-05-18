import type { NextApiRequest, NextApiResponse } from "next";
import { db } from "../../../../../database";
import { UserModel } from "../../../../../models";
import fs, { ReadStream, StatsBase } from "fs";

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
      return getUserImage(req, res);

    default:
      return res.status(400).json({ message: "Method not allowed" });
  }
}

const getUserImage = async (
  req: NextApiRequest,
  res: NextApiResponse<Data>
) => {
  try {
    const { id } = req.query;

    await db.connect();

    const user = await UserModel.findById(id).select("_id username").lean();

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const imagePath = `${process.env.USERIMG_PATH}/${user.username}/image.jpg`;

    let stat: StatsBase<number>;
    let readStream: ReadStream;

    if (!fs.existsSync(imagePath)) {
      stat = fs.statSync(`${process.env.USERIMG_PATH}/default.jpg`);
      readStream = fs.createReadStream(
        `${process.env.USERIMG_PATH}/default.jpg`
      );
    } else {
      stat = fs.statSync(imagePath);
      readStream = fs.createReadStream(imagePath);
    }

    res.writeHead(200, {
      "Content-Type": "image/jpeg",
      "Content-Length": stat.size,
    });

    readStream.pipe(res);
  } catch (error) {
    console.log(error);
    return res.status(404).json({ message: "Image not found" });
  }
};
