import type { Request, Response, NextFunction } from "express";
import zlib from "zlib";

export const compressionMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const originalSend = res.send.bind(res);
  const originalJson = res.json.bind(res);

  // Check if the client supports gzip encoding
  const acceptEncoding = req.headers["accept-encoding"] || "";
  const supportsGzip = acceptEncoding.includes("gzip");

  if (!supportsGzip || req.headers["x-no-compression"]) {
    return next();
  }

  // Override `res.send()`
  res.send = function (body: any) {
    if (!body) return originalSend(body);

    const output = typeof body === "string" ? body : JSON.stringify(body);

    // Only compress large responses
    if (output.length > 1024) {
      zlib.gzip(output, (err, compressed) => {
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
  res.json = function (body: any) {
    const output = JSON.stringify(body);

    // Only compress large responses
    if (output.length > 1024) {
      zlib.gzip(output, (err, compressed) => {
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
