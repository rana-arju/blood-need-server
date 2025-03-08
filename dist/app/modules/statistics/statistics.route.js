"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.StatisticsRoutes = void 0;
const express_1 = __importDefault(require("express"));
const statistics_controller_1 = require("./statistics.controller");
const router = express_1.default.Router();
router.get("/", statistics_controller_1.StatisticsController.getStatistics);
exports.StatisticsRoutes = router;
