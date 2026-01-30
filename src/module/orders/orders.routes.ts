import { Router } from "express";
import { OrderController } from "./orders.controller";
import auth, { UserRole } from "../../middleware/auth.middleware";

const router = Router();

//? Place a new order
router.post("/", auth(), OrderController.placeOrder);

//? Get orders (Customer sees theirs, Provider sees their restaurant's, Admin sees all)
router.get("/my", auth(), OrderController.getMyOrders);

//? Get order by ID
router.get("/:orderId", auth(), OrderController.getOrderById);

//? Update order status
router.patch(
  "/status/:orderId",
  auth(UserRole.PROVIDER, UserRole.ADMIN),
  OrderController.updateStatus,
);

export const orderRoutes = router;
