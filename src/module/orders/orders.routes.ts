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

//? Customer cancels their own order
router.patch("/cancel/:orderId", auth(), OrderController.cancelOrder);

export const orderRoutes = router;
