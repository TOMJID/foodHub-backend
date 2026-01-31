var __defProp = Object.defineProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};

// src/server.ts
import "dotenv/config";

// src/app.ts
import express from "express";
import cors from "cors";
import { toNodeHandler } from "better-auth/node";

// src/lib/auth.ts
import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";

// src/lib/prisma.ts
import { PrismaPg } from "@prisma/adapter-pg";

// generated/prisma/client.ts
import * as path from "path";
import { fileURLToPath } from "url";

// generated/prisma/internal/class.ts
import * as runtime from "@prisma/client/runtime/client";
var config = {
  "previewFeatures": [],
  "clientVersion": "7.3.0",
  "engineVersion": "9d6ad21cbbceab97458517b147a6a09ff43aa735",
  "activeProvider": "postgresql",
  "inlineSchema": 'generator client {\n  provider = "prisma-client"\n  output   = "../generated/prisma"\n}\n\ndatasource db {\n  provider = "postgresql"\n}\n\nmodel User {\n  id            String    @id\n  name          String\n  email         String\n  emailVerified Boolean   @default(false)\n  image         String?\n  address       String?\n  createdAt     DateTime  @default(now())\n  updatedAt     DateTime  @updatedAt\n  role          String?   @default("customer")\n  isActive      Boolean   @default(true)\n  sessions      Session[]\n  accounts      Account[]\n\n  //! relations\n  providerProfile ProviderProfile?\n  ordersPlaced    Order[]          @relation("CustomerOrders")\n  reviews         Review[]\n\n  @@unique([email])\n  @@map("user")\n}\n\nmodel Session {\n  id        String   @id\n  expiresAt DateTime\n  token     String\n  createdAt DateTime @default(now())\n  updatedAt DateTime @updatedAt\n  ipAddress String?\n  userAgent String?\n  userId    String\n  user      User     @relation(fields: [userId], references: [id], onDelete: Cascade)\n\n  @@unique([token])\n  @@index([userId])\n  @@map("session")\n}\n\nmodel Account {\n  id                    String    @id\n  accountId             String\n  providerId            String\n  userId                String\n  user                  User      @relation(fields: [userId], references: [id], onDelete: Cascade)\n  accessToken           String?\n  refreshToken          String?\n  idToken               String?\n  accessTokenExpiresAt  DateTime?\n  refreshTokenExpiresAt DateTime?\n  scope                 String?\n  password              String?\n  createdAt             DateTime  @default(now())\n  updatedAt             DateTime  @updatedAt\n\n  @@index([userId])\n  @@map("account")\n}\n\nmodel Verification {\n  id         String   @id\n  identifier String\n  value      String\n  expiresAt  DateTime\n  createdAt  DateTime @default(now())\n  updatedAt  DateTime @updatedAt\n\n  @@index([identifier])\n  @@map("verification")\n}\n\nmodel ProviderProfile {\n  id             String  @id @default(uuid())\n  userId         String  @unique\n  restaurantName String\n  cuisineType    String\n  address        String\n  coverImageUrl  String?\n\n  //! relation to User table\n  user   User    @relation(fields: [userId], references: [id], onDelete: Cascade)\n  meals  Meal[]\n  orders Order[]\n\n  @@map("provider_profile")\n}\n\nmodel Category {\n  id       String  @id @default(uuid())\n  name     String  @unique\n  imageUrl String?\n\n  //? relations\n  meals Meal[]\n\n  @@map("category")\n}\n\nmodel Meal {\n  id          String   @id @default(uuid())\n  providerId  String\n  categoryId  String\n  name        String\n  description String?\n  price       Decimal  @db.Decimal(10, 2)\n  imageUrl    String?\n  isAvailable Boolean  @default(true)\n  createdAt   DateTime @default(now())\n  updatedAt   DateTime @updatedAt\n\n  //! relations\n  provider   ProviderProfile @relation(fields: [providerId], references: [id], onDelete: Cascade)\n  category   Category        @relation(fields: [categoryId], references: [id])\n  orderItems OrderItem[]\n  reviews    Review[]\n\n  @@map("meal")\n}\n\nenum OrderStatus {\n  placed\n  preparing\n  out_for_delivery\n  delivered\n  cancelled\n}\n\nmodel Order {\n  id              String      @id @default(uuid())\n  customerId      String\n  providerId      String\n  deliveryAddress String\n  totalAmount     Decimal     @db.Decimal(10, 2)\n  status          OrderStatus @default(placed)\n  createdAt       DateTime    @default(now())\n  updatedAt       DateTime    @updatedAt\n\n  //! relations\n  customer User            @relation("CustomerOrders", fields: [customerId], references: [id])\n  provider ProviderProfile @relation(fields: [providerId], references: [id])\n  items    OrderItem[]\n\n  @@map("order")\n}\n\nmodel OrderItem {\n  id          String  @id @default(uuid())\n  orderId     String\n  mealId      String\n  quantity    Int\n  priceAtTime Decimal @db.Decimal(10, 2)\n\n  //? relations\n  order Order @relation(fields: [orderId], references: [id], onDelete: Cascade)\n  meal  Meal  @relation(fields: [mealId], references: [id])\n\n  @@map("order_item")\n}\n\nmodel Review {\n  id         String   @id @default(uuid())\n  customerId String\n  mealId     String\n  rating     Int\n  comment    String?\n  createdAt  DateTime @default(now())\n\n  //? relations\n  customer User @relation(fields: [customerId], references: [id])\n  meal     Meal @relation(fields: [mealId], references: [id])\n\n  @@unique([customerId, mealId])\n  @@map("review")\n}\n',
  "runtimeDataModel": {
    "models": {},
    "enums": {},
    "types": {}
  }
};
config.runtimeDataModel = JSON.parse('{"models":{"User":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"name","kind":"scalar","type":"String"},{"name":"email","kind":"scalar","type":"String"},{"name":"emailVerified","kind":"scalar","type":"Boolean"},{"name":"image","kind":"scalar","type":"String"},{"name":"address","kind":"scalar","type":"String"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"},{"name":"role","kind":"scalar","type":"String"},{"name":"isActive","kind":"scalar","type":"Boolean"},{"name":"sessions","kind":"object","type":"Session","relationName":"SessionToUser"},{"name":"accounts","kind":"object","type":"Account","relationName":"AccountToUser"},{"name":"providerProfile","kind":"object","type":"ProviderProfile","relationName":"ProviderProfileToUser"},{"name":"ordersPlaced","kind":"object","type":"Order","relationName":"CustomerOrders"},{"name":"reviews","kind":"object","type":"Review","relationName":"ReviewToUser"}],"dbName":"user"},"Session":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"expiresAt","kind":"scalar","type":"DateTime"},{"name":"token","kind":"scalar","type":"String"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"},{"name":"ipAddress","kind":"scalar","type":"String"},{"name":"userAgent","kind":"scalar","type":"String"},{"name":"userId","kind":"scalar","type":"String"},{"name":"user","kind":"object","type":"User","relationName":"SessionToUser"}],"dbName":"session"},"Account":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"accountId","kind":"scalar","type":"String"},{"name":"providerId","kind":"scalar","type":"String"},{"name":"userId","kind":"scalar","type":"String"},{"name":"user","kind":"object","type":"User","relationName":"AccountToUser"},{"name":"accessToken","kind":"scalar","type":"String"},{"name":"refreshToken","kind":"scalar","type":"String"},{"name":"idToken","kind":"scalar","type":"String"},{"name":"accessTokenExpiresAt","kind":"scalar","type":"DateTime"},{"name":"refreshTokenExpiresAt","kind":"scalar","type":"DateTime"},{"name":"scope","kind":"scalar","type":"String"},{"name":"password","kind":"scalar","type":"String"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"}],"dbName":"account"},"Verification":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"identifier","kind":"scalar","type":"String"},{"name":"value","kind":"scalar","type":"String"},{"name":"expiresAt","kind":"scalar","type":"DateTime"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"}],"dbName":"verification"},"ProviderProfile":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"userId","kind":"scalar","type":"String"},{"name":"restaurantName","kind":"scalar","type":"String"},{"name":"cuisineType","kind":"scalar","type":"String"},{"name":"address","kind":"scalar","type":"String"},{"name":"coverImageUrl","kind":"scalar","type":"String"},{"name":"user","kind":"object","type":"User","relationName":"ProviderProfileToUser"},{"name":"meals","kind":"object","type":"Meal","relationName":"MealToProviderProfile"},{"name":"orders","kind":"object","type":"Order","relationName":"OrderToProviderProfile"}],"dbName":"provider_profile"},"Category":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"name","kind":"scalar","type":"String"},{"name":"imageUrl","kind":"scalar","type":"String"},{"name":"meals","kind":"object","type":"Meal","relationName":"CategoryToMeal"}],"dbName":"category"},"Meal":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"providerId","kind":"scalar","type":"String"},{"name":"categoryId","kind":"scalar","type":"String"},{"name":"name","kind":"scalar","type":"String"},{"name":"description","kind":"scalar","type":"String"},{"name":"price","kind":"scalar","type":"Decimal"},{"name":"imageUrl","kind":"scalar","type":"String"},{"name":"isAvailable","kind":"scalar","type":"Boolean"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"},{"name":"provider","kind":"object","type":"ProviderProfile","relationName":"MealToProviderProfile"},{"name":"category","kind":"object","type":"Category","relationName":"CategoryToMeal"},{"name":"orderItems","kind":"object","type":"OrderItem","relationName":"MealToOrderItem"},{"name":"reviews","kind":"object","type":"Review","relationName":"MealToReview"}],"dbName":"meal"},"Order":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"customerId","kind":"scalar","type":"String"},{"name":"providerId","kind":"scalar","type":"String"},{"name":"deliveryAddress","kind":"scalar","type":"String"},{"name":"totalAmount","kind":"scalar","type":"Decimal"},{"name":"status","kind":"enum","type":"OrderStatus"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"},{"name":"customer","kind":"object","type":"User","relationName":"CustomerOrders"},{"name":"provider","kind":"object","type":"ProviderProfile","relationName":"OrderToProviderProfile"},{"name":"items","kind":"object","type":"OrderItem","relationName":"OrderToOrderItem"}],"dbName":"order"},"OrderItem":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"orderId","kind":"scalar","type":"String"},{"name":"mealId","kind":"scalar","type":"String"},{"name":"quantity","kind":"scalar","type":"Int"},{"name":"priceAtTime","kind":"scalar","type":"Decimal"},{"name":"order","kind":"object","type":"Order","relationName":"OrderToOrderItem"},{"name":"meal","kind":"object","type":"Meal","relationName":"MealToOrderItem"}],"dbName":"order_item"},"Review":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"customerId","kind":"scalar","type":"String"},{"name":"mealId","kind":"scalar","type":"String"},{"name":"rating","kind":"scalar","type":"Int"},{"name":"comment","kind":"scalar","type":"String"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"customer","kind":"object","type":"User","relationName":"ReviewToUser"},{"name":"meal","kind":"object","type":"Meal","relationName":"MealToReview"}],"dbName":"review"}},"enums":{},"types":{}}');
async function decodeBase64AsWasm(wasmBase64) {
  const { Buffer: Buffer2 } = await import("buffer");
  const wasmArray = Buffer2.from(wasmBase64, "base64");
  return new WebAssembly.Module(wasmArray);
}
config.compilerWasm = {
  getRuntime: async () => await import("@prisma/client/runtime/query_compiler_fast_bg.postgresql.mjs"),
  getQueryCompilerWasmModule: async () => {
    const { wasm } = await import("@prisma/client/runtime/query_compiler_fast_bg.postgresql.wasm-base64.mjs");
    return await decodeBase64AsWasm(wasm);
  },
  importName: "./query_compiler_fast_bg.js"
};
function getPrismaClientClass() {
  return runtime.getPrismaClient(config);
}

