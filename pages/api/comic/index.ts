import { IComic } from "./../../../models/Comic";
import type { NextApiRequest, NextApiResponse } from "next";
import { db } from "../../../database";
import { ComicModel, UserModel } from "../../../models";
import formidable from "formidable";
import fs from "fs";
import Jimp from "jimp";
import { JWT } from "../../../utils";

const mimeTypes = ["image/png", "image/gif", "image/jpeg", "image/jpg"];

type Data =
  | {
      message: string;
    }
  | IComic
  | IComic[];

export const config = {
  api: {
    bodyParser: false,
  },
};

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  switch (req.method) {
    case "GET":
      return getComics(res);

    case "POST":
      return postComic(req, res);

    default:
      return res.status(401).json({ message: "Method not allowed" });
  }
}

const getComics = async (res: NextApiResponse<Data>) => {
  await db.connect();

  const entries = await ComicModel.find().limit(20);

  res.status(200).json(entries);
};

/**
 * Upload data for a new comic
 * @param req Request
 * @param res Response
 */
const postComic = async (req: NextApiRequest, res: NextApiResponse<Data>) => {
  // Use formidable incoming form to process the form data and be able to upload an image for the comic
  const form = formidable({
    maxFileSize: 500 * 1024 * 1024,
  });
  form.parse(req, async (err, fields, files: any) => {
    // If it fails, return a server error
    if (err) {
      console.log(err);
      return res.status(500).json({ message: "Backend error" });
    }

    // Obtain the form data
    const { name, description, author, nsfw, tags } = fields;

    // If the data has been input, create a new entry on the database
    if (name && description && author && files.file && nsfw) {
      if (!mimeTypes.includes(files.file[0].mimetype)) {
        return res.status(400).json({
          message: "Image type not supported",
        });
      }
      try {
        await db.connect();

        const { token } = req.cookies;
        let userId;
        try {
          userId = await JWT.isValidToken(token);
        } catch (error) {
          return res.status(401).json({ message: "You have to be logged in" });
        }
        const user = await UserModel.findById(userId);

        if (!user) {
          return res.status(404).json({ message: "User not found" });
        }

        const comic = await ComicModel.find({ name });

        if (comic.length !== 0) {
          return res.status(400).json({ message: "Comic already exists" });
        }

        // Copy the image to the tmp folder
        fs.copyFileSync(
          files.file[0].filepath,
          `${process.env.TMP_PATH}/${files.file[0].originalFilename}`
        );

        // Declare the path for the new comic folder
        const comicPath = `${process.env.COMICS_PATH}/${name}`;

        // If it doesn't exist create it
        if (!fs.existsSync(comicPath)) {
          fs.mkdirSync(comicPath);
        }

        // Convert the image to jpeg and resize it with Jimp
        Jimp.read(`${process.env.TMP_PATH}/${files.file[0].originalFilename}`)
          .then((image) => {
            return image
              .quality(80)
              .resize(366, 512)
              .write(`${comicPath}/image.jpg`);
          })
          .catch((err) => {
            console.log(err);
          });

        // Delete temporary image
        fs.unlinkSync(
          `${process.env.TMP_PATH}/${files.file[0].originalFilename}`
        );

        if (tags.length === 0) {
          return res.status(400).json({
            message: "You need to add tags to the comic",
          });
        }

        console.log(tags);

        const newComic = new ComicModel({
          name: name[0],
          description: description[0],
          author: author[0],
          nsfw: nsfw[0] === "true" ? true : false,
          tags: tags[0].split(","),
        });

        await newComic.save();

        user.uploadedComics.push({
          _id: newComic._id,
          name: newComic.name,
        });

        await user.save();

        return res.status(201).json(newComic);
      } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Backend error" });
      }
    } else {
      return res.status(400).json({ message: "Not enough data provided" });
    }
  });
};
