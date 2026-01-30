import { NextFunction, Request, Response } from "express";
import { AdminService } from "./admin.server";

//? Get all users
const getAllUsers = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const users = await AdminService.getAllUsers();
    res.json({
      success: true,
      data: users,
    });
  } catch (error) {
    next(error);
  }
};

//? Update user status (Suspend/Activate)
const updateUserStatus = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { userId } = req.params;
    const { isActive } = req.body;

    if (typeof isActive !== "boolean") {
      res
        .status(400)
        .json({ success: false, error: "isActive must be a boolean" });
      return;
    }

    const updatedUser = await AdminService.updateUserStatus(
      userId as string,
      isActive,
    );
    res.json({
      success: true,
      message: `User ${isActive ? "activated" : "suspended"} successfully`,
      data: updatedUser,
    });
  } catch (error) {
    next(error);
  }
};

//? Get Platform Stats
const getStats = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const stats = await AdminService.getPlatformStats();
    res.json({
      success: true,
      data: stats,
    });
  } catch (error) {
    next(error);
  }
};

export const AdminController = {
  getAllUsers,
  updateUserStatus,
  getStats,
};
