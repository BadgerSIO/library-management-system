import { Request, Response, NextFunction } from "express";
import { Borrow } from "./borrow.model";
import { IBorrow } from "./borrow.interface";
import { Book } from "../book/book.model";
import mongoose from "mongoose";

const borrowBook = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<any> => {
  try {
    const { book: bookId, quantity, dueDate } = req.body as IBorrow;
    // Input validation
    if (!mongoose.Types.ObjectId.isValid(bookId)) {
      throw new Error("Invalid book ID");
    }
    if (!Number.isInteger(quantity) || quantity < 1) {
      throw new Error("Quantity must be a positive integer");
    }
    const parsedDueDate = new Date(dueDate);
    if (isNaN(parsedDueDate.getTime())) {
      throw new Error("Invalid due date");
    }
    if (parsedDueDate < new Date()) {
      throw new Error("Due date must be in the future");
    }
    // Check if the book exists and is available
    const book = await Book.findById(bookId);
    if (!book) {
      throw new Error("Book not found");
    }
    if (book.copies < quantity) {
      throw new Error("Not enough copies available");
    }

    // Create the borrow record
    const borrowRecord = await Borrow.create({
      book: bookId,
      quantity,
      dueDate,
    });

    // Update the book's available copies]
    await book.deductCopies(quantity);

    res.status(201).json({
      success: true,
      message: "Book borrowed successfully",
      data: borrowRecord,
    });
  } catch (error) {
    next(error);
  }
};
const getBorrowSummary = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<any> => {
  try {
    const summary = await Borrow.aggregate([
      { $group: { _id: "$book", totalQuantity: { $sum: "$quantity" } } },
      {
        $lookup: {
          from: "books",
          localField: "_id",
          foreignField: "_id",
          as: "book",
        },
      },
      { $unwind: "$book" },
      {
        $project: {
          _id: 0,
          book: {
            title: "$book.title",
            isbn: "$book.isbn",
          },
          totalQuantity: 1,
        },
      },
    ]);
    res.status(201).json({
      success: true,
      message: "Borrowed books summary retrieved successfully",
      data: summary,
    });
  } catch (error) {
    next(error);
  }
};
export const BorrowController = {
  borrowBook,
  getBorrowSummary,
};
