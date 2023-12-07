import { prisma } from "@/src/providers/database/prisma";
import { Request, Response } from "express";

const index = async (req: Request, res: Response) => {
  const data = await prisma.housekeeperService.findMany();

  return res.json(data);
};

export default { index };
