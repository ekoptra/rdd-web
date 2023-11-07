import type { NextApiRequest, NextApiResponse } from "next";
import { Response, ResponseJobDetail } from "../../../types/response.type";
import prisma from "../../../utils/db";

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseJobDetail>
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
  res: NextApiResponse<ResponseJobDetail>
) => {
  const { id } = req.query;

  const job = await prisma.job.findFirstOrThrow({
    where: { id: id as string }
  });

  return res.status(200).send({
    data: job as ResponseJobDetail["data"]
  });
};
