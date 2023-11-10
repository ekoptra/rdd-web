import type { NextApiRequest, NextApiResponse } from "next";
import { Response, ResponseJobDetail } from "../../../types/response.type";
import prisma from "../../../utils/db";
import { authOptions } from "../auth/[...nextauth]";
import { Session, getServerSession } from "next-auth";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseJobDetail>
) {
  const session = await getServerSession(req, res, authOptions);
  if (!session) return res.redirect(307, "/login");

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
  res: NextApiResponse<ResponseJobDetail>,
  session: Session
) => {
  const { id } = req.query;

  const job = await prisma.job.findFirstOrThrow({
    where: {
      id: id as string,
      video: {
        idUser: session.user.id
      }
    }
  });

  return res.status(200).send({
    data: job as ResponseJobDetail["data"]
  });
};