// generated/prisma/internal/prismaNamespace.ts
var prismaNamespace_exports = {};
__export(prismaNamespace_exports, {
  AccountScalarFieldEnum: () => AccountScalarFieldEnum,
  AnyNull: () => AnyNull2,
  CategoryScalarFieldEnum: () => CategoryScalarFieldEnum,
  DbNull: () => DbNull2,
  Decimal: () => Decimal2,
  JsonNull: () => JsonNull2,
  MealScalarFieldEnum: () => MealScalarFieldEnum,
  ModelName: () => ModelName,
  NullTypes: () => NullTypes2,
  NullsOrder: () => NullsOrder,
  OrderItemScalarFieldEnum: () => OrderItemScalarFieldEnum,
  OrderScalarFieldEnum: () => OrderScalarFieldEnum,
  PrismaClientInitializationError: () => PrismaClientInitializationError2,
  PrismaClientKnownRequestError: () => PrismaClientKnownRequestError2,
  PrismaClientRustPanicError: () => PrismaClientRustPanicError2,
  PrismaClientUnknownRequestError: () => PrismaClientUnknownRequestError2,
  PrismaClientValidationError: () => PrismaClientValidationError2,
  ProviderProfileScalarFieldEnum: () => ProviderProfileScalarFieldEnum,
  QueryMode: () => QueryMode,
  ReviewScalarFieldEnum: () => ReviewScalarFieldEnum,
  SessionScalarFieldEnum: () => SessionScalarFieldEnum,
  SortOrder: () => SortOrder,
  Sql: () => Sql2,
  TransactionIsolationLevel: () => TransactionIsolationLevel,
  UserScalarFieldEnum: () => UserScalarFieldEnum,
  VerificationScalarFieldEnum: () => VerificationScalarFieldEnum,
  defineExtension: () => defineExtension,
  empty: () => empty2,
  getExtensionContext: () => getExtensionContext,
  join: () => join2,
  prismaVersion: () => prismaVersion,
  raw: () => raw2,
  sql: () => sql
});
import * as runtime2 from "@prisma/client/runtime/client";
var PrismaClientKnownRequestError2 = runtime2.PrismaClientKnownRequestError;
var PrismaClientUnknownRequestError2 = runtime2.PrismaClientUnknownRequestError;
var PrismaClientRustPanicError2 = runtime2.PrismaClientRustPanicError;
var PrismaClientInitializationError2 = runtime2.PrismaClientInitializationError;
var PrismaClientValidationError2 = runtime2.PrismaClientValidationError;
var sql = runtime2.sqltag;
var empty2 = runtime2.empty;
var join2 = runtime2.join;
var raw2 = runtime2.raw;
var Sql2 = runtime2.Sql;
var Decimal2 = runtime2.Decimal;
var getExtensionContext = runtime2.Extensions.getExtensionContext;
var prismaVersion = {
  client: "7.3.0",
  engine: "9d6ad21cbbceab97458517b147a6a09ff43aa735"
};
var NullTypes2 = {
  DbNull: runtime2.NullTypes.DbNull,
  JsonNull: runtime2.NullTypes.JsonNull,
  AnyNull: runtime2.NullTypes.AnyNull
};
var DbNull2 = runtime2.DbNull;
var JsonNull2 = runtime2.JsonNull;
var AnyNull2 = runtime2.AnyNull;
var ModelName = {
  User: "User",
  Session: "Session",
  Account: "Account",
  Verification: "Verification",
  ProviderProfile: "ProviderProfile",
  Category: "Category",
  Meal: "Meal",
  Order: "Order",
  OrderItem: "OrderItem",
  Review: "Review"
};
var TransactionIsolationLevel = runtime2.makeStrictEnum({
  ReadUncommitted: "ReadUncommitted",
  ReadCommitted: "ReadCommitted",
  RepeatableRead: "RepeatableRead",
  Serializable: "Serializable"
});
var UserScalarFieldEnum = {
  id: "id",
  name: "name",
  email: "email",
  emailVerified: "emailVerified",
  image: "image",
  address: "address",
  createdAt: "createdAt",
  updatedAt: "updatedAt",
  role: "role",
  isActive: "isActive"
};
var SessionScalarFieldEnum = {
  id: "id",
  expiresAt: "expiresAt",
  token: "token",
  createdAt: "createdAt",
  updatedAt: "updatedAt",
  ipAddress: "ipAddress",
  userAgent: "userAgent",
  userId: "userId"
};
var AccountScalarFieldEnum = {
  id: "id",
  accountId: "accountId",
  providerId: "providerId",
  userId: "userId",
  accessToken: "accessToken",
  refreshToken: "refreshToken",
  idToken: "idToken",
  accessTokenExpiresAt: "accessTokenExpiresAt",
  refreshTokenExpiresAt: "refreshTokenExpiresAt",
  scope: "scope",
  password: "password",
  createdAt: "createdAt",
  updatedAt: "updatedAt"
};
var VerificationScalarFieldEnum = {
  id: "id",
  identifier: "identifier",
  value: "value",
  expiresAt: "expiresAt",
  createdAt: "createdAt",
  updatedAt: "updatedAt"
};
var ProviderProfileScalarFieldEnum = {
  id: "id",
  userId: "userId",
  restaurantName: "restaurantName",
  cuisineType: "cuisineType",
  address: "address",
  coverImageUrl: "coverImageUrl"
};
var CategoryScalarFieldEnum = {
  id: "id",
  name: "name",
  imageUrl: "imageUrl"
};
var MealScalarFieldEnum = {
  id: "id",
  providerId: "providerId",
  categoryId: "categoryId",
  name: "name",
  description: "description",
  price: "price",
  imageUrl: "imageUrl",
  isAvailable: "isAvailable",
  createdAt: "createdAt",
  updatedAt: "updatedAt"
};
var OrderScalarFieldEnum = {
  id: "id",
  customerId: "customerId",
  providerId: "providerId",
  deliveryAddress: "deliveryAddress",
  totalAmount: "totalAmount",
  status: "status",
  createdAt: "createdAt",
  updatedAt: "updatedAt"
};
var OrderItemScalarFieldEnum = {
  id: "id",
  orderId: "orderId",
  mealId: "mealId",
  quantity: "quantity",
  priceAtTime: "priceAtTime"
};
var ReviewScalarFieldEnum = {
  id: "id",
  customerId: "customerId",
  mealId: "mealId",
  rating: "rating",
  comment: "comment",
  createdAt: "createdAt"
};
var SortOrder = {
  asc: "asc",
  desc: "desc"
};
var QueryMode = {
  default: "default",
  insensitive: "insensitive"
};
var NullsOrder = {
  first: "first",
  last: "last"
};
var defineExtension = runtime2.Extensions.defineExtension;

