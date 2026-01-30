import { NextFunction, Request, Response } from "express";
import { auth as betterAuth } from "../lib/auth";

//? setting types for role
export const enum UserRole {
  USER = "customer",
  ADMIN = "admin",
  PROVIDER = "provider",
}

//? setting global types for user
declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        email: string;
        name: string;
        role: string;
        emailVerified: boolean;
        isActive: boolean;
      };
    }
  }
}

const auth = (...roles: UserRole[]) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      //* getting user session
      const session = await betterAuth.api.getSession({
        headers: req.headers as any,
      });
      //? if there aren't any session
      if (!session) {
        res.status(401).json({
          success: false,
          message: "You are not authorized because of session",
        });
        return;
      }
      //? email verification check
      if (!session.user.emailVerified) {
        res.status(403).json({
          success: false,
          message: "You are not authorized because you email isn't Verified",
        });
        return;
      }

      //? account status check (Suspend/Activate)
      if (session.user.isActive === false) {
        res.status(403).json({
          success: false,
          message:
            "Your account has been suspended. Please contact administration.",
        });
        return;
      }

      //? separating user data
      req.user = {
        id: session.user.id,
        email: session.user.email,
        name: session.user.name,
        role: session.user.role as string,
        emailVerified: session.user.emailVerified,
        isActive: session.user.isActive as boolean,
      };

      if (roles.length && !roles.includes(req.user.role as UserRole)) {
        res.status(403).json({
          success: false,
          message: `Forbidden: You do not have the required permissions (${roles.join(", ")}) to access this resource.`,
        });
        return;
      }

      next();
    } catch (error) {
      next(error);
    }
  };
};

export default auth;
