import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import { initDB } from "./config/db.js";
import rateLimiter from "./middleware/rateLimiter.js";

import transactionsRoute from "./routes/transactionsRoute.js";
import job from "./config/cron.js";

dotenv.config();

const app = express();

if (process.env.NODE_ENV === "production") job.start();

// middleware
app.use(cors()); // Enable CORS for all routes
// Temporarily disabled due to Upstash Redis compatibility issues
// app.use(rateLimiter);
app.use(express.json());

// our custom simple middleware
// app.use((req, res, next) => {
//   console.log("Hey we hit a req, the method is", req.method);
//   next();
// });

const PORT = process.env.PORT || 5001;

app.get("/api/health", (req, res) => {
  res.status(200).json({ status: "ok" });
});

app.use("/api/transactions", transactionsRoute);

// Error handling middleware - should be last
app.use((error, req, res, next) => {
  console.error("Unhandled error:", error);
  res.status(500).json({
    message: "Internal server error",
    error: process.env.NODE_ENV === "development" ? error.message : undefined,
  });
});

initDB().then(() => {
  app.listen(PORT, () => {
    console.log("Server is up and running on PORT:", PORT);
  });
});
