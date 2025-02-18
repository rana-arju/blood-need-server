"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DonationRoutes = void 0;
const express_1 = __importDefault(require("express"));
const donation_controller_1 = require("./donation.controller");
const donation_validation_1 = require("./donation.validation");
const validationRequest_1 = __importDefault(require("../../middlewares/validationRequest"));
const router = express_1.default.Router();
router.get("/", donation_controller_1.DonationController.getAllDonations);
router.post("/", (0, validationRequest_1.default)(donation_validation_1.createDonationZodSchema), donation_controller_1.DonationController.createDonation);
router.patch("/:id", (0, validationRequest_1.default)(donation_validation_1.updateDonationZodSchema), donation_controller_1.DonationController.updateDonation);
router.delete("/:id", donation_controller_1.DonationController.deleteDonation);
exports.DonationRoutes = router;
