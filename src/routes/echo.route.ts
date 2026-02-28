import { Router } from "express";

import { echo } from "../controllers/echo.controller";

const router = Router();

router.post("/", echo);

export default router;
