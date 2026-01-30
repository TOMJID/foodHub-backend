import { Router } from "express";
import { UserController } from "./user.controller";
import auth from "../../middleware/auth.middleware";

const router = Router();

//? Protected user routes
router.use(auth());

router.get("/me", UserController.getMyProfile);
router.patch("/me", UserController.updateMyProfile);

export const userRoutes = router;
