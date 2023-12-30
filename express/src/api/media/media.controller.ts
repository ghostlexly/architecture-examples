import { validate } from "@/src/middlewares/validate.middleware";
import { prisma } from "@/src/providers/database/prisma";
import { NextFunction, Request, Response } from "express";
import createHttpError from "http-errors";
import mediaShowSchema from "./schemas/media-show.schema";

/**
 * Display the image file
 */
async function show(req: Request, res: Response, next: NextFunction) {
  const { params } = await validate({ req, schema: mediaShowSchema });

  const media = await prisma.media.findFirst({ where: { id: params.id } });

  if (!media) {
    throw createHttpError(404, "Ce fichier n'existe pas.");
  }

  return res.sendFile(media.path);
}

export default { show };
