import rateLimit from "express-rate-limit";

export const limiter = rateLimit({
  windowMs: 10 * 60 * 1000, // 10 minutes
  max: 150, // limite chaque IP à 50 requêtes par fenêtre
  message: "Too many requests, please try again later.",
});
