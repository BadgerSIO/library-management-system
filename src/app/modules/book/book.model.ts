import { Model, Schema, model } from "mongoose";
import { IBook } from "./book.interface";
interface BookMethods extends IBook {
  deductCopies(quantity: number): Promise<any>;
}
const BookSchema = new Schema<IBook, Model<IBook>, BookMethods>(
  {
    title: { type: String, required: true, trim: true },
    author: { type: String, required: true, trim: true },
    genre: {
      type: String,
      required: true,
      enum: {
        values: [
          "FICTION",
          "NON_FICTION",
          "SCIENCE",
          "HISTORY",
          "BIOGRAPHY",
          "FANTASY",
        ],
        message: "{VALUE} is not a valid genre",
      },
    },
    isbn: {
      type: String,
      required: true,
      unique: [true, "ISBN must be unique"],
    },
    description: { type: String },
    copies: {
      type: Number,
      required: true,
      min: [0, "Copies must be a positive number"],
    },
    available: { type: Boolean, default: true },
  },
  { timestamps: true, versionKey: false }
);

// Pre-save middleware to update available based on copies
BookSchema.pre("save", function (next) {
  this.available = this.copies > 0;
  next();
});

// Instance method to deduct copies
BookSchema.methods.deductCopies = async function (
  quantity: number
): Promise<void> {
  if (this.copies < quantity) {
    throw new Error("Insufficient copies available");
  }
  this.copies -= quantity;
  await this.save(); // Triggers pre-save middleware
};

export const Book = model("Book", BookSchema);
