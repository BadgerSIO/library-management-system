import { Request, Response, NextFunction } from "express";
import { Book } from "./book.model";
import { IBook } from "./book.interface";
import mongoose from "mongoose";

const createBook = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<any> => {
  try {
    const book = await Book.create(req.body as IBook);
    res.status(201).json({
      success: true,
      message: "Book created successfully",
      data: book,
    });
  } catch (error) {
    next(error);
  }
};
const getAllBooks = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<any> => {
  try {
    const { filter: genre, sortBy, order = "asc", limit = 10 } = req.query;
    const filter: any = {};
    if (genre) filter.genre = genre;

    const books = await Book.find(filter)
      .sort({ [sortBy as string]: order === "asc" ? 1 : -1 })
      .limit(+limit);
    res.json({
      success: true,
      message: "Books retrieved successfully",
      data: books,
    });
  } catch (error) {
    next(error);
  }
};
const getBookById = async (
  req: Request<{ bookId: string }, {}, {}>,
  res: Response,
  next: NextFunction
): Promise<any> => {
  try {
    const book = await Book.findById(req.params.bookId);
    if (!book) {
      return res.status(404).json({
        success: false,
        message: "Book not found",
      });
    }
    res.json({
      success: true,
      message: "Book retrieved successfully",
      data: book,
    });
  } catch (error) {
    next(error);
  }
};
const updateBook = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<any> => {
  try {
    const book = await Book.findById(req.params.bookId);
    if (!book) {
      return res.status(404).json({
        success: false,
        message: "Book not found",
      });
    }

    // Update fields from req.body
    Object.assign(book, req.body);

    // Save to trigger pre('save') middleware and validators
    await book.save({ validateBeforeSave: true });

    res.status(200).json({
      success: true,
      message: "Book updated successfully",
      data: book,
    });
  } catch (error) {
    next(error);
  }
};
const deleteBook = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<any> => {
  try {
    const book = await Book.findByIdAndDelete(req.params.bookId);
    if (!book) {
      return res.status(404).json({
        success: false,
        message: "Book not found",
      });
    }
    res.status(200).json({
      success: true,
      message: "Book deleted successfully",
      data: null,
    });
  } catch (error) {
    next(error);
  }
};
export const BookController = {
  createBook,
  getAllBooks,
  getBookById,
  updateBook,
  deleteBook,
};
