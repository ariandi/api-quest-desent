import { Request, Response } from "express";

import { authService } from "../services/auth.service";

interface LoginDto {
  username: string;
  password: string;
}

export const getToken = (req: Request, res: Response): void => {
  const { username, password } = req.body as LoginDto;

  if (username !== "admin" || password !== "password") {
    res.status(401).json({ error: "Unauthorized", message: "Invalid credentials" });
    return;
  }

  const tokenResponse = authService.generateToken();
  res.status(200).json(tokenResponse);
};
