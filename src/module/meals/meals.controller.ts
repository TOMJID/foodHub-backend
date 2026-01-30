import { NextFunction, Request, Response } from "express";
import { MealService } from "./meals.server";
import { prisma } from "../../lib/prisma";

//? create meal
export const createMeal = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const userId = req.user?.id;

    if (!userId) {
      res.status(401).json({ error: "Unauthorized: login or signup first" });
      return;
    }

    //? Getting provider profile for this user
    const providerProfile = await prisma.providerProfile.findUnique({
      where: { userId },
    });

    if (!providerProfile) {
      res.status(404).json({
        success: false,
        error: "Provider profile not found. Please create a profile first.",
      });
      return;
    }

    const meal = await MealService.createMeal({
      ...req.body,
      providerId: providerProfile.id,
    });

    res.status(201).json({
      success: true,
      data: meal,
    });
  } catch (error: any) {
    next(error);
  }
};

//? get all meals
const getAllMeals = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { categoryId, minPrice, maxPrice, searchTerm } = req.query;

    const meals = await MealService.getAllMeals({
      categoryId: categoryId as string,
      minPrice: minPrice ? Number(minPrice) : undefined,
      maxPrice: maxPrice ? Number(maxPrice) : undefined,
      searchTerm: searchTerm as string,
    });

    res.json({
      success: true,
      data: meals,
    });
  } catch (error) {
    next(error);
  }
};

//? get meal by id
const getMealById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const meal = await MealService.getMealById(id as string);
    if (!meal) {
      res.status(404).json({ success: false, error: "Meal not found" });
      return;
    }
    res.json({
      success: true,
      data: meal,
    });
  } catch (error) {
    next(error);
  }
};

//? update meal
const updateMeal = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const userId = req.user?.id;
    const userRole = req.user?.role;

    if (!userId) {
      res.status(401).json({ error: "Unauthorized" });
      return;
    }

    const existingMeal = await MealService.getMealById(id as string);
    if (!existingMeal) {
      res.status(404).json({ success: false, error: "Meal not found" });
      return;
    }

    //? Check ownership if not admin
    if (userRole !== "ADMIN") {
      const providerProfile = await prisma.providerProfile.findUnique({
        where: { userId: userId as string },
      });
      if (!providerProfile || existingMeal.providerId !== providerProfile.id) {
        res.status(403).json({
          success: false,
          error: "Forbidden: You don't own this meal",
        });
        return;
      }
    }

    const updatedMeal = await MealService.updateMeal(id as string, req.body);
    res.json({
      success: true,
      data: updatedMeal,
    });
  } catch (error) {
    next(error);
  }
};

//? get meals by provider
const getMealsByProvider = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { providerId } = req.params;
    const meals = await MealService.getMealsByProvider(providerId as string);
    res.json({
      success: true,
      data: meals,
    });
  } catch (error) {
    next(error);
  }
};

//? delete meal
const deleteMeal = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const userId = req.user?.id;
    const userRole = req.user?.role;

    if (!userId) {
      res.status(401).json({ error: "Unauthorized" });
      return;
    }

    const existingMeal = await MealService.getMealById(id as string);
    if (!existingMeal) {
      res.status(404).json({ success: false, error: "Meal not found" });
      return;
    }

    //? Check ownership if not admin
    if (userRole !== "ADMIN") {
      const providerProfile = await prisma.providerProfile.findUnique({
        where: { userId: userId as string },
      });
      if (!providerProfile || existingMeal.providerId !== providerProfile.id) {
        res.status(403).json({
          success: false,
          error: "Forbidden: You don't own this meal",
        });
        return;
      }
    }

    await MealService.deleteMeal(id as string);
    res.json({
      success: true,
      message: "Meal deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};

export const MealController = {
  createMeal,
  getAllMeals,
  getMealById,
  getMealsByProvider,
  updateMeal,
  deleteMeal,
};
