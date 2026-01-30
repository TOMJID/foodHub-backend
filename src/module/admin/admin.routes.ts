import { Router } from "express";
import { AdminController } from "./admin.controller";
import auth, { UserRole } from "../../middleware/auth.middleware";

const router = Router();

//? Admin only routes
router.use(auth(UserRole.ADMIN));

//? Get Platform Statistics
router.get("/stats", AdminController.getStats);

//? User Management
router.get("/users", AdminController.getAllUsers);
router.patch("/users/:userId/status", AdminController.updateUserStatus);

export const adminRoutes = router;
