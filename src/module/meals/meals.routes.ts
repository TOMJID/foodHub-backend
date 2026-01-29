import { Router } from "express";
import { MealController } from "./meals.controller";

const router = Router();

router.post("/", MealController.createMeal);

export const mealRoutes = router;
