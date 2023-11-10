import { NextApiRequest, NextApiResponse } from "next";
import busboy from "busboy";
import fs from "fs";
import { v4 as uuidv4 } from "uuid";
import prisma from "../../../utils/db";
import { authOptions } from "../auth/[...nextauth]";
import { Session, getServerSession } from "next-auth";

export const config = {
  api: {
    bodyParser: false
  }
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const session = await getServerSession(req, res, authOptions);
    if (!session) return res.redirect(307, "/login");

    if (req.method === "GET") return findAll(req, res, session);
    else if (req.method === "POST") return uploadVideoStream(req, res, session);

    return res.status(500);
  } catch (error) {
    return res.status(500);
  } finally {
    prisma.$disconnect();
  }
}

const findAll = async (
  req: NextApiRequest,
  res: NextApiResponse,
  session: Session
) => {
  const video = await prisma.video.findMany({
    where: {
      idUser: session.user.id
    }
  });

  return res.status(200).send({
    data: video
  });
};

const uploadVideoStream = (
  req: NextApiRequest,
  res: NextApiResponse,
  session: Session
) => {
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
        idUser: session.user.id
      }
    });

    return res.status(200).send({
      data: video
    });
  });

  req.pipe(bb);
};
