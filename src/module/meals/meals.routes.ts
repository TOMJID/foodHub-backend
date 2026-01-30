import { Router } from "express";
import { MealController } from "./meals.controller";
import auth, { UserRole } from "../../middleware/auth.middleware";

const router = Router();

router.post(
  "/",
  auth(UserRole.PROVIDER, UserRole.ADMIN),
  MealController.createMeal,
);

export const mealRoutes = router;
