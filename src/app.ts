import express, { type Application } from "express";
import cors from "cors";
import { UserRoutes } from "./app/modules/user/user.route";
import { DonationRoutes } from "./app/modules/donation/donation.route";
import { globalErrorHandler } from "./app/middlewares/globalErrorHandler";
import { notFound } from "./app/middlewares/notFound";
import cookieParser from "cookie-parser";

const app: Application = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Application routes
app.use("/api/v1/users", UserRoutes);
app.use("/api/v1/donations", DonationRoutes);

// Health route
app.get("/health", (req, res) => {
  res.status(200).json({ message: "Server is running" });
});

// Global error handler
app.use(globalErrorHandler);

// Not found
app.use(notFound);

export default app;
