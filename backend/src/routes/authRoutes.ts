import { Router } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

import { pool } from "../config/database.js";
import { requireAuth, AuthRequest } from "../middleware/authMiddleware.js";

const router = Router();

router.post("/login", async (req, res) => {
  try {
    const { usuario, password } = req.body;

    if (!usuario || !password) {
      return res.status(400).json({
        message: "Usuario y contraseña son obligatorios",
      });
    }

    const [rows] = await pool.execute(
      `
            SELECT
                id,
                usuario,
                password_hash,
                nombre
            FROM usuarios
            WHERE usuario = ?
              AND activo = TRUE
            `,
      [usuario],
    );

    const usuarios = rows as {
      id: number;
      usuario: string;
      password_hash: string;
      nombre: string;
    }[];

    if (usuarios.length === 0) {
      return res.status(401).json({
        message: "Usuario o contraseña incorrectos",
      });
    }

    const usuarioEncontrado = usuarios[0];

    const passwordCorrecta = await bcrypt.compare(
      password,
      usuarioEncontrado.password_hash,
    );

    if (!passwordCorrecta) {
      return res.status(401).json({
        message: "Usuario o contraseña incorrectos",
      });
    }

    const secret = process.env.JWT_SECRET;

    if (!secret) {
      throw new Error("JWT_SECRET no está configurado");
    }

    const token = jwt.sign(
      {
        id: usuarioEncontrado.id,
        usuario: usuarioEncontrado.usuario,
      },
      secret,
      {
        expiresIn: "2h",
      },
    );

    res.cookie("token", token, {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
      maxAge: 2 * 60 * 60 * 1000,
    });

    res.json({
      message: "Login correcto",
      usuario: {
        id: usuarioEncontrado.id,
        usuario: usuarioEncontrado.usuario,
        nombre: usuarioEncontrado.nombre,
      },
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Error al iniciar sesión",
    });
  }
});

router.get("/me", requireAuth, (req: AuthRequest, res) => {
  res.json({
    message: "Usuario autenticado",
    usuario: req.usuario,
  });
});

router.post("/logout", (_req, res) => {
  res.clearCookie("token", {
    httpOnly: true,
    secure: false,
    sameSite: "lax",
  });

  res.json({
    message: "Sesión cerrada correctamente",
  });
});

export default router;