// generated/prisma/enums.ts
var OrderStatus = {
  placed: "placed",
  preparing: "preparing",
  out_for_delivery: "out_for_delivery",
  delivered: "delivered",
  cancelled: "cancelled"
};

// generated/prisma/client.ts
globalThis["__dirname"] = path.dirname(fileURLToPath(import.meta.url));
var PrismaClient = getPrismaClientClass();

// src/lib/prisma.ts
var connectionString = `${process.env.DATABASE_URL}`;
var adapter = new PrismaPg({ connectionString });
var prisma = new PrismaClient({ adapter });

// src/lib/auth.ts
import nodemailer from "nodemailer";
var transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  auth: {
    user: process.env.GMAIL_NAME,
    pass: process.env.GMAIL_APP_PASS
  }
});
var auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: "postgresql"
  }),
  baseURL: process.env.BETTER_AUTH_URL,
  trustedOrigins: [process.env.FRONTEND_URL],
  cookie: {
    namePrefix: "foodhub",
    attributes: {
      sameSite: "none",
      secure: true
    }
  },
  advanced: {
    useSecureCookies: true
  },
  //? Extending the User Model
  user: {
    additionalFields: {
      role: {
        type: "string",
        defaultValue: "customer"
      },
      isActive: {
        type: "boolean",
        defaultValue: true
      },
      address: {
        type: "string",
        required: false
      }
    }
  },
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET
    }
  },
  //? Email and password config
  emailAndPassword: {
    enabled: true,
    autoSignIn: false,
    requireEmailVerification: true,
    sendResetPassword: async ({ user, url, token }, request) => {
      try {
        const resetUrl = `${process.env.FRONTEND_URL}/reset-password?token=${token}`;
        const info = await transporter.sendMail({
          from: `"Food Hub" <${process.env.GMAIL_NAME}>`,
          to: user.email,
          subject: "Verify your email for Food Hub",
          html: `
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Verify Email</title>
</head>
<body style="font-family: Arial, sans-serif; background-color: #f4f4f5; margin: 0; padding: 20px;">
    <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
        
        <!-- Header -->
        <div style="background-color: #f97316; padding: 20px; text-align: center;">
            <h1 style="color: #ffffff; margin: 0; font-size: 24px;">Food Hub</h1>
        </div>

        <!-- Body -->
        <div style="padding: 40px 30px; color: #333333;">
            <h2 style="margin-top: 0; color: #111111;">Hello${user.name ? ", " + user.name : ""}!</h2>
            <p style="font-size: 16px; line-height: 1.5; margin-bottom: 24px;">
                We received a request to reset your password. If you didn't make this request, you can safely ignore this email.
            </p>
            
            <!-- Call to Action Button -->
            <div style="text-align: center; margin: 30px 0;">
                <a href="${resetUrl}" style="background-color: #f97316; color: #ffffff; padding: 14px 28px; text-decoration: none; border-radius: 4px; font-weight: bold; font-size: 16px; display: inline-block;">
                    Reset Password
                </a>
            </div>

            <p style="font-size: 14px; color: #666666; margin-top: 24px;">
                If the button above doesn't work, reset by clicking the link below:<br>
                <a href="${resetUrl}" style="color: #2563eb; word-break: break-all;">${resetUrl}</a>
            </p>

            <p style="font-size: 14px; color: #666666; margin-top: 24px;">
                This link will expire in 1 hour.
            </p>
        </div>

        <!-- Footer -->
        <div style="background-color: #f9fafb; padding: 20px; text-align: center; font-size: 12px; color: #9ca3af; border-top: 1px solid #e5e7eb;">
            <p style="margin: 0;">\xA9 ${(/* @__PURE__ */ new Date()).getFullYear()} Food Hub. All rights reserved.</p>
        </div>
    </div>
</body>
</html>
          `
        });
        console.log("Reset password email sent:", info.messageId);
      } catch (error) {
        console.error("Reset password email sending failed:", error.message);
        throw error;
      }
    }
  },
  //? Email verification config with nodemailer
  emailVerification: {
    sendOnSignUp: true,
    autoSignInAfterVerification: true,
    sendVerificationEmail: async ({ user, url, token }, request) => {
      if (process.env.NODE_ENV === "seeding") {
        return;
      }
      try {
        const verificationUrl = `${process.env.FRONTEND_URL}/verify-email?token=${token}`;
        const info = await transporter.sendMail({
          from: `"Food Hub" <${process.env.GMAIL_NAME}>`,
          to: user.email,
          subject: "Please verify your email for Food Hub",
          html: `
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Verify Email</title>
</head>
<body style="font-family: Arial, sans-serif; background-color: #f4f4f5; margin: 0; padding: 20px;">
    <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
        
        <!-- Header -->
        <div style="background-color: #f97316; padding: 20px; text-align: center;">
            <h1 style="color: #ffffff; margin: 0; font-size: 24px;">Food Hub</h1>
        </div>

        <!-- Body -->
        <div style="padding: 40px 30px; color: #333333;">
            <h2 style="margin-top: 0; color: #111111;">Hello${user.name ? ", " + user.name : ""}!</h2>
            <p style="font-size: 16px; line-height: 1.5; margin-bottom: 24px;">
                Thank you for signing up. To complete your registration and access your account, please verify your email address by clicking the button below.
            </p>
            
            <!-- Call to Action Button -->
            <div style="text-align: center; margin: 30px 0;">
                <a href="${verificationUrl}" style="background-color: #f97316; color: #ffffff; padding: 14px 28px; text-decoration: none; border-radius: 4px; font-weight: bold; font-size: 16px; display: inline-block;">
                    Verify Email Address
                </a>
            </div>

            <p style="font-size: 14px; color: #666666; margin-top: 24px;">
                If the button above doesn't work, verify by clicking the link below:<br>
                <a href="${verificationUrl}" style="color: #2563eb; word-break: break-all;">${verificationUrl}</a>
            </p>

            <p style="font-size: 14px; color: #666666; margin-top: 24px;">
                If you didn't create an account, you can safely ignore this email.
            </p>
        </div>

        <!-- Footer -->
        <div style="background-color: #f9fafb; padding: 20px; text-align: center; font-size: 12px; color: #9ca3af; border-top: 1px solid #e5e7eb;">
            <p style="margin: 0;">\xA9 ${(/* @__PURE__ */ new Date()).getFullYear()} Food Hub. All rights reserved.</p>
        </div>
    </div>
</body>
</html>
          `
        });
        console.log("Verification email sent:", info.messageId);
      } catch (error) {
        console.error("Email sending failed:", error.message);
        throw error;
      }
    }
  }
});

