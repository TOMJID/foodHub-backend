import { prisma } from "../../lib/prisma";
import { CategoryCreateInput } from "../../../generated/prisma/models";

//? create new category
const createCategory = async (data: CategoryCreateInput) => {
  return await prisma.category.create({
    data,
  });
};

//? get all categories
const getAllCategories = async () => {
  return await prisma.category.findMany();
};

//? get category by id
const getCategoryById = async (id: string) => {
  return await prisma.category.findUnique({
    where: { id },
  });
};

//? delete category
const deleteCategory = async (id: string) => {
  return await prisma.category.delete({
    where: { id },
  });
};

export const CategoryService = {
  createCategory,
  getAllCategories,
  getCategoryById,
  deleteCategory,
};
