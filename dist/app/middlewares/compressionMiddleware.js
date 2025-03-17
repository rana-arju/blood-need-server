"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.compressionMiddleware = void 0;
const zlib_1 = __importDefault(require("zlib"));
const compressionMiddleware = (req, res, next) => {
    const originalSend = res.send.bind(res);
    const originalJson = res.json.bind(res);
    // Check if the client supports gzip encoding
    const acceptEncoding = req.headers["accept-encoding"] || "";
    const supportsGzip = acceptEncoding.includes("gzip");
    if (!supportsGzip || req.headers["x-no-compression"]) {
        return next();
    }
    // Override `res.send()`
    res.send = function (body) {
        if (!body)
            return originalSend(body);
        const output = typeof body === "string" ? body : JSON.stringify(body);
        // Only compress large responses
        if (output.length > 1024) {
            zlib_1.default.gzip(output, (err, compressed) => {
                if (err) {
                    return originalSend(body); // Fallback to uncompressed
                }
                res.setHeader("Content-Encoding", "gzip");
                res.setHeader("Content-Length", compressed.length.toString());
                res.setHeader("Vary", "Accept-Encoding");
                res.end(compressed);
            });
            return res;
        }
        return originalSend(body);
    };
    // Override `res.json()`
    res.json = function (body) {
        const output = JSON.stringify(body);
        // Only compress large responses
        if (output.length > 1024) {
            zlib_1.default.gzip(output, (err, compressed) => {
                if (err) {
                    return originalJson(body); // Fallback to uncompressed
                }
                res.setHeader("Content-Type", "application/json");
                res.setHeader("Content-Encoding", "gzip");
                res.setHeader("Content-Length", compressed.length.toString());
                res.setHeader("Vary", "Accept-Encoding");
                res.end(compressed);
            });
            return res;
        }
        return originalJson(body);
    };
    next();
};
exports.compressionMiddleware = compressionMiddleware;
