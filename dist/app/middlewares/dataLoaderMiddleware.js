"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.dataLoaderMiddleware = void 0;
const dataloader_1 = require("../shared/dataloader");
const dataLoaderMiddleware = (req, res, next) => {
    // Create new loaders for each request
    req.loaders = (0, dataloader_1.createLoaders)();
    next();
};
exports.dataLoaderMiddleware = dataLoaderMiddleware;