// src/module/meals/meals.routes.ts
import { Router } from "express";

// src/module/meals/meals.server.ts
var createMeal = async (data) => {
  return await prisma.meal.create({
    data
  });
};
var getAllMeals = async (filters) => {
  const { categoryId, minPrice, maxPrice, searchTerm } = filters;
  const where = {
    isAvailable: true
  };
  if (categoryId) {
    where.categoryId = categoryId;
  }
  if (minPrice !== void 0 || maxPrice !== void 0) {
    where.price = {};
    if (minPrice !== void 0) where.price.gte = minPrice;
    if (maxPrice !== void 0) where.price.lte = maxPrice;
  }
  if (searchTerm) {
    where.OR = [
      { name: { contains: searchTerm, mode: "insensitive" } },
      { description: { contains: searchTerm, mode: "insensitive" } },
      {
        category: {
          name: { contains: searchTerm, mode: "insensitive" }
        }
      }
    ];
  }
  return await prisma.meal.findMany({
    where,
    include: {
      category: true,
      provider: true
    }
  });
};
var getMealById = async (id) => {
  return await prisma.meal.findUnique({
    where: { id },
    include: {
      category: true,
      provider: true
    }
  });
};
var getMealsByProvider = async (providerId, includeUnavailable = false) => {
  const where = { providerId };
  if (!includeUnavailable) {
    where.isAvailable = true;
  }
  return await prisma.meal.findMany({
    where,
    include: {
      category: true
    }
  });
};
var updateMeal = async (id, data) => {
  return await prisma.meal.update({
    where: { id },
    data
  });
};
var deleteMeal = async (id) => {
  return await prisma.meal.delete({
    where: { id }
  });
};
var MealService = {
  createMeal,
  getAllMeals,
  getMealById,
  getMealsByProvider,
  updateMeal,
  deleteMeal
};

