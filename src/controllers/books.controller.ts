import { NextFunction, Request, Response } from "express";

import { AppError } from "../middleware/error.middleware";
import { booksService } from "../services/books.service";
import {
  Book,
  BooksQueryParams,
  CreateBookDto,
  UpdateBookDto,
} from "../types";

export const getBooks = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const { author, page, limit } = req.query as BooksQueryParams;

  const hasPagination = page !== undefined || limit !== undefined;

  if (hasPagination) {
    const pageNum = parseInt(page ?? "1", 10);
    const limitNum = parseInt(limit ?? "10", 10);

    if (isNaN(pageNum) || pageNum < 1) {
      next(new AppError("Query param 'page' must be a positive integer", 400));
      return;
    }

    if (isNaN(limitNum) || limitNum < 1) {
      next(new AppError("Query param 'limit' must be a positive integer", 400));
      return;
    }

    const result = booksService.findAllPaginated(
      pageNum,
      limitNum,
      author
    );
    res.status(200).json(result.data);
    return;
  }

  const books: Book[] = booksService.findAll(author);
  res.status(200).json(books);
};

export const getBookById = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const id = parseInt(req.params.id, 10);

  if (isNaN(id)) {
    next(new AppError(`Book with id ${req.params.id} not found`, 404));
    return;
  }

  const book = booksService.findById(id);

  if (!book) {
    next(new AppError(`Book with id ${id} not found`, 404));
    return;
  }

  res.status(200).json(book);
};

export const createBook = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const { title, author } = req.body as CreateBookDto;

  if (!title || typeof title !== "string" || title.trim() === "") {
    next(new AppError("Field 'title' is required and must be a non-empty string", 400));
    return;
  }

  if (!author || typeof author !== "string" || author.trim() === "") {
    next(new AppError("Field 'author' is required and must be a non-empty string", 400));
    return;
  }

  const book = booksService.create({ title, author });
  res.status(201).json(book);
};

export const updateBook = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const id = parseInt(req.params.id, 10);

  if (isNaN(id)) {
    next(new AppError(`Book with id ${req.params.id} not found`, 404));
    return;
  }

  const { title, author } = req.body as UpdateBookDto;

  if (title !== undefined && (typeof title !== "string" || title.trim() === "")) {
    next(new AppError("Field 'title' must be a non-empty string", 400));
    return;
  }

  if (author !== undefined && (typeof author !== "string" || author.trim() === "")) {
    next(new AppError("Field 'author' must be a non-empty string", 400));
    return;
  }

  const updatedBook = booksService.update(id, { title, author });

  if (!updatedBook) {
    next(new AppError(`Book with id ${id} not found`, 404));
    return;
  }

  res.status(200).json(updatedBook);
};

export const deleteBook = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const id = parseInt(req.params.id, 10);

  if (isNaN(id)) {
    next(new AppError("Book ID must be a valid integer", 400));
    return;
  }

  const deleted = booksService.delete(id);

  if (!deleted) {
    next(new AppError(`Book with id ${id} not found`, 404));
    return;
  }

  res.status(200).json({ message: `Book with id ${id} successfully deleted` });
};
