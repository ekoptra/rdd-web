import type { NextApiRequest, NextApiResponse } from "next";
import { ResponseVideo } from "../../../types/response.type";
import prisma from "../../../utils/db";
import { Session, getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]";
import fs from "fs";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseVideo>
) {
  const session = await getServerSession(req, res, authOptions);
  if (!session) return res.redirect(307, "/login");

  try {
    if (req.method === "GET") return findOne(req, res, session);
    if (req.method === "DELETE") return deleteVideo(req, res, session);

    return res.status(500);
  } catch (error) {
    return res.status(500);
  } finally {
    prisma.$disconnect();
  }
}

const findOne = async (
  req: NextApiRequest,
  res: NextApiResponse<ResponseVideo>,
  session: Session
) => {
  const { id } = req.query;

  const video = await prisma.video.findFirstOrThrow({
    where: { id: id as string, idUser: session.user.id },
    select: {
      id: true,
      name: true,
      path: true,
      createdAt: true,
      updatedAt: true,
      user: {
        select: {
          id: true,
          name: true
        }
      }
    }
  });

  return res.status(200).send({
    data: video
  });
};

const deleteVideo = async (
  req: NextApiRequest,
  res: NextApiResponse,
  session: Session
) => {
  const videoId = req.query["id"] as string;

  const video = await prisma.video.findFirst({
    where: {
      id: videoId,
      idUser: session.user.id
    },
    select: {
      id: true,
      path: true,
      job: {
        select: {
          id: true
        }
      }
    }
  });

  if (!video) return res.status(401);

  const videoDeleted = await prisma.$transaction(
    async (tx) => {
      video.job.forEach((job) => {
        const dir = `./public/detections/${job.id}`;

        if (fs.existsSync(dir)) {
          fs.rmSync(dir, { recursive: true, force: true });
        }
      });

      const file = `./public/videos/${video.path}`;
      if (fs.existsSync(file)) {
        fs.unlinkSync(file);
      }

      await tx.job.deleteMany({
        where: {
          idVideo: video.id
        }
      });

      return await tx.video.delete({ where: { id: video.id } });
    },
    {
      maxWait: 10000000,
      timeout: 10000000
    }
  );

  return res.status(200).send({
    data: videoDeleted
  });
};
