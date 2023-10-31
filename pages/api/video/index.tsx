import { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "GET") return findAll(req, res);

  return res.status(500);
}

const findAll = async (req: NextApiRequest, res: NextApiResponse) => {
  const video = await prisma.video.findMany();

  return res.status(200).send({
    data: []
  });
};
