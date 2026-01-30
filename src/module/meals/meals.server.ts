import { prisma } from "../../lib/prisma";
import { MealUncheckedCreateInput } from "../../../generated/prisma/models";

const createMeal = async (data: MealUncheckedCreateInput) => {
  return await prisma.meal.create({
    data,
  });
};

export const MealService = {
  createMeal,
};
