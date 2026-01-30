import { Request, Response } from "express";
import { ProviderService } from "./provider.server";

//? create new provider profile
const createProviderProfile = async (req: Request, res: Response) => {
  try {
    const result = await ProviderService.createProviderProfile(req.body);
    res.status(201).json(result);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: "Failed to create provider profile",
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
      res.status(404).json({ error: "Provider profile not found" });
      return;
    }
    res.json(result);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: "Failed to retrieve provider profile",
    });
  }
};

//? get all providers
const getAllProviders = async (req: Request, res: Response) => {
  try {
    const result = await ProviderService.getAllProviders();
    res.json(result);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: "Failed to retrieve providers",
    });
  }
};

export const ProviderController = {
  createProviderProfile,
  getProviderProfile,
  getAllProviders,
};
