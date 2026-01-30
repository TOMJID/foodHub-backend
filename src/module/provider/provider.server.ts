import { prisma } from "../../lib/prisma";
import { ProviderProfileCreateInput } from "../../../generated/prisma/models";

//? create new provider profile
const createProviderProfile = async (data: ProviderProfileCreateInput) => {
  return await prisma.providerProfile.create({
    data,
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
