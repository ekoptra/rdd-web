import { NextApiRequest, NextApiResponse } from "next";
import prisma from "../../../utils/db";
import { Prisma } from "@prisma/client";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    if (req.method === "GET") return findAll(req, res);
    else if (req.method === "POST") return createNewJob(req, res);

    return res.status(500);
  } catch (error) {
    return res.status(500);
  } finally {
    prisma.$disconnect();
  }
}

const findAll = async (req: NextApiRequest, res: NextApiResponse) => {
  const jobWhereInput = req.query as Prisma.JobWhereInput;

  const jobs = await prisma.job.findMany({
    where: {
      ...jobWhereInput
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
      updatedAt: true
    }
  });

  return res.status(200).send({
    data: jobs
  });
};

const createNewJob = async (req: NextApiRequest, res: NextApiResponse) => {
  const body = req.body;

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

  await fetch("http://127.0.0.1:5000", {
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
