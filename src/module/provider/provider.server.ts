import { prisma } from "../../lib/prisma";
import { ProviderProfileUncheckedCreateInput } from "../../../generated/prisma/models";

//? create new provider profile
const createProviderProfile = async (
  data: ProviderProfileUncheckedCreateInput,
) => {
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
  });
};

//? get all providers
const getAllProviders = async () => {
  return await prisma.providerProfile.findMany();
};

export const ProviderService = {
  createProviderProfile,
  getProviderProfile,
  getAllProviders,
};