// src/module/meals/meals.controller.ts
var createMeal2 = async (req, res, next) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      res.status(401).json({ error: "Unauthorized: login or signup first" });
      return;
    }
    const providerProfile = await prisma.providerProfile.findUnique({
      where: { userId }
    });
    if (!providerProfile) {
      res.status(404).json({
        success: false,
        error: "Provider profile not found. Please create a profile first."
      });
      return;
    }
    const meal = await MealService.createMeal({
      ...req.body,
      providerId: providerProfile.id
    });
    res.status(201).json({
      success: true,
      data: meal
    });
  } catch (error) {
    next(error);
  }
};
var getAllMeals2 = async (req, res, next) => {
  try {
    const { categoryId, minPrice, maxPrice, searchTerm } = req.query;
    const meals = await MealService.getAllMeals({
      categoryId,
      minPrice: minPrice ? Number(minPrice) : void 0,
      maxPrice: maxPrice ? Number(maxPrice) : void 0,
      searchTerm
    });
    res.json({
      success: true,
      data: meals
    });
  } catch (error) {
    next(error);
  }
};
var getMealById2 = async (req, res, next) => {
  try {
    const { id } = req.params;
    const meal = await MealService.getMealById(id);
    if (!meal) {
      res.status(404).json({ success: false, error: "Meal not found" });
      return;
    }
    res.json({
      success: true,
      data: meal
    });
  } catch (error) {
    next(error);
  }
};
var updateMeal2 = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.user?.id;
    const userRole = req.user?.role;
    if (!userId) {
      res.status(401).json({ error: "Unauthorized" });
      return;
    }
    const existingMeal = await MealService.getMealById(id);
    if (!existingMeal) {
      res.status(404).json({ success: false, error: "Meal not found" });
      return;
    }
    if (userRole !== "ADMIN") {
      const providerProfile = await prisma.providerProfile.findUnique({
        where: { userId }
      });
      if (!providerProfile || existingMeal.providerId !== providerProfile.id) {
        res.status(403).json({
          success: false,
          error: "Forbidden: You don't own this meal"
        });
        return;
      }
    }
    const updatedMeal = await MealService.updateMeal(id, req.body);
    res.json({
      success: true,
      data: updatedMeal
    });
  } catch (error) {
    next(error);
  }
};
var getMealsByProvider2 = async (req, res, next) => {
  try {
    const { providerId } = req.params;
    const meals = await MealService.getMealsByProvider(providerId);
    res.json({
      success: true,
      data: meals
    });
  } catch (error) {
    next(error);
  }
};
var deleteMeal2 = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.user?.id;
    const userRole = req.user?.role;
    if (!userId) {
      res.status(401).json({ error: "Unauthorized" });
      return;
    }
    const existingMeal = await MealService.getMealById(id);
    if (!existingMeal) {
      res.status(404).json({ success: false, error: "Meal not found" });
      return;
    }
    if (userRole !== "ADMIN") {
      const providerProfile = await prisma.providerProfile.findUnique({
        where: { userId }
      });
      if (!providerProfile || existingMeal.providerId !== providerProfile.id) {
        res.status(403).json({
          success: false,
          error: "Forbidden: You don't own this meal"
        });
        return;
      }
    }
    await MealService.deleteMeal(id);
    res.json({
      success: true,
      message: "Meal deleted successfully"
    });
  } catch (error) {
    next(error);
  }
};
var MealController = {
  createMeal: createMeal2,
  getAllMeals: getAllMeals2,
  getMealById: getMealById2,
  getMealsByProvider: getMealsByProvider2,
  updateMeal: updateMeal2,
  deleteMeal: deleteMeal2
};

// src/middleware/auth.middleware.ts
var auth2 = (...roles) => {
  return async (req, res, next) => {
    try {
      const session = await auth.api.getSession({
        headers: req.headers
      });
      if (!session) {
        res.status(401).json({
          success: false,
          message: "You are not authorized because of session"
        });
        return;
      }
      if (!session.user.emailVerified) {
        res.status(403).json({
          success: false,
          message: "You are not authorized because you email isn't Verified"
        });
        return;
      }
      if (session.user.isActive === false) {
        res.status(403).json({
          success: false,
          message: "Your account has been suspended. Please contact administration."
        });
        return;
      }
      req.user = {
        id: session.user.id,
        email: session.user.email,
        name: session.user.name,
        role: session.user.role,
        emailVerified: session.user.emailVerified,
        isActive: session.user.isActive
      };
      if (roles.length && !roles.includes(req.user.role)) {
        res.status(403).json({
          success: false,
          message: `Forbidden: You do not have the required permissions (${roles.join(", ")}) to access this resource.`
        });
        return;
      }
      next();
    } catch (error) {
      next(error);
    }
  };
};
var auth_middleware_default = auth2;

// src/module/meals/meals.routes.ts
var router = Router();
router.get("/", MealController.getAllMeals);
router.get("/:id", MealController.getMealById);
router.get("/provider/:providerId", MealController.getMealsByProvider);
router.post(
  "/",
  auth_middleware_default("provider" /* PROVIDER */, "admin" /* ADMIN */),
  MealController.createMeal
);
router.patch(
  "/:id",
  auth_middleware_default("provider" /* PROVIDER */, "admin" /* ADMIN */),
  MealController.updateMeal
);
router.delete(
  "/:id",
  auth_middleware_default("provider" /* PROVIDER */, "admin" /* ADMIN */),
  MealController.deleteMeal
);
var mealRoutes = router;

// src/module/provider/provider.routes.ts
import { Router as Router2 } from "express";

// src/module/provider/provider.server.ts
var createProviderProfile = async (data) => {
  const existingProfile = await prisma.providerProfile.findUnique({
    where: { userId: data.userId }
  });
  if (existingProfile) {
    throw new Error("You already have a provider profile.");
  }
  return await prisma.$transaction(async (timeline) => {
    const profile = await timeline.providerProfile.create({
      data
    });
    await timeline.user.update({
      where: { id: data.userId },
      data: { role: "provider" }
    });
    return profile;
  });
};
var getProviderProfile = async (id) => {
  return await prisma.providerProfile.findUnique({
    where: { id },
    include: {
      user: {
        select: {
          name: true,
          email: true,
          image: true
        }
      },
      meals: {
        where: { isAvailable: true },
        // Only show available meals for public profile
        include: {
          category: true
        }
      }
    }
  });
};
var getAllProviders = async () => {
  return await prisma.providerProfile.findMany({
    include: {
      user: {
        select: {
          name: true,
          image: true
        }
      }
    }
  });
};
var getProviderProfileByUserId = async (userId) => {
  return await prisma.providerProfile.findUnique({
    where: { userId },
    include: {
      user: {
        select: {
          name: true,
          email: true,
          image: true
        }
      },
      meals: {
        include: {
          category: true
        }
      }
    }
  });
};
var updateProviderProfile = async (id, data) => {
  return await prisma.providerProfile.update({
    where: { id },
    data
  });
};
var ProviderService = {
  createProviderProfile,
  getProviderProfile,
  getProviderProfileByUserId,
  getAllProviders,
  updateProviderProfile
};

