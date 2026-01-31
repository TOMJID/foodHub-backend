import { NextFunction, Request, Response } from "express";
import { OrderService } from "./orders.server";
import { prisma } from "../../lib/prisma";
import { OrderStatus } from "../../../generated/prisma/enums";
import { UserRole } from "../../middleware/auth.middleware";

//? User places an order
const placeOrder = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const customerId = req.user?.id;
    if (!customerId) {
      res.status(401).json({ success: false, error: "Unauthorized" });
      return;
    }

    const order = await OrderService.createOrder({
      ...req.body,
      customerId,
    });

    res.status(201).json({
      success: true,
      data: order,
    });
  } catch (error) {
    next(error);
  }
};

//? Get orders (based on role)
const getMyOrders = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.user?.id;
    const role = req.user?.role;

    if (!userId) {
      res.status(401).json({ success: false, error: "Unauthorized" });
      return;
    }

    let orders;
    if (role === UserRole.ADMIN) {
      orders = await OrderService.getAllOrders();
    } else if (role === UserRole.PROVIDER) {
      const profile = await prisma.providerProfile.findUnique({
        where: { userId: userId as string },
      });
      if (!profile) {
        res
          .status(404)
          .json({ success: false, error: "Provider profile not found" });
        return;
      }
      orders = await OrderService.getOrdersForProvider(profile.id);
    } else {
      orders = await OrderService.getOrdersForCustomer(userId);
    }

    res.json({
      success: true,
      data: orders,
    });
  } catch (error) {
    next(error);
  }
};

//? Update status (Provider or Admin only)
const updateStatus = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { orderId } = req.params;
    const { status } = req.body;
    const userId = req.user?.id;
    const role = req.user?.role;

    const order = await OrderService.getOrderById(orderId as string);
    if (!order) {
      res.status(404).json({ success: false, error: "Order not found" });
      return;
    }

    //? Authorization check
    if (role !== UserRole.ADMIN) {
      const profile = await prisma.providerProfile.findUnique({
        where: { userId: userId as string },
      });
      if (!profile || order.providerId !== profile.id) {
        res.status(403).json({
          success: false,
          error: "Forbidden: You don't own this restaurant",
        });
        return;
      }
    }

    const updatedOrder = await OrderService.updateOrderStatus(
      orderId as string,
      status as OrderStatus,
    );
    res.json({
      success: true,
      data: updatedOrder,
    });
  } catch (error) {
    next(error);
  }
};
const getOrderById = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { orderId } = req.params;
    const userId = req.user?.id;
    const role = req.user?.role;

    const order = await OrderService.getOrderById(orderId as string);
    if (!order) {
      res.status(404).json({ success: false, error: "Order not found" });
      return;
    }

    //? Authorization check: Admin, the Provider who received it, or the Customer who placed it
    if (role !== UserRole.ADMIN && order.customerId !== userId) {
      const profile = await prisma.providerProfile.findUnique({
        where: { userId: userId as string },
      });
      if (!profile || order.providerId !== profile.id) {
        res.status(403).json({
          success: false,
          error: "Forbidden: You are not authorized to view this order",
        });
        return;
      }
    }

    res.json({
      success: true,
      data: order,
    });
  } catch (error) {
    next(error);
  }
};
//? Customer cancels their own order (only if status is "placed")
const cancelOrder = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { orderId } = req.params;
    const userId = req.user?.id;

    if (!userId) {
      res.status(401).json({ success: false, error: "Unauthorized" });
      return;
    }

    const order = await OrderService.getOrderById(orderId as string);
    if (!order) {
      res.status(404).json({ success: false, error: "Order not found" });
      return;
    }

    //? Only the customer who placed the order can cancel it
    if (order.customerId !== userId) {
      res.status(403).json({
        success: false,
        error: "Forbidden: You can only cancel your own orders",
      });
      return;
    }

    //? Can only cancel if status is "placed"
    if (order.status !== "placed") {
      res.status(400).json({
        success: false,
        error: "Cannot cancel order: Kitchen has already started preparing",
      });
      return;
    }

    const cancelledOrder = await OrderService.updateOrderStatus(
      orderId as string,
      OrderStatus.cancelled,
    );

    res.json({
      success: true,
      data: cancelledOrder,
      message: "Order cancelled successfully",
    });
  } catch (error) {
    next(error);
  }
};

export const OrderController = {
  placeOrder,
  getMyOrders,
  getOrderById,
  updateStatus,
  cancelOrder,
};
