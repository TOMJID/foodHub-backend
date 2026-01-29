import { prisma } from "../../lib/prisma";
import { MealCreateInput } from "../../../generated/prisma/models";

const createMeal = async (data: MealCreateInput) => {
  await prisma.meal.create({
    data,
  });
};

export const MealService = {
  createMeal,
};