// src/module/provider/provider.controller.ts
var createProviderProfile2 = async (req, res, next) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      res.status(401).json({ error: "Unauthorized: login or sighup first" });
      return;
    }
    const result = await ProviderService.createProviderProfile({
      ...req.body,
      userId
    });
    res.status(201).json({
      success: true,
      data: result
    });
  } catch (error) {
    next(error);
  }
};
var getProviderProfile2 = async (req, res, next) => {
  try {
    const { providerId } = req.params;
    const result = await ProviderService.getProviderProfile(
      providerId
    );
    if (!result) {
      res.status(404).json({ success: false, error: "Provider profile disen't exist" });
      return;
    }
    res.json({
      success: true,
      data: result
    });
  } catch (error) {
    next(error);
  }
};
var getAllProviders2 = async (req, res, next) => {
  try {
    const result = await ProviderService.getAllProviders();
    res.json({
      success: true,
      data: result
    });
  } catch (error) {
    next(error);
  }
};
var getMyProviderProfile = async (req, res, next) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      res.status(401).json({ error: "Unauthorized" });
      return;
    }
    const result = await ProviderService.getProviderProfileByUserId(userId);
    if (!result) {
      res.status(404).json({ success: false, error: "Provider profile not found" });
      return;
    }
    res.json({
      success: true,
      data: result
    });
  } catch (error) {
    next(error);
  }
};
var updateProviderProfile2 = async (req, res, next) => {
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
      req.body
    );
    res.json({
      success: true,
      data: result
    });
  } catch (error) {
    next(error);
  }
};
var ProviderController = {
  createProviderProfile: createProviderProfile2,
  getProviderProfile: getProviderProfile2,
  getMyProviderProfile,
  getAllProviders: getAllProviders2,
  updateProviderProfile: updateProviderProfile2
};

// src/module/provider/provider.routes.ts
var router2 = Router2();
router2.post("/", auth_middleware_default(), ProviderController.createProviderProfile);
router2.get("/", ProviderController.getAllProviders);
router2.get("/me", auth_middleware_default(), ProviderController.getMyProviderProfile);
router2.patch("/me", auth_middleware_default(), ProviderController.updateProviderProfile);
router2.get("/:providerId", ProviderController.getProviderProfile);
var providerRoutes = router2;

// src/module/category/category.routes.ts
import { Router as Router3 } from "express";

// src/module/category/category.server.ts
var createCategory = async (data) => {
  return await prisma.category.create({
    data
  });
};
var getAllCategories = async () => {
  return await prisma.category.findMany();
};
var getCategoryById = async (id) => {
  return await prisma.category.findUnique({
    where: { id }
  });
};
var deleteCategory = async (id) => {
  return await prisma.category.delete({
    where: { id }
  });
};
var CategoryService = {
  createCategory,
  getAllCategories,
  getCategoryById,
  deleteCategory
};

// src/module/category/category.controller.ts
var createCategory2 = async (req, res, next) => {
  try {
    const category = await CategoryService.createCategory(req.body);
    res.status(201).json({
      success: true,
      data: category
    });
  } catch (error) {
    next(error);
  }
};
var getAllCategories2 = async (req, res, next) => {
  try {
    const categories = await CategoryService.getAllCategories();
    res.json({
      success: true,
      data: categories
    });
  } catch (error) {
    next(error);
  }
};
var getCategoryById2 = async (req, res, next) => {
  try {
    const categoryId = req.params.categoryId;
    const category = await CategoryService.getCategoryById(categoryId);
    if (!category) {
      res.status(404).json({ success: false, error: "Category not found" });
      return;
    }
    res.json({
      success: true,
      data: category
    });
  } catch (error) {
    next(error);
  }
};
var deleteCategory2 = async (req, res, next) => {
  try {
    const categoryId = req.params.categoryId;
    await CategoryService.deleteCategory(categoryId);
    res.json({
      success: true,
      message: "Category deleted successfully"
    });
  } catch (error) {
    next(error);
  }
};
var CategoryController = {
  createCategory: createCategory2,
  getAllCategories: getAllCategories2,
  getCategoryById: getCategoryById2,
  deleteCategory: deleteCategory2
};

// src/module/category/category.routes.ts
var router3 = Router3();
router3.post("/", auth_middleware_default("admin" /* ADMIN */), CategoryController.createCategory);
router3.get("/", CategoryController.getAllCategories);
router3.get("/:categoryId", CategoryController.getCategoryById);
router3.delete(
  "/:categoryId",
  auth_middleware_default("admin" /* ADMIN */),
  CategoryController.deleteCategory
);
var categoryRoutes = router3;

// src/module/orders/orders.routes.ts
import { Router as Router4 } from "express";

// src/module/orders/orders.server.ts
var createOrder = async (data) => {
  return await prisma.$transaction(async (timeline) => {
    let total = 0;
    const itemsWithPrice = [];
    for (const item of data.items) {
      const meal = await timeline.meal.findUnique({
        where: { id: item.mealId }
      });
      if (!meal) throw new Error(`Meal with ID ${item.mealId} not found`);
      if (!meal.isAvailable)
        throw new Error(`Meal ${meal.name} is not available`);
      if (meal.providerId !== data.providerId) {
        throw new Error(
          `Meal ${meal.name} does not belong to the selected provider`
        );
      }
      const price = Number(meal.price);
      total += price * item.quantity;
      itemsWithPrice.push({
        mealId: item.mealId,
        quantity: item.quantity,
        priceAtTime: meal.price
      });
    }
    const order = await timeline.order.create({
      data: {
        customerId: data.customerId,
        providerId: data.providerId,
        deliveryAddress: data.deliveryAddress,
        totalAmount: total,
        status: OrderStatus.placed,
        items: {
          create: itemsWithPrice
        }
      },
      include: {
        items: true
      }
    });
    return order;
  });
};
var getOrdersForCustomer = async (customerId) => {
  return await prisma.order.findMany({
    where: { customerId },
    include: {
      items: { include: { meal: true } },
      provider: true
    },
    orderBy: { createdAt: "desc" }
  });
};
var getOrdersForProvider = async (providerId) => {
  return await prisma.order.findMany({
    where: { providerId },
    include: {
      items: { include: { meal: true } },
      customer: true
    },
    orderBy: { createdAt: "desc" }
  });
};
var getAllOrders = async () => {
  return await prisma.order.findMany({
    include: {
      items: { include: { meal: true } },
      customer: true,
      provider: true
    },
    orderBy: { createdAt: "desc" }
  });
};
var getOrderById = async (id) => {
  return await prisma.order.findUnique({
    where: { id },
    include: {
      items: { include: { meal: true } },
      customer: true,
      provider: true
    }
  });
};
var updateOrderStatus = async (id, status) => {
  return await prisma.order.update({
    where: { id },
    data: { status }
  });
};
var OrderService = {
  createOrder,
  getOrdersForCustomer,
  getOrdersForProvider,
  getAllOrders,
  getOrderById,
  updateOrderStatus
};

