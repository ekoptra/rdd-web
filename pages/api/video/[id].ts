import type { NextApiRequest, NextApiResponse } from "next";
import { ResponseVideo } from "../../../types/response.type";
import prisma from "../../../utils/db";

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseVideo>
) {
  try {
    if (req.method === "GET") return findOne(req, res);

    return res.status(500);
  } catch (error) {
    return res.status(500);
  } finally {
    prisma.$disconnect();
  }
}

const findOne = async (
  req: NextApiRequest,
  res: NextApiResponse<ResponseVideo>
) => {
  const { id } = req.query;

  const video = await prisma.video.findFirstOrThrow({
    where: { id: id as string },
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
