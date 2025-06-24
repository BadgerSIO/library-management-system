import { Schema, model } from "mongoose";
import { BorrowModel, IBorrow } from "./borrow.interface";

const BorrowSchema = new Schema<IBorrow>(
  {
    book: { type: Schema.Types.ObjectId, ref: "Borrow", required: true },
    quantity: { type: Number, required: true, min: 1 },
    dueDate: { type: Date, required: true },
  },
  { timestamps: true, versionKey: false }
);

export const Borrow = model<IBorrow, BorrowModel>("Borrow", BorrowSchema);
