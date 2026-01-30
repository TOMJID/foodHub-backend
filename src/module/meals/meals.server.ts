import { prisma } from "../../lib/prisma";
import {
  MealUncheckedCreateInput,
  MealUncheckedUpdateInput,
} from "../../../generated/prisma/models";

//? create meal
const createMeal = async (data: MealUncheckedCreateInput) => {
  return await prisma.meal.create({
    data,
  });
};

//? get all meals
const getAllMeals = async () => {
  return await prisma.meal.findMany({
    include: {
      category: true,
      provider: true,
    },
  });
};

//? get meal by id
const getMealById = async (id: string) => {
  return await prisma.meal.findUnique({
    where: { id },
    include: {
      category: true,
      provider: true,
    },
  });
};

//? get meals by provider
const getMealsByProvider = async (providerId: string) => {
  return await prisma.meal.findMany({
    where: { providerId },
    include: {
      category: true,
    },
  });
};

const updateMeal = async (id: string, data: MealUncheckedUpdateInput) => {
  return await prisma.meal.update({
    where: { id },
    data,
  });
};

const deleteMeal = async (id: string) => {
  return await prisma.meal.delete({
    where: { id },
  });
};

export const MealService = {
  createMeal,
  getAllMeals,
  getMealById,
  getMealsByProvider,
  updateMeal,
  deleteMeal,
};
