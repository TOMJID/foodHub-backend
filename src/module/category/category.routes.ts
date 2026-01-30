import { Router } from "express";
import { CategoryController } from "./category.controller";

const router = Router();

//? create new category
router.post("/", CategoryController.createCategory);

//? get all categories
router.get("/", CategoryController.getAllCategories);

//? get category by id
router.get("/:categoryId", CategoryController.getCategoryById);

export const categoryRoutes = router;
