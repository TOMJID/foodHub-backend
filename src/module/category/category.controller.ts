import { Request, Response } from "express";
import { CategoryService } from "./category.server";

//? create new category
const createCategory = async (req: Request, res: Response) => {
  try {
    const category = await CategoryService.createCategory(req.body);
    res.status(201).json(category);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: "Failed to create category",
    });
  }
};

//? get all categories
const getAllCategories = async (req: Request, res: Response) => {
  try {
    const categories = await CategoryService.getAllCategories();
    res.json(categories);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: "Failed to retrieve categories",
    });
  }
};

//? get category by id
const getCategoryById = async (req: Request, res: Response) => {
  try {
    const categoryId = req.params.categoryId as string;
    const category = await CategoryService.getCategoryById(categoryId);
    if (!category) {
      res.status(404).json({ error: "Category not found" });
      return;
    }
    res.json(category);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: "Failed to retrieve category",
    });
  }
};

export const CategoryController = {
  createCategory,
  getAllCategories,
  getCategoryById,
};
