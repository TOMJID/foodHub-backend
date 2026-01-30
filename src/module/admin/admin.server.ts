import { prisma } from "../../lib/prisma";

//? Get all users with their profiles (if they are providers)
const getAllUsers = async () => {
  return await prisma.user.findMany({
    include: {
      providerProfile: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });
};

//? Update user status (Active/Suspended)
const updateUserStatus = async (userId: string, isActive: boolean) => {
  return await prisma.user.update({
    where: { id: userId },
    data: { isActive },
  });
};

//? Get Platform Statistics
const getPlatformStats = async () => {
  const [userCount, providerCount, mealCount, orderCount, totalRevenue] =
    await Promise.all([
      prisma.user.count(),
      prisma.providerProfile.count(),
      prisma.meal.count(),
      prisma.order.count(),
      prisma.order.aggregate({
        _sum: {
          totalAmount: true,
        },
        where: {
          status: "delivered",
        },
      }),
    ]);

  return {
    totalUsers: userCount,
    totalProviders: providerCount,
    totalMeals: mealCount,
    totalOrders: orderCount,
    deliveredRevenue: totalRevenue._sum.totalAmount || 0,
  };
};

export const AdminService = {
  getAllUsers,
  updateUserStatus,
  getPlatformStats,
};
