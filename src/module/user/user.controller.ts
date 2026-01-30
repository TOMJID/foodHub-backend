import { NextFunction, Request, Response } from "express";
import { UserService } from "./user.server";

//? Get my profile
const getMyProfile = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      res.status(401).json({ success: false, error: "Unauthorized" });
      return;
    }

    const user = await UserService.getUserProfile(userId);
    res.json({
      success: true,
      data: user,
    });
  } catch (error) {
    next(error);
  }
};

//? Update my profile
const updateMyProfile = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      res.status(401).json({ success: false, error: "Unauthorized" });
      return;
    }

    const updatedUser = await UserService.updateUserProfile(userId, req.body);
    res.json({
      success: true,
      message: "Profile updated successfully",
      data: updatedUser,
    });
  } catch (error) {
    next(error);
  }
};

export const UserController = {
  getMyProfile,
  updateMyProfile,
};
