import { Router } from "express";

import {
  createBook,
  deleteBook,
  getBookById,
  getBooks,
  updateBook,
} from "../controllers/books.controller";
import { authMiddleware } from "../middleware/auth.middleware";

const router = Router();

// Level 5: GET /books is protected with auth
router.get("/", authMiddleware, getBooks);
router.get("/:id", getBookById);
router.post("/", createBook);
router.put("/:id", updateBook);
router.delete("/:id", deleteBook);

export default router;
