import { Request, Response } from "express";

export const ping = (_req: Request, res: Response): void => {
  res.status(200).json({ success: true });
};
