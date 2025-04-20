import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

interface JwtPayload {
  email: string;
  isSuperuser: boolean;
}

export const requireSuperuser = (req: Request, res: Response, next: NextFunction) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) {
    return res.status(401).json({ error: "No token provided" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "fallback-secret") as JwtPayload;
    if (!decoded.isSuperuser) {
      return res.status(403).json({ error: "Superuser access required" });
    }
    next();
  } catch (error) {
    return res.status(401).json({ error: "Invalid token" });
  }
};