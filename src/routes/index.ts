import { Router } from "express";

import authRoute from "./auth.route";
import booksRoute from "./books.route";
import echoRoute from "./echo.route";
import pingRoute from "./ping.route";

const router = Router();

router.use("/ping", pingRoute);
router.use("/echo", echoRoute);
router.use("/auth", authRoute);
router.use("/books", booksRoute);

export default router;
