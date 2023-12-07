import { NextFunction, Request, Response } from "express";
import httpError from "http-errors";
import { logger } from "@/src/lib/logger";

/**
 * Middleware de gestion globale des erreurs
 *
 * @param err - L'erreur Express (peut être la notre ou une autre)
 * @param req - La requête initiale
 * @param res - L'objet de réponse
 * @param next - Permet de passer au middleware suivant si existant
 *
 * @see https://expressjs.com/en/guide/error-handling.html
 */
const exceptionsMiddleware = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (res.headersSent) {
    return next(err);
  }

  if (httpError.isHttpError(err)) {
    if (err.json) {
      return res.status(err.status).json(err.json);
    } else {
      return res.status(err.status).json(err.message);
    }
  }

  console.log(err);

  /** Log unhandled errors to a file */
  logger.warn({
    message: {
      url: req.protocol + "://" + req.hostname + req.originalUrl,
      description: err.message,
      stack: err.stack,
    },
  });

  /**
   * Dans les autres cas, on retourne une 500
   */
  return res.status(500).json({ message: "Oops.. Internal Server Error" });
};

export default exceptionsMiddleware;
