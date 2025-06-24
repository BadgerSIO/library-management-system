import mongoose from "mongoose";
import { IGenericErrorResponse } from "../interfaces/common";

// Handles ValidationError
const handleValidationError = (
  error: mongoose.Error.ValidationError
): IGenericErrorResponse => {
  const errors = error.errors;
  return {
    statusCode: 400,
    message: "Validation failed",
    errorMessages: Object.values(errors).map(
      (el: mongoose.Error.ValidatorError | mongoose.Error.CastError) => ({
        path: el.path,
        message: el.message,
      })
    ),
    error: {
      name: error.name,
      errors: error.errors,
    },
  };
};
export default handleValidationError;
