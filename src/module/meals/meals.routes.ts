import { Router } from "express";
import { MealController } from "./meals.controller";
import auth, { UserRole } from "../../middleware/auth.middleware";

const router = Router();

//? get all meals
router.get("/", MealController.getAllMeals);

//? get meal by id
router.get("/:id", MealController.getMealById);

//? get meals by provider
router.get("/provider/:providerId", MealController.getMealsByProvider);

//? create meal
router.post(
  "/",
  auth(UserRole.PROVIDER, UserRole.ADMIN),
  MealController.createMeal,
);

//? update meal
router.patch(
  "/:id",
  auth(UserRole.PROVIDER, UserRole.ADMIN),
  MealController.updateMeal,
);

//? delete meal
router.delete(
  "/:id",
  auth(UserRole.PROVIDER, UserRole.ADMIN),
  MealController.deleteMeal,
);

export const mealRoutes = router;
