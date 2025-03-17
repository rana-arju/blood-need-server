"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.dataLoaderMiddleware = void 0;
const dataloader_1 = require("../shared/dataloader");
const dataLoaderMiddleware = (req, res, next) => {
    try {
        // Create new loaders for each request
        req.loaders = (0, dataloader_1.createLoaders)();
        next();
    }
    catch (error) {
        console.error("Error creating dataloaders:", error);
        // Continue without loaders if there's an error
        next();
    }
};
exports.dataLoaderMiddleware = dataLoaderMiddleware;
