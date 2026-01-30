import { Request, Response } from "express";
import { ProviderService } from "./provider.server";

//? create new provider profile
const createProviderProfile = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;

    if (!userId) {
      res.status(401).json({ error: "Unauthorized: login or sighup first" });
      return;
    }

    const result = await ProviderService.createProviderProfile({
      ...req.body,
      userId,
    });

    res.status(201).json({
      success: true,
      data: result,
    });
  } catch (error: any) {
    console.error(error);
    res.status(500).json({
      success: false,
      error: error.message || "Failed to create provider profile",
    });
  }
};

//? get provider profile by provider id
const getProviderProfile = async (req: Request, res: Response) => {
  try {
    const { providerId } = req.params;
    const result = await ProviderService.getProviderProfile(
      providerId as string,
    );
    if (!result) {
      res
        .status(404)
        .json({ success: false, error: "Provider profile disen't exist" });
      return;
    }
    res.json({
      success: true,
      data: result,
    });
  } catch (error: any) {
    console.error(error);
    res.status(500).json({
      success: false,
      error: error.message || "Failed to retrieve provider profile",
    });
  }
};

//? get all providers
const getAllProviders = async (req: Request, res: Response) => {
  try {
    const result = await ProviderService.getAllProviders();
    res.json({
      success: true,
      data: result,
    });
  } catch (error: any) {
    console.error(error);
    res.status(500).json({
      success: false,
      error: error.message || "Failed to retrieve providers",
    });
  }
};

export const ProviderController = {
  createProviderProfile,
  getProviderProfile,
  getAllProviders,
};
