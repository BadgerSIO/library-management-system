import { ErrorRequestHandler } from "express";
import mongoose from "mongoose";
import { IGenericErrorMessages } from "../interfaces/error";
import handleValidationError from "../error/handleValidationError";
import handleCastError from "../error/handleCastError";

const globalErrorHandler: ErrorRequestHandler = (error, req, res, next) => {
  let statusCode = 500;
  let message = "Something went wrong";
  let errorMessages: IGenericErrorMessages[] = [];
  let errorObj: any = null;

  if (error.name === "ValidationError") {
    const simplifiedError = handleValidationError(
      error as mongoose.Error.ValidationError
    );
    statusCode = simplifiedError.statusCode;
    message = simplifiedError.message;
    errorMessages = simplifiedError.errorMessages;
    errorObj = simplifiedError.error;
  } else if (error.name === "CastError") {
    const simplifiedError = handleCastError(error as mongoose.Error.CastError);
    statusCode = simplifiedError.statusCode;
    message = simplifiedError.message;
    errorMessages = simplifiedError.errorMessages;
    errorObj = simplifiedError.error;
  } else if (error instanceof Error) {
    message = error.message;
    errorMessages = error.message
      ? [
          {
            path: "",
            message: error.message,
          },
        ]
      : [];
    errorObj = { name: error.name, message: error.message };
  }

  res.status(statusCode).json({
    success: false,
    message,
    error: errorObj,
  });

  next();
};
export default globalErrorHandler;
