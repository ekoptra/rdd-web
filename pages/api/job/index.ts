import { NextApiRequest, NextApiResponse } from "next";
import prisma from "../../../utils/db";
import { Prisma } from "@prisma/client";
import { Session, getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]";
import fs from "fs";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const session = await getServerSession(req, res, authOptions);
  if (!session) return res.redirect(307, "/login");

  try {
    if (req.method === "GET") return findAll(req, res, session);
    else if (req.method === "POST") return createNewJob(req, res, session);
    else if (req.method === "DELETE") return deleteJob(req, res, session);

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
  const jobWhereInput = req.query as Prisma.JobWhereInput;

  const jobs = await prisma.job.findMany({
    where: {
      AND: [
        { ...jobWhereInput },
        {
          video: {
            idUser: session.user.id
          }
        }
      ]
    },
    select: {
      id: true,
      name: true,
      status: true,
      modelName: true,
      idVideo: true,
      showConf: true,
      showLabels: true,
      conf: true,
      startedAt: true,
      finishedAt: true,
      createdAt: true,
      updatedAt: true,
      video: {
        select: {
          id: true,
          name: true
        }
      }
    }
  });

  return res.status(200).send({
    data: jobs
  });
};

const createNewJob = async (
  req: NextApiRequest,
  res: NextApiResponse,
  session: Session
) => {
  const body = req.body;

  const video = await prisma.video.findFirst({
    where: { id: body["videoId"] }
  });

  if (!video || video.idUser !== session.user.id) return res.status(401);

  const job = await prisma.job.create({
    data: {
      modelName: body["model"],
      name: body["name"],
      showConf: body["showConf"],
      showLabels: body["showLabels"],
      conf: body["conf"],
      idVideo: body["videoId"]
    }
  });

  await fetch(process.env.BACKEND_URL as string, {
    method: "POST",
    body: JSON.stringify({ jobId: job.id }),
    headers: {
      "Content-Type": "application/json"
    }
  });

  return res.status(200).send({
    data: job
  });
};

const deleteJob = async (
  req: NextApiRequest,
  res: NextApiResponse,
  session: Session
) => {
  const jobId = req.body["id"];

  const job = await prisma.job.findFirst({
    where: {
      id: jobId,
      video: {
        idUser: session.user.id
      }
    }
  });

  if (!job) return res.status(401);

  const jobDeleted = await prisma.$transaction(
    async (tx) => {
      const dir = `./public/detections/${job.id}`;

      if (fs.existsSync(dir)) {
        fs.rmSync(dir, { recursive: true, force: true });
      }

      return await tx.job.delete({ where: { id: job.id } });
    },
    {
      maxWait: 10000000,
      timeout: 10000000
    }
  );

  return res.status(200).send({
    data: jobDeleted
  });
};
