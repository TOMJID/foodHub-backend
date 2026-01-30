import express, { Application } from "express";
import cors from "cors";
import { toNodeHandler } from "better-auth/node";
import { auth } from "./lib/auth";
import { mealRoutes } from "./module/meals/meals.routes";
import { providerRoutes } from "./module/provider/provider.routes";
import { categoryRoutes } from "./module/category/category.routes";
import { orderRoutes } from "./module/orders/orders.routes";
import { reviewRoutes } from "./module/review/review.routes";
import { globalErrorHandler } from "./middleware/error.middleware";

const app: Application = express();

//? json Parser
app.use(express.json());

//! CROS setup
app.use(
  cors({
    origin: process.env.FRONTEND_URL,
    credentials: true,
  }),
);

//! better auth
app.all("/api/auth/{*any}", toNodeHandler(auth));

app.get("/", (req, res) => {
  res.send("Hello!");
});

//? api routes
app.use("/api/meals", mealRoutes);
app.use("/api/providers", providerRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/reviews", reviewRoutes);

//? Global Error Handler
app.use(globalErrorHandler);

export default app;
