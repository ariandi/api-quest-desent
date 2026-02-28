import { Request, Response } from "express";

import { authService } from "../services/auth.service";

export const getToken = (_req: Request, res: Response): void => {
  const tokenResponse = authService.generateToken();
  res.status(200).json(tokenResponse);
};
