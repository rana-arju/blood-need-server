"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DonationRoutes = void 0;
const express_1 = __importDefault(require("express"));
const validationRequest_1 = __importDefault(require("../../middlewares/validationRequest"));
const auth_1 = __importDefault(require("../../middlewares/auth"));
const donation_controller_1 = require("./donation.controller");
const donation_validation_1 = require("./donation.validation");
const router = express_1.default.Router();
router.get("/", (0, auth_1.default)("admin", "superadmin", "user", "volunteer"), donation_controller_1.DonationController.getAllDonationOffers);
router.get("/for-my-requests", (0, auth_1.default)("user", "admin", "superadmin", "volunteer"), donation_controller_1.DonationController.getDonationOffersForMyRequests);
router.get("/single/:id", (0, auth_1.default)("user", "admin", "superadmin", "volunteer"), donation_controller_1.DonationController.getSingleDonation);
router.get("/:id", (0, auth_1.default)("user", "admin", "superadmin", "volunteer"), donation_controller_1.DonationController.getMyDonationOffers);
router.get("/:id", (0, auth_1.default)("user", "admin", "superadmin", "volunteer"), donation_controller_1.DonationController.getSingleDonation);
router.get("/:id", (0, auth_1.default)("user", "admin", "superadmin", "volunteer"), donation_controller_1.DonationController.getDonationOfferById);
router.post("/", (0, auth_1.default)("user", "admin", "superadmin", "volunteer"), (0, validationRequest_1.default)(donation_validation_1.createDonationOfferZodSchema), donation_controller_1.DonationController.createDonationOffer);
// New routes to match frontend API calls
// Cancel interest in a blood request
router.delete("/blood-requests/:requestId/interest", (0, auth_1.default)("user", "admin", "superadmin", "volunteer"), donation_controller_1.DonationController.cancelInterest);
// Get interested donor details
router.get("/blood-requests/:requestId/donors/:userId", (0, auth_1.default)("user", "admin", "superadmin", "volunteer"), donation_controller_1.DonationController.getInterestedDonorDetails);
// Update interested donor status
router.patch("/blood-requests/:requestId/donors/:userId/status", (0, auth_1.default)("user", "admin", "superadmin", "volunteer"), (0, validationRequest_1.default)(donation_validation_1.updateDonorStatusZodSchema), donation_controller_1.DonationController.updateDonorStatus);
exports.DonationRoutes = router;