// src/module/orders/orders.controller.ts
var placeOrder = async (req, res, next) => {
  try {
    const customerId = req.user?.id;
    if (!customerId) {
      res.status(401).json({ success: false, error: "Unauthorized" });
      return;
    }
    const order = await OrderService.createOrder({
      ...req.body,
      customerId
    });
    res.status(201).json({
      success: true,
      data: order
    });
  } catch (error) {
    next(error);
  }
};
var getMyOrders = async (req, res, next) => {
  try {
    const userId = req.user?.id;
    const role = req.user?.role;
    if (!userId) {
      res.status(401).json({ success: false, error: "Unauthorized" });
      return;
    }
    let orders;
    if (role === "admin" /* ADMIN */) {
      orders = await OrderService.getAllOrders();
    } else if (role === "provider" /* PROVIDER */) {
      const profile = await prisma.providerProfile.findUnique({
        where: { userId }
      });
      if (!profile) {
        res.status(404).json({ success: false, error: "Provider profile not found" });
        return;
      }
      orders = await OrderService.getOrdersForProvider(profile.id);
    } else {
      orders = await OrderService.getOrdersForCustomer(userId);
    }
    res.json({
      success: true,
      data: orders
    });
  } catch (error) {
    next(error);
  }
};
var updateStatus = async (req, res, next) => {
  try {
    const { orderId } = req.params;
    const { status } = req.body;
    const userId = req.user?.id;
    const role = req.user?.role;
    const order = await OrderService.getOrderById(orderId);
    if (!order) {
      res.status(404).json({ success: false, error: "Order not found" });
      return;
    }
    if (role !== "admin" /* ADMIN */) {
      const profile = await prisma.providerProfile.findUnique({
        where: { userId }
      });
      if (!profile || order.providerId !== profile.id) {
        res.status(403).json({
          success: false,
          error: "Forbidden: You don't own this restaurant"
        });
        return;
      }
    }
    const updatedOrder = await OrderService.updateOrderStatus(
      orderId,
      status
    );
    res.json({
      success: true,
      data: updatedOrder
    });
  } catch (error) {
    next(error);
  }
};
var getOrderById2 = async (req, res, next) => {
  try {
    const { orderId } = req.params;
    const userId = req.user?.id;
    const role = req.user?.role;
    const order = await OrderService.getOrderById(orderId);
    if (!order) {
      res.status(404).json({ success: false, error: "Order not found" });
      return;
    }
    if (role !== "admin" /* ADMIN */ && order.customerId !== userId) {
      const profile = await prisma.providerProfile.findUnique({
        where: { userId }
      });
      if (!profile || order.providerId !== profile.id) {
        res.status(403).json({
          success: false,
          error: "Forbidden: You are not authorized to view this order"
        });
        return;
      }
    }
    res.json({
      success: true,
      data: order
    });
  } catch (error) {
    next(error);
  }
};
var cancelOrder = async (req, res, next) => {
  try {
    const { orderId } = req.params;
    const userId = req.user?.id;
    if (!userId) {
      res.status(401).json({ success: false, error: "Unauthorized" });
      return;
    }
    const order = await OrderService.getOrderById(orderId);
    if (!order) {
      res.status(404).json({ success: false, error: "Order not found" });
      return;
    }
    if (order.customerId !== userId) {
      res.status(403).json({
        success: false,
        error: "Forbidden: You can only cancel your own orders"
      });
      return;
    }
    if (order.status !== "placed") {
      res.status(400).json({
        success: false,
        error: "Cannot cancel order: Kitchen has already started preparing"
      });
      return;
    }
    const cancelledOrder = await OrderService.updateOrderStatus(
      orderId,
      OrderStatus.cancelled
    );
    res.json({
      success: true,
      data: cancelledOrder,
      message: "Order cancelled successfully"
    });
  } catch (error) {
    next(error);
  }
};
var OrderController = {
  placeOrder,
  getMyOrders,
  getOrderById: getOrderById2,
  updateStatus,
  cancelOrder
};

// src/module/orders/orders.routes.ts
var router4 = Router4();
router4.post("/", auth_middleware_default(), OrderController.placeOrder);
router4.get("/my", auth_middleware_default(), OrderController.getMyOrders);
router4.get("/:orderId", auth_middleware_default(), OrderController.getOrderById);
router4.patch(
  "/status/:orderId",
  auth_middleware_default("provider" /* PROVIDER */, "admin" /* ADMIN */),
  OrderController.updateStatus
);
router4.patch("/cancel/:orderId", auth_middleware_default(), OrderController.cancelOrder);
var orderRoutes = router4;

// src/module/review/review.routes.ts
import { Router as Router5 } from "express";

// src/module/review/review.server.ts
var createReview = async (data) => {
  const previousOrder = await prisma.order.findFirst({
    where: {
      customerId: data.customerId,
      items: {
        some: { mealId: data.mealId }
      },
      status: OrderStatus.delivered
    }
  });
  if (!previousOrder) {
    throw new Error(
      "You can only review meals you have successfully ordered and received."
    );
  }
  return await prisma.review.create({
    data
  });
};
var getReviewsByMeal = async (mealId) => {
  return await prisma.review.findMany({
    where: { mealId },
    include: {
      customer: {
        select: {
          id: true,
          name: true,
          image: true
        }
      }
    },
    orderBy: { createdAt: "desc" }
  });
};
var getReviewsByCustomer = async (customerId) => {
  return await prisma.review.findMany({
    where: { customerId },
    include: {
      meal: true
    },
    orderBy: { createdAt: "desc" }
  });
};
var deleteReview = async (reviewId, userId, role) => {
  const review = await prisma.review.findUnique({
    where: { id: reviewId }
  });
  if (!review) {
    throw new Error("Review not found");
  }
  if (role !== "ADMIN" && review.customerId !== userId) {
    throw new Error("You are not authorized to delete this review");
  }
  return await prisma.review.delete({
    where: { id: reviewId }
  });
};
var ReviewService = {
  createReview,
  getReviewsByMeal,
  getReviewsByCustomer,
  deleteReview
};

// src/module/review/review.controller.ts
var createReview2 = async (req, res, next) => {
  try {
    const customerId = req.user?.id;
    if (!customerId) {
      res.status(401).json({ success: false, error: "Unauthorized" });
      return;
    }
    const review = await ReviewService.createReview({
      ...req.body,
      customerId
    });
    res.status(201).json({
      success: true,
      data: review
    });
  } catch (error) {
    next(error);
  }
};
var getMealReviews = async (req, res, next) => {
  try {
    const { mealId } = req.params;
    const reviews = await ReviewService.getReviewsByMeal(mealId);
    res.json({
      success: true,
      data: reviews
    });
  } catch (error) {
    next(error);
  }
};
var getMyReviews = async (req, res, next) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      res.status(401).json({ success: false, error: "Unauthorized" });
      return;
    }
    const reviews = await ReviewService.getReviewsByCustomer(userId);
    res.json({
      success: true,
      data: reviews
    });
  } catch (error) {
    next(error);
  }
};
var deleteReview2 = async (req, res, next) => {
  try {
    const { reviewId } = req.params;
    const userId = req.user?.id;
    const role = req.user?.role;
    if (!userId) {
      res.status(401).json({ success: false, error: "Unauthorized" });
      return;
    }
    await ReviewService.deleteReview(reviewId, userId, role);
    res.json({
      success: true,
      message: "Review deleted successfully"
    });
  } catch (error) {
    next(error);
  }
};
var ReviewController = {
  createReview: createReview2,
  getMealReviews,
  getMyReviews,
  deleteReview: deleteReview2
};

