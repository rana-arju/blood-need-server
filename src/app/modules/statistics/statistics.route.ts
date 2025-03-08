import express from "express";
import { StatisticsController } from "./statistics.controller";

const router = express.Router();

router.get("/", StatisticsController.getStatistics);

export const StatisticsRoutes = router;
