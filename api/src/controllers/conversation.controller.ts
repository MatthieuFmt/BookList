import { Request, Response } from "express";

export const test = (req: Request, res: Response) => {
  res.status(201).json({ message: "route conversation ok" });
};

export const getInfos = (req: Request, res: Response) => {
  res.status(201).json({ message: req.params.id });
};