// src/module/review/review.routes.ts
var router5 = Router5();
router5.get("/meal/:mealId", ReviewController.getMealReviews);
router5.post("/", auth_middleware_default(), ReviewController.createReview);
router5.get("/my", auth_middleware_default(), ReviewController.getMyReviews);
router5.delete("/:reviewId", auth_middleware_default(), ReviewController.deleteReview);
var reviewRoutes = router5;

// src/module/admin/admin.routes.ts
import { Router as Router6 } from "express";

// src/module/admin/admin.server.ts
var getAllUsers = async () => {
  return await prisma.user.findMany({
    include: {
      providerProfile: true
    },
    orderBy: {
      createdAt: "desc"
    }
  });
};
var updateUserStatus = async (userId, isActive) => {
  return await prisma.user.update({
    where: { id: userId },
    data: { isActive }
  });
};
var getPlatformStats = async () => {
  const [userCount, providerCount, mealCount, orderCount, totalRevenue] = await Promise.all([
    prisma.user.count(),
    prisma.providerProfile.count(),
    prisma.meal.count(),
    prisma.order.count(),
    prisma.order.aggregate({
      _sum: {
        totalAmount: true
      },
      where: {
        status: "delivered"
      }
    })
  ]);
  return {
    totalUsers: userCount,
    totalProviders: providerCount,
    totalMeals: mealCount,
    totalOrders: orderCount,
    deliveredRevenue: totalRevenue._sum.totalAmount || 0
  };
};
var AdminService = {
  getAllUsers,
  updateUserStatus,
  getPlatformStats
};

// src/module/admin/admin.controller.ts
var getAllUsers2 = async (req, res, next) => {
  try {
    const users = await AdminService.getAllUsers();
    res.json({
      success: true,
      data: users
    });
  } catch (error) {
    next(error);
  }
};
var updateUserStatus2 = async (req, res, next) => {
  try {
    const { userId } = req.params;
    const { isActive } = req.body;
    if (typeof isActive !== "boolean") {
      res.status(400).json({ success: false, error: "isActive must be a boolean" });
      return;
    }
    const updatedUser = await AdminService.updateUserStatus(
      userId,
      isActive
    );
    res.json({
      success: true,
      message: `User ${isActive ? "activated" : "suspended"} successfully`,
      data: updatedUser
    });
  } catch (error) {
    next(error);
  }
};
var getStats = async (req, res, next) => {
  try {
    const stats = await AdminService.getPlatformStats();
    res.json({
      success: true,
      data: stats
    });
  } catch (error) {
    next(error);
  }
};
var AdminController = {
  getAllUsers: getAllUsers2,
  updateUserStatus: updateUserStatus2,
  getStats
};

// src/module/admin/admin.routes.ts
var router6 = Router6();
router6.use(auth_middleware_default("admin" /* ADMIN */));
router6.get("/stats", AdminController.getStats);
router6.get("/users", AdminController.getAllUsers);
router6.patch("/users/:userId/status", AdminController.updateUserStatus);
var adminRoutes = router6;

// src/module/user/user.routes.ts
import { Router as Router7 } from "express";

// src/module/user/user.server.ts
var getUserProfile = async (id) => {
  return await prisma.user.findUnique({
    where: { id },
    include: {
      providerProfile: true
      // Include if they are a provider
    }
  });
};
var updateUserProfile = async (id, data) => {
  return await prisma.user.update({
    where: { id },
    data
  });
};
var UserService = {
  getUserProfile,
  updateUserProfile
};

// src/module/user/user.controller.ts
var getMyProfile = async (req, res, next) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      res.status(401).json({ success: false, error: "Unauthorized" });
      return;
    }
    const user = await UserService.getUserProfile(userId);
    res.json({
      success: true,
      data: user
    });
  } catch (error) {
    next(error);
  }
};
var updateMyProfile = async (req, res, next) => {
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
      data: updatedUser
    });
  } catch (error) {
    next(error);
  }
};
var UserController = {
  getMyProfile,
  updateMyProfile
};

// src/module/user/user.routes.ts
var router7 = Router7();
router7.use(auth_middleware_default());
router7.get("/me", UserController.getMyProfile);
router7.patch("/me", UserController.updateMyProfile);
var userRoutes = router7;

// src/middleware/error.middleware.ts
var globalErrorHandler = (err, req, res, next) => {
  console.error("Error path:", req.path);
  console.error("Error details:", err);
  let statusCode = 500;
  let message = "Something went wrong";
  let success = false;
  if (err instanceof prismaNamespace_exports.PrismaClientKnownRequestError) {
    switch (err.code) {
      case "P2002":
        statusCode = 409;
        const target = err.meta?.target || [];
        message = `Unique constraint failed on field: ${target.join(", ")}`;
        break;
      case "P2003":
        statusCode = 400;
        message = `Foreign key constraint failed. Check if the provided IDs (like categoryId or providerId) exist in the database.`;
        break;
      case "P2025":
        statusCode = 404;
        message = err.meta?.cause || "Record not found";
        break;
      case "P2000":
        statusCode = 400;
        message = "Input value too long for the database column";
        break;
      default:
        message = `Database error: ${err.message}`;
        break;
    }
  }
  if (err instanceof prismaNamespace_exports.PrismaClientValidationError) {
    statusCode = 400;
    message = "Database validation failed. Please check your input data types.";
  }
  res.status(statusCode).json({
    success,
    message,
    error: process.env.NODE_ENV === "development" ? err : void 0
  });
};

// src/app.ts
var app = express();
app.set("trust proxy", 1);
app.use(express.json());
app.use(
  cors({
    origin: (origin, callback) => {
      const allowed = process.env.FRONTEND_URL?.replace(/\/$/, "");
      if (!origin || origin.replace(/\/$/, "") === allowed) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true
  })
);
app.all("/api/auth/*any", toNodeHandler(auth));
app.get("/", (req, res) => {
  res.send("Hello!");
});
app.use("/api/meals", mealRoutes);
app.use("/api/providers", providerRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/reviews", reviewRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/users", userRoutes);
app.use(globalErrorHandler);
var app_default = app;

// src/server.ts
var PORT = process.env.PORT;
async function main() {
  try {
    await prisma.$connect();
    console.log("Connected to the database");
    if (process.env.NODE_ENV !== "production") {
      app_default.listen(PORT, () => {
        console.log(`Server is running on http://localhost:${PORT}`);
      });
    }
  } catch (error) {
    console.error("An error occurred: ", error);
    process.exit(1);
  }
}
main();
var server_default = app_default;
export {
  server_default as default
};
//! Calculate total amount and verify meals
//! Trust proxy for secure cookies on Vercel
//! CROS setup
//! better auth
