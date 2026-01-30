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
const getAllMeals = async (filters: {
  categoryId?: string;
  minPrice?: number;
  maxPrice?: number;
  searchTerm?: string;
}) => {
  const { categoryId, minPrice, maxPrice, searchTerm } = filters;

  const where: any = {
    isAvailable: true,
  };

  if (categoryId) {
    where.categoryId = categoryId;
  }

  if (minPrice !== undefined || maxPrice !== undefined) {
    where.price = {};
    if (minPrice !== undefined) where.price.gte = minPrice;
    if (maxPrice !== undefined) where.price.lte = maxPrice;
  }

  if (searchTerm) {
    where.OR = [
      { name: { contains: searchTerm, mode: "insensitive" } },
      { description: { contains: searchTerm, mode: "insensitive" } },
      {
        category: {
          name: { contains: searchTerm, mode: "insensitive" },
        },
      },
    ];
  }

  return await prisma.meal.findMany({
    where,
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
const getMealsByProvider = async (
  providerId: string,
  includeUnavailable: boolean = false,
) => {
  const where: any = { providerId };
  if (!includeUnavailable) {
    where.isAvailable = true;
  }

  return await prisma.meal.findMany({
    where,
    include: {
      category: true,
    },
  });
};

//? update meal
const updateMeal = async (id: string, data: MealUncheckedUpdateInput) => {
  return await prisma.meal.update({
    where: { id },
    data,
  });
};

//? delete meal
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
