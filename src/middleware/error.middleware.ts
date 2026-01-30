import { NextFunction, Request, Response } from "express";
import { Prisma } from "../../generated/prisma/client";

export const globalErrorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  console.error("Error path:", req.path);
  console.error("Error details:", err);

  let statusCode = 500;
  let message = "Something went wrong";
  let success = false;

  //? Handle Prisma Known Request Errors
  if (err instanceof Prisma.PrismaClientKnownRequestError) {
    switch (err.code) {
      case "P2002": //? Unique constraint violation
        statusCode = 409;
        const target = (err.meta?.target as string[]) || [];
        message = `Unique constraint failed on field: ${target.join(", ")}`;
        break;
      case "P2003": //? Foreign key constraint violation
        statusCode = 400;
        message = `Foreign key constraint failed. Check if the provided IDs (like categoryId or providerId) exist in the database.`;
        break;
      case "P2025": //? Record not found for update/delete
        statusCode = 404;
        message = (err.meta?.cause as string) || "Record not found";
        break;
      case "P2000": //? Input value too long
        statusCode = 400;
        message = "Input value too long for the database column";
        break;
      default:
        message = `Database error: ${err.message}`;
        break;
    }
  }

  //? Handle Prisma Validation Errors
  if (err instanceof Prisma.PrismaClientValidationError) {
    statusCode = 400;
    message = "Database validation failed. Please check your input data types.";
  }

  res.status(statusCode).json({
    success,
    message,
    error: process.env.NODE_ENV === "development" ? err : undefined,
  });
};
