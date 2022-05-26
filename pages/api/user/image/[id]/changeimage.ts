import type { NextApiRequest, NextApiResponse } from "next";
import { db } from "../../../../../database";
import formidable from "formidable";
import fs from "fs";
import sharp from "sharp";
import UserModel from "../../../../../models/User";

const mimeTypes = ["image/png", "image/gif", "image/jpeg", "image/jpg"];

export const config = {
  api: {
    bodyParser: false,
  },
};

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
      return changeImage(req, res);

    default:
      return res.status(400).json({ message: "Method not allowed" });
  }
}

const changeImage = (req: NextApiRequest, res: NextApiResponse<Data>) => {
  const form = formidable({
    maxFileSize: 500 * 1024 * 1024,
  });

  form.parse(req, async (err, fields, files: any) => {
    if (err) {
      console.log(err);
      return res.status(500).json({ message: "Backend error" });
    }

    if (files.file) {
      if (!mimeTypes.includes(files.file[0].mimetype)) {
        return res.status(400).json({
          message: "Image type not supported",
        });
      }

      const { id } = req.query;

      await db.connect();

      const user = await UserModel.findById(id).lean();

      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      try {
        const userPath = `${process.env.USERIMG_PATH}/${user.username}`;

        if (!fs.existsSync(userPath)) {
          fs.mkdirSync(userPath);
        }

        const tmpPath = `${process.env.TMP_PATH}/${files.file[0].originalFilename}`;

        fs.copyFileSync(files.file[0].filepath, tmpPath);

        await sharp(tmpPath)
          .resize(256, 256)
          .jpeg({ mozjpeg: true })
          .toFile(`${userPath}/image.jpg`);

        fs.unlinkSync(tmpPath);

        return res.status(200).json({ ok: true });
      } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Backend error" });
      }
    } else {
      return res.status(400).json({ message: "No file was provided" });
    }
  });
};
