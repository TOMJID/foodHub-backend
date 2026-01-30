import { prisma } from "../../lib/prisma";
import { OrderStatus } from "../../../generated/prisma/enums";

interface ICreateOrderItem {
  mealId: string;
  quantity: number;
}

interface ICreateOrderInput {
  customerId: string;
  providerId: string;
  deliveryAddress: string;
  items: ICreateOrderItem[];
}

//? create order
const createOrder = async (data: ICreateOrderInput) => {
  return await prisma.$transaction(async (timeline) => {
    //! Calculate total amount and verify meals
    let total = 0;
    const itemsWithPrice = [];

    for (const item of data.items) {
      const meal = await timeline.meal.findUnique({
        where: { id: item.mealId },
      });

      if (!meal) throw new Error(`Meal with ID ${item.mealId} not found`);
      if (!meal.isAvailable)
        throw new Error(`Meal ${meal.name} is not available`);

      //? Verify that the meal belongs to the requested provider
      if (meal.providerId !== data.providerId) {
        throw new Error(
          `Meal ${meal.name} does not belong to the selected provider`,
        );
      }

      const price = Number(meal.price);
      total += price * item.quantity;

      itemsWithPrice.push({
        mealId: item.mealId,
        quantity: item.quantity,
        priceAtTime: meal.price,
      });
    }

    //? 2. Create the order
    const order = await timeline.order.create({
      data: {
        customerId: data.customerId,
        providerId: data.providerId,
        deliveryAddress: data.deliveryAddress,
        totalAmount: total,
        status: OrderStatus.placed,
        items: {
          create: itemsWithPrice,
        },
      },
      include: {
        items: true,
      },
    });

    return order;
  });
};

//? get orders for customer
const getOrdersForCustomer = async (customerId: string) => {
  return await prisma.order.findMany({
    where: { customerId },
    include: {
      items: { include: { meal: true } },
      provider: true,
    },
    orderBy: { createdAt: "desc" },
  });
};

//? get orders for provider
const getOrdersForProvider = async (providerId: string) => {
  return await prisma.order.findMany({
    where: { providerId },
    include: {
      items: { include: { meal: true } },
      customer: true,
    },
    orderBy: { createdAt: "desc" },
  });
};

//? get all orders
const getAllOrders = async () => {
  return await prisma.order.findMany({
    include: {
      items: { include: { meal: true } },
      customer: true,
      provider: true,
    },
    orderBy: { createdAt: "desc" },
  });
};

//? get order by id
const getOrderById = async (id: string) => {
  return await prisma.order.findUnique({
    where: { id },
    include: {
      items: { include: { meal: true } },
      customer: true,
      provider: true,
    },
  });
};

//? update order status
const updateOrderStatus = async (id: string, status: OrderStatus) => {
  return await prisma.order.update({
    where: { id },
    data: { status },
  });
};

export const OrderService = {
  createOrder,
  getOrdersForCustomer,
  getOrdersForProvider,
  getAllOrders,
  getOrderById,
  updateOrderStatus,
};
