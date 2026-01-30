import { prisma } from "../../lib/prisma";
import { OrderStatus } from "../../../generated/prisma/enums";

const createReview = async (data: {
  customerId: string;
  mealId: string;
  rating: number;
  comment?: string;
}) => {
  //* checks if user has ordered this meal before
  const previousOrder = await prisma.order.findFirst({
    where: {
      customerId: data.customerId,
      items: {
        some: { mealId: data.mealId },
      },
      status: OrderStatus.delivered,
    },
  });

  if (!previousOrder) {
    throw new Error(
      "You can only review meals you have successfully ordered and received.",
    );
  }

  return await prisma.review.create({
    data,
  });
};

const getReviewsByMeal = async (mealId: string) => {
  return await prisma.review.findMany({
    where: { mealId },
    include: {
      customer: {
        select: {
          id: true,
          name: true,
          image: true,
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });
};

const getReviewsByCustomer = async (customerId: string) => {
  return await prisma.review.findMany({
    where: { customerId },
    include: {
      meal: true,
    },
    orderBy: { createdAt: "desc" },
  });
};

const deleteReview = async (
  reviewId: string,
  userId: string,
  role?: string,
) => {
  const review = await prisma.review.findUnique({
    where: { id: reviewId },
  });

  if (!review) {
    throw new Error("Review not found");
  }

  //? Only owner or admin can delete
  if (role !== "ADMIN" && review.customerId !== userId) {
    throw new Error("You are not authorized to delete this review");
  }

  return await prisma.review.delete({
    where: { id: reviewId },
  });
};

export const ReviewService = {
  createReview,
  getReviewsByMeal,
  getReviewsByCustomer,
  deleteReview,
};
