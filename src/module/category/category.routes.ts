import { Router } from "express";
import { CategoryController } from "./category.controller";
import auth, { UserRole } from "../../middleware/auth.middleware";

const router = Router();

//? create new category
router.post("/", auth(UserRole.ADMIN), CategoryController.createCategory);

//? get all categories
router.get("/", CategoryController.getAllCategories);

//? get category by id
router.get("/:categoryId", CategoryController.getCategoryById);

//? delete category
router.delete(
  "/:categoryId",
  auth(UserRole.ADMIN),
  CategoryController.deleteCategory,
);

export const categoryRoutes = router;
