"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserRoutes = void 0;
const express_1 = __importDefault(require("express"));
const user_controller_1 = require("./user.controller");
const user_validation_1 = require("./user.validation");
const validationRequest_1 = __importDefault(require("../../middlewares/validationRequest"));
const router = express_1.default.Router();
router.get("/users", user_controller_1.UserController.getAllUsers);
router.post("/register", (0, validationRequest_1.default)(user_validation_1.createUserZodSchema), user_controller_1.UserController.createUser);
router.post("/login", user_controller_1.UserController.login);
router.patch("/user/:id", (0, validationRequest_1.default)(user_validation_1.updateUserZodSchema), user_controller_1.UserController.updateUser);
router.delete("/user/:id", user_controller_1.UserController.deleteUser);
exports.UserRoutes = router;
