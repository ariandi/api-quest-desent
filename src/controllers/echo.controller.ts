import { Request, Response } from "express";

export const echo = (req: Request, res: Response): void => {
  res.status(200).json(req.body);
};
