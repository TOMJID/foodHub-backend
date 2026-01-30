import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { prisma } from "./prisma";

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),

  trustedOrigins: [process.env.FRONTEND_URL!],

  //? Extending the User Model
  user: {
    additionalFields: {
      role: {
        type: "string",
        defaultValue: "customer",
      },
      isActive: {
        type: "boolean",
        defaultValue: true,
      },
      address: {
        type: "string",
        required: false,
      },
    },
  },

  //? Email and password config
  emailAndPassword: {
    enabled: true,
    autoSignIn: true,
  },
});
