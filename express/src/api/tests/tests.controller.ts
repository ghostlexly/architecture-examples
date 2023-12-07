import { prisma } from "@/src/providers/database/prisma";
import { handleMeta } from "@/src/lib/meta";
import { Request, Response, NextFunction } from "express";

async function index(req: Request, res: Response) {
  // prisma.user.findMany({ where: {}, orderBy: { id: "asc"} });

  const data = await handleMeta({
    req,
    model: "User",
    args: {
      where: {},
    },
  });

  return res.json(data);
}

export default { index };
