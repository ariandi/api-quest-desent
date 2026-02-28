import { NextFunction, Request, Response } from "express";

import { authService } from "../services/auth.service";
import { ApiErrorResponse } from "../types";

export const authMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    const response: ApiErrorResponse = {
      error: "Unauthorized",
      message: "Missing or invalid authorization header",
    };
    res.status(401).json(response);
    return;
  }

  const token = authHeader.substring(7);

  if (!authService.validateToken(token)) {
    const response: ApiErrorResponse = {
      error: "Unauthorized",
      message: "Invalid or expired token",
    };
    res.status(401).json(response);
    return;
  }

  next();
};
