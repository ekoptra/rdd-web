import type { NextApiRequest, NextApiResponse } from "next";
import { ResponseVideo } from "../../../types/response.type";
import prisma from "../../../utils/db";
import { Session, getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseVideo>
) {
  const session = await getServerSession(req, res, authOptions);
  if (!session) return res.status(401);

  try {
    if (req.method === "GET") return findOne(req, res, session);

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
