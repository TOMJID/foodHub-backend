import { Router } from "express";
import { ReviewController } from "./review.controller";
import auth from "../../middleware/auth.middleware";

const router = Router();

//? Public: View reviews for a meal
router.get("/meal/:mealId", ReviewController.getMealReviews);

//? Protected: User actions
router.post("/", auth(), ReviewController.createReview);
router.get("/my", auth(), ReviewController.getMyReviews);
router.delete("/:reviewId", auth(), ReviewController.deleteReview);

export const reviewRoutes = router;
