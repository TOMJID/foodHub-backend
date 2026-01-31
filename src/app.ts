import express, { Application } from "express";
import cors from "cors";
import { toNodeHandler } from "better-auth/node";
import { auth } from "./lib/auth";
import { mealRoutes } from "./module/meals/meals.routes";
import { providerRoutes } from "./module/provider/provider.routes";
import { categoryRoutes } from "./module/category/category.routes";
import { orderRoutes } from "./module/orders/orders.routes";
import { reviewRoutes } from "./module/review/review.routes";
import { adminRoutes } from "./module/admin/admin.routes";
import { userRoutes } from "./module/user/user.routes";
import { globalErrorHandler } from "./middleware/error.middleware";

const app: Application = express();

//! Trust proxy for secure cookies on Vercel
app.set("trust proxy", 1);

//? json Parser
app.use(express.json());

//! CROS setup
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
    credentials: true,
  }),
);

//! better auth
app.use("/api/auth", (req, res, next) => {
  console.log(`[AUTH DEBUG] ${req.method} ${req.url}`);
  console.log(`[AUTH DEBUG] Host: ${req.headers.host}`);
  console.log(`[AUTH DEBUG] Origin: ${req.headers.origin}`);
  console.log(
    `[AUTH DEBUG] X-Forwarded-Proto: ${req.headers["x-forwarded-proto"]}`,
  );
  next();
});

app.all("/api/auth/*any", toNodeHandler(auth));

app.get("/api/debug-auth", (req, res) => {
  res.json({
    env: {
      FRONTEND_URL: process.env.FRONTEND_URL,
      BETTER_AUTH_URL: process.env.BETTER_AUTH_URL,
      NODE_ENV: process.env.NODE_ENV,
    },
    headers: {
      host: req.headers.host,
      origin: req.headers.origin,
      referer: req.headers.referer,
      "x-forwarded-proto": req.headers["x-forwarded-proto"],
    },
    cookies: req.headers.cookie,
  });
});

app.get("/", (req, res) => {
  res.send("Hello!");
});

//? api routes
app.use("/api/meals", mealRoutes);
app.use("/api/providers", providerRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/reviews", reviewRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/users", userRoutes);

//? Global Error Handler
app.use(globalErrorHandler);

export default app;
