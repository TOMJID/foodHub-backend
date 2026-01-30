import { prisma } from "../../lib/prisma";

//? Get user profile
const getUserProfile = async (id: string) => {
  return await prisma.user.findUnique({
    where: { id },
    include: {
      providerProfile: true, // Include if they are a provider
    },
  });
};

//? Update user profile
const updateUserProfile = async (
  id: string,
  data: { name?: string; image?: string; address?: string },
) => {
  return await prisma.user.update({
    where: { id },
    data,
  });
};

export const UserService = {
  getUserProfile,
  updateUserProfile,
};
