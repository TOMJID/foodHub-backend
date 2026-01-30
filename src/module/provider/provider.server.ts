import { prisma } from "../../lib/prisma";
import { ProviderProfileUncheckedCreateInput } from "../../../generated/prisma/models";

//? create new provider profile
const createProviderProfile = async (
  data: ProviderProfileUncheckedCreateInput,
) => {
  const existingProfile = await prisma.providerProfile.findUnique({
    where: { userId: data.userId },
  });

  if (existingProfile) {
    throw new Error("You already have a provider profile.");
  }

  return await prisma.$transaction(async (timeline) => {
    const profile = await timeline.providerProfile.create({
      data,
    });

    await timeline.user.update({
      where: { id: data.userId },
      data: { role: "provider" },
    });

    return profile;
  });
};

//? get provider profile by provider id
const getProviderProfile = async (id: string) => {
  return await prisma.providerProfile.findUnique({
    where: { id },
    include: {
      user: {
        select: {
          name: true,
          email: true,
          image: true,
        },
      },
      meals: {
        where: { isAvailable: true }, // Only show available meals for public profile
        include: {
          category: true,
        },
      },
    },
  });
};

//? get all providers
const getAllProviders = async () => {
  return await prisma.providerProfile.findMany({
    include: {
      user: {
        select: {
          name: true,
          image: true,
        },
      },
    },
  });
};

//? get provider profile by user id
const getProviderProfileByUserId = async (userId: string) => {
  return await prisma.providerProfile.findUnique({
    where: { userId },
    include: {
      user: {
        select: {
          name: true,
          email: true,
          image: true,
        },
      },
      meals: {
        include: {
          category: true,
        },
      },
    },
  });
};

//? update provider profile
const updateProviderProfile = async (id: string, data: any) => {
  return await prisma.providerProfile.update({
    where: { id },
    data,
  });
};

export const ProviderService = {
  createProviderProfile,
  getProviderProfile,
  getProviderProfileByUserId,
  getAllProviders,
  updateProviderProfile,
};
