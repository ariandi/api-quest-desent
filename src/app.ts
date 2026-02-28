import express, { Application, NextFunction, Request, Response } from "express";

import { errorMiddleware } from "./middleware/error.middleware";
import router from "./routes";

const app: Application = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(router);

// 404 handler for unknown routes
app.use((_req: Request, res: Response) => {
  res.status(404).json({
    error: "NotFound",
    message: "The requested route does not exist",
  });
});

// Global error handler (must be last)
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  errorMiddleware(err, req, res, next);
});

export default app;
