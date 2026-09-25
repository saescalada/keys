import type { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

export type AuthRequest = Request & {
  usuario?: {
    id: number;
    usuario: string;
  };
};

export function requireAuth(
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) {
  try {
    const token = req.cookies.token;

    if (!token) {
      return res.status(401).json({
        message: "No autenticado",
      });
    }

    const secret = process.env.JWT_SECRET;

    if (!secret) {
      throw new Error("JWT_SECRET no está configurado");
    }

    const decoded = jwt.verify(token, secret) as {
      id: number;
      usuario: string;
    };

    req.usuario = decoded;

    next();
  } catch (error) {
    return res.status(401).json({
      message: "Token inválido o expirado",
    });
  }
}
