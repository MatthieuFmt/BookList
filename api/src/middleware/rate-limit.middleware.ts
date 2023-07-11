import rateLimit from "express-rate-limit";

export const limiter = rateLimit({
  windowMs: 10 * 60 * 6000, // 60 minutes
  max: 1000, // limite chaque IP à 1000 requêtes par fenêtre
  message: "Trop de requêtes, veuillez réessayer plus tard",
});
