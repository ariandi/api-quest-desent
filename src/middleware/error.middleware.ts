import { NextFunction, Request, Response } from "express";

import { ApiErrorResponse } from "../types";

export class AppError extends Error {
  public readonly statusCode: number;

  constructor(message: string, statusCode: number) {
    super(message);
    this.name = "AppError";
    this.statusCode = statusCode;
    Object.setPrototypeOf(this, new.target.prototype);
  }
}

export const errorMiddleware = (
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction
): void => {
  if (err instanceof AppError) {
    const response: ApiErrorResponse = {
      error: err.name,
      message: err.message,
    };
    res.status(err.statusCode).json(response);
    return;
  }

  const response: ApiErrorResponse = {
    error: "InternalServerError",
    message: "An unexpected error occurred",
  };
  res.status(500).json(response);
};
