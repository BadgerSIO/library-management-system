import mongoose from "mongoose";
import { IGenericErrorMessages } from "../interfaces/error";

// Handles CastError for invalid ObjectId
const handleCastError = (error: mongoose.Error.CastError) => {
  const errors: IGenericErrorMessages[] = [
    {
      path: error?.path,
      message: "Invalid Id",
    },
  ];
  const statusCode = 400;
  return {
    statusCode,
    message: "Cast Error",
    errorMessages: errors,
    error: {
      name: error.name,
      path: error.path,
      value: error.value,
    },
  };
};

export default handleCastError;
