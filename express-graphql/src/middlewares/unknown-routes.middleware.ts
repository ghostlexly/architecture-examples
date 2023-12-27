import { Response, Request } from "express";

/**
 * Pour toutes les autres routes non définies, on retourne une erreur
 */
const unknownRoutesMiddleware = (req: Request, res: Response) => {
  return res.status(404).json({ message: `This page does not exist.` });
};

export default unknownRoutesMiddleware;
