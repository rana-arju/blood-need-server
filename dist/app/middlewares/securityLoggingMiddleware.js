"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.securityLoggingMiddleware = void 0;
const logger_1 = require("../shared/logger");
const securityLoggingMiddleware = (req, res, next) => {
    // Log suspicious requests
    const suspiciousPatterns = [
        /select.*from/i,
        /union.*select/i,
        /insert.*into/i,
        /delete.*from/i,
        /drop.*table/i,
        /exec.*sp/i,
        /script/i,
        /alert\(/i,
        /onload=/i,
        /eval\(/i,
        /document\.cookie/i,
        /\.\.\/\.\.\/\.\.\/\.\.\/\.\.\//i, // Path traversal
    ];
    const reqBody = JSON.stringify(req.body);
    const reqQuery = JSON.stringify(req.query);
    const reqParams = JSON.stringify(req.params);
    // Check for suspicious patterns in request
    for (const pattern of suspiciousPatterns) {
        if (pattern.test(reqBody) ||
            pattern.test(reqQuery) ||
            pattern.test(reqParams) ||
            pattern.test(req.path)) {
            logger_1.securityLogger.warn("Suspicious request detected", {
                ip: req.ip,
                method: req.method,
                path: req.path,
                body: reqBody,
                query: reqQuery,
                params: reqParams,
                headers: req.headers,
                user: req.user?.id || "unauthenticated",
            });
            break;
        }
    }
    // Log failed authentication attempts
    res.on("finish", () => {
        if ((req.path.includes("/login") || req.path.includes("/register")) &&
            res.statusCode >= 400 &&
            res.statusCode < 500) {
            logger_1.securityLogger.warn("Failed authentication attempt", {
                ip: req.ip,
                method: req.method,
                path: req.path,
                statusCode: res.statusCode,
                email: req.body.email || "unknown",
            });
        }
        // Log other security-related responses
        if (res.statusCode === 403 || res.statusCode === 401) {
            logger_1.securityLogger.warn(`Security response: ${res.statusCode}`, {
                ip: req.ip,
                method: req.method,
                path: req.path,
                statusCode: res.statusCode,
                user: req.user?.id || "unauthenticated",
            });
        }
    });
    next();
};
exports.securityLoggingMiddleware = securityLoggingMiddleware;
