import { NextFunction, Request, Response } from "express";
import { ReviewService } from "./review.server";

const createReview = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const customerId = req.user?.id;
    if (!customerId) {
      res.status(401).json({ success: false, error: "Unauthorized" });
      return;
    }

    const review = await ReviewService.createReview({
      ...req.body,
      customerId,
    });

    res.status(201).json({
      success: true,
      data: review,
    });
  } catch (error) {
    next(error);
  }
};

const getMealReviews = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { mealId } = req.params;
    const reviews = await ReviewService.getReviewsByMeal(mealId as string);
    res.json({
      success: true,
      data: reviews,
    });
  } catch (error) {
    next(error);
  }
};

const getMyReviews = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      res.status(401).json({ success: false, error: "Unauthorized" });
      return;
    }

    const reviews = await ReviewService.getReviewsByCustomer(userId);
    res.json({
      success: true,
      data: reviews,
    });
  } catch (error) {
    next(error);
  }
};

const deleteReview = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { reviewId } = req.params;
    const userId = req.user?.id;
    const role = req.user?.role;

    if (!userId) {
      res.status(401).json({ success: false, error: "Unauthorized" });
      return;
    }

    await ReviewService.deleteReview(reviewId as string, userId, role);
    res.json({
      success: true,
      message: "Review deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};

export const ReviewController = {
  createReview,
  getMealReviews,
  getMyReviews,
  deleteReview,
};
