import { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";
import busboy from "busboy";
import fs from "fs";
import { v4 as uuidv4 } from "uuid";
import prisma from "../../../utils/db";

export const config = {
  api: {
    bodyParser: false
  }
};

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    if (req.method === "GET") return findAll(req, res);
    else if (req.method === "POST") return uploadVideoStream(req, res);

    return res.status(500);
  } catch (error) {
    return res.status(500);
  } finally {
    prisma.$disconnect();
  }
}

const findAll = async (req: NextApiRequest, res: NextApiResponse) => {
  const video = await prisma.video.findMany();

  return res.status(200).send({
    data: video
  });
};

function uploadVideoStream(req: NextApiRequest, res: NextApiResponse) {
  const bb = busboy({ headers: req.headers });
  let fileName: string;
  let namaVideo: string;

  bb.on("file", (_, file, info) => {
    const extension = info.filename.split(".").pop() as string;
    fileName = `${uuidv4()}.${extension}`;

    const filePath = `./public/videos/${fileName}`;

    const stream = fs.createWriteStream(filePath);

    file.pipe(stream);
  });

  bb.on("field", (name, val, info) => {
    if (name === "name") {
      namaVideo = val;
    }
  });

  bb.on("close", async () => {
    const video = await prisma.video.create({
      data: {
        name: namaVideo,
        path: fileName,
        idUser: "78776ac9-62b6-47f3-9c6f-216071989687"
      }
    });

    return res.status(200).send({
      data: []
    });
  });

  req.pipe(bb);
}
