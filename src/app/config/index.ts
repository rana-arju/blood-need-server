import dotenv from "dotenv";
import path from "path";

dotenv.config({ path: path.join(process.cwd(), ".env") });

export default {
  env: process.env.NODE_ENV,
  port: process.env.PORT,
  database_url: process.env.DATABASE_URL,
  jwt: {
    secret: process.env.JWT_SECRET,
    expires_in: process.env.JWT_EXPIRES_IN,
  },
  email: {
    host: process.env.EMAIL_HOST,
    port: Number.parseInt(process.env.EMAIL_PORT || "587", 10),
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
    from: process.env.EMAIL_FROM,
  },
  vapid: {
    publicKey: process.env.VAPID_PUBLIC_KEY as string,
    privateKey: process.env.VAPID_PRIVATE_KEY as string,
  },
  security: {
    bcrypt_salt_rounds: Number.parseInt(
      process.env.BCRYPT_SALT_ROUNDS || "12",
      10
    ),
    rate_limit: {
      window_ms: Number.parseInt(
        process.env.RATE_LIMIT_WINDOW_MS || "900000",
        10
      ), // 15 minutes
      max_requests: Number.parseInt(
        process.env.RATE_LIMIT_MAX_REQUESTS || "100",
        10
      ),
    },
    cors: {
      origin: process.env.CORS_ORIGIN || "*",
      methods: process.env.CORS_METHODS || "GET,HEAD,PUT,PATCH,POST,DELETE",
    },
  },
  firebase: {
    databaseURL: process.env.FIREBASE_DATABASE_URL,
    webApiKey: process.env.FIREBASE_WEB_API_KEY,
    projectId: process.env.FIREBASE_PROJECT_ID,
  },
};
