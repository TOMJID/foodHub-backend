import { NextFunction, Request, Response } from "express";
import { MealService } from "./meals.server";
import { prisma } from "../../lib/prisma";

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

export const MealController = {
  createMeal,
};
