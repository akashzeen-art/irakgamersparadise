import "dotenv/config";
import express from "express";
import cors from "cors";
import { handleDemo } from "./routes/demo";
import { handleDeactivate, handleStatusCheck, handleSubscriberDetails } from "./routes/subscription";

export function createServer() {
  const app = express();

  // Middleware
  app.use(cors());
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // Example API routes
  app.get("/api/ping", (_req, res) => {
    const ping = process.env.PING_MESSAGE ?? "ping";
    res.json({ message: ping });
  });

  app.get("/api/demo", handleDemo);

  // Subscription API proxy (avoids browser CORS)
  app.get("/api/subscription/status", handleStatusCheck);
  app.get("/api/subscription/detail", handleSubscriberDetails);
  app.get("/api/subscription/deactivate", handleDeactivate);

  return app;
}
