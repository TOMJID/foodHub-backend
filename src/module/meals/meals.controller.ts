import { Request, Response } from "express";
import { MealService } from "./meals.server";

export const createMeal = async (req: Request, res: Response) => {
  try {
    const meal = await MealService.createMeal(req.body);
    console.log(req.user);
    res.status(201).json(meal);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: "Failed to create meal. Check if ProviderID and CategoryID exist.",
    });
  }
};

export const MealController = {
  createMeal,
};
