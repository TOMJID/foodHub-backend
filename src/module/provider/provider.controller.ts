import { NextFunction, Request, Response } from "express";
import { ProviderService } from "./provider.server";

//? create new provider profile
const createProviderProfile = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
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
    next(error);
  }
};

//? get provider profile by provider id
const getProviderProfile = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
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
    next(error);
  }
};

//? get all providers
const getAllProviders = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const result = await ProviderService.getAllProviders();
    res.json({
      success: true,
      data: result,
    });
  } catch (error: any) {
    next(error);
  }
};

//? get my provider profile (for logged in provider)
const getMyProviderProfile = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      res.status(401).json({ error: "Unauthorized" });
      return;
    }

    const result = await ProviderService.getProviderProfileByUserId(userId);
    if (!result) {
      res
        .status(404)
        .json({ success: false, error: "Provider profile not found" });
      return;
    }

    res.json({
      success: true,
      data: result,
    });
  } catch (error: any) {
    next(error);
  }
};

//? update provider profile
const updateProviderProfile = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      res.status(401).json({ error: "Unauthorized" });
      return;
    }

    const profile = await ProviderService.getProviderProfileByUserId(userId);
    if (!profile) {
      res.status(404).json({ success: false, error: "Profile not found" });
      return;
    }

    const result = await ProviderService.updateProviderProfile(
      profile.id,
      req.body,
    );

    res.json({
      success: true,
      data: result,
    });
  } catch (error: any) {
    next(error);
  }
};

export const ProviderController = {
  createProviderProfile,
  getProviderProfile,
  getMyProviderProfile,
  getAllProviders,
  updateProviderProfile,
};
