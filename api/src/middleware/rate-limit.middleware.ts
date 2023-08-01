import rateLimit from "express-rate-limit";

// limite chaque IP à 1000 requêtes par heure
export const limiter = rateLimit({
  windowMs: 10 * 60 * 6000,
  max: 1000,
  message: "Trop de requêtes, veuillez réessayer plus tard",
});
