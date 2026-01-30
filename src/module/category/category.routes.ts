import { Router } from "express";
import { CategoryController } from "./category.controller";
import auth, { UserRole } from "../../middleware/auth.middleware";

const router = Router();

//? create new category
router.post("/", auth(UserRole.ADMIN), CategoryController.createCategory);

//? get all categories
router.get(
  "/",
  auth(UserRole.ADMIN, UserRole.PROVIDER),
  CategoryController.getAllCategories,
);

//? get category by id
router.get(
  "/:categoryId",
  auth(UserRole.ADMIN, UserRole.PROVIDER),
  CategoryController.getCategoryById,
);

export const categoryRoutes = router;
