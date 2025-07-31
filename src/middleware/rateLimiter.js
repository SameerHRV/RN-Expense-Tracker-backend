import ratelimit from "../config/upstash.js";

const rateLimiter = async (req, res, next) => {
  try {
    const { success } = await ratelimit.limit("my-rate-limit");

    if (!success) {
      return res.status(429).json({
        message: "Too many requests, please try again later.",
      });
    }

    next();
  } catch (error) {
    console.log("Rate limit error", error);
    // Instead of passing the error, continue without rate limiting
    // This prevents the app from breaking when rate limiter fails
    console.log("Continuing without rate limiting due to error");
    next();
  }
};

export default rateLimiter;
