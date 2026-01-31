import { NextFunction, Request, Response } from "express";
import { CategoryService } from "./category.server";

//? create new category
const createCategory = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const category = await CategoryService.createCategory(req.body);
    res.status(201).json({
      success: true,
      data: category,
    });
  } catch (error: any) {
    next(error);
  }
};

//? get all categories
const getAllCategories = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const categories = await CategoryService.getAllCategories();
    res.json({
      success: true,
      data: categories,
    });
  } catch (error: any) {
    next(error);
  }
};

//? get category by id
const getCategoryById = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const categoryId = req.params.categoryId as string;
    const category = await CategoryService.getCategoryById(categoryId);
    if (!category) {
      res.status(404).json({ success: false, error: "Category not found" });
      return;
    }
    res.json({
      success: true,
      data: category,
    });
  } catch (error: any) {
    next(error);
  }
};

//? delete category
const deleteCategory = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const categoryId = req.params.categoryId as string;
    await CategoryService.deleteCategory(categoryId);
    res.json({
      success: true,
      message: "Category deleted successfully",
    });
  } catch (error: any) {
    next(error);
  }
};

export const CategoryController = {
  createCategory,
  getAllCategories,
  getCategoryById,
  deleteCategory,
};
