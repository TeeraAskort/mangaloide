import type { NextApiRequest, NextApiResponse } from "next";
import formidable from "formidable";
import Jimp from "jimp";
import { db } from "../../../../../../database";
import { ComicModel } from "../../../../../../models";
import { IComic } from "../../../../../../models/Comic";
import AdmZip from "adm-zip";
import fs from "fs";
import mime from "mime-types";
import { JWT } from "../../../../../../utils";

type Data =
  | {
      message: string;
    }
  | IComic;

export const config = {
  api: {
    bodyParser: false,
    externalResolver: true,
  },
};

const allowedMimeTypes: string[] = ["image/jpeg", "image/png", "image/gif"];

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  switch (req.method) {
    case "POST":
      return postChapter(req, res);

    default:
      return res.status(400).json({ message: "Method not allowed" });
  }
}

const postChapter = async (req: NextApiRequest, res: NextApiResponse<Data>) => {
  try {
    const { token } = req.cookies;

    try {
      await JWT.isValidToken(token);
    } catch (error) {
      return res.status(401).json({ message: "You have to be logged in" });
    }

    const form = formidable({ multiples: true });

    form.parse(req, async (err, fields, files: any) => {
      if (err) {
        console.log(err);
        return res.status(500).json({ message: "Backend error" });
      }

      const { name, chNumber, language } = fields;

      if (name && chNumber && language && files.file[0]) {
        try {
          if (!files.file[0].mimetype.includes("application/zip")) {
            return res.status(400).json({ message: "File type not supported" });
          }
          const { comicId } = req.query;

          await db.connect();

          const comic = await ComicModel.findById(comicId);

          if (!comic) {
            return res.status(404).json({ message: "Comic not found" });
          }

          const tmpPath = `${process.env.TMP_PATH}/${comic._id}-${chNumber}`;
          if (!fs.existsSync(tmpPath)) {
            fs.mkdirSync(tmpPath);
          }
          const zipTmpPath = `${process.env.TMP_PATH}/${files.file[0].originalFilename}`;

          const destPath = `${process.env.COMICS_PATH}/${comic._id}/${chNumber}-${language}`;
          if (fs.existsSync(destPath)) {
            return res.status(400).json({ message: "Chapter already exists" });
          }
          fs.mkdirSync(destPath);

          fs.copyFileSync(files.file[0].filepath, zipTmpPath);
          await unzipFile(zipTmpPath, tmpPath);

          let filesPath = await walk(tmpPath, destPath, []);

          if (filesPath.length === 0) {
            return res.status(400).json({
              message: "The provided .zip doesn't have any usable images",
            });
          }

          filesPath.forEach(async (file, index) => {
            const image = await Jimp.read(file);
            image.quality(90).write(`${destPath}/${index + 1}.jpg`);
          });

          fs.rmSync(tmpPath, { recursive: true, force: true });

          fs.rmSync(zipTmpPath, { force: true });

          comic.chapters.push({
            chNumber: parseFloat(chNumber[0]),
            language: language[0],
            name: name[0],
            pages: filesPath.length,
          });

          comic.save();

          res.status(201).json(comic);
        } catch (error) {
          console.log(error);
          return res.status(500).json({ message: "Backend error" });
        }
      } else {
        return res.status(400).json({ message: "You have to upload all data" });
      }
    });

    process.on("uncaughtException", (error) => console.log(error));
  } catch (error) {
    console.log(error);
  }
};

const unzipFile = async (filePath: string, resPath: string) => {
  const zip = new AdmZip(filePath);
  zip.extractAllTo(resPath);
  console.log("unzipped");
};

const walk = async (
  dir: string,
  destDir: string,
  filesPath: string[]
): Promise<string[]> => {
  const files = fs.readdirSync(dir);
  files.forEach(async (file) => {
    if (fs.statSync(`${dir}/${file}`).isDirectory()) {
      filesPath = await walk(`${dir}/${file}`, destDir, filesPath);
    } else {
      if (
        allowedMimeTypes.includes(mime.lookup(`${dir}/${file}`) || "no type")
      ) {
        filesPath.push(`${dir}/${file}`);
      }
    }
  });
  return filesPath;
};
