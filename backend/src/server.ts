import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import authRoutes from "./routes/authRoutes.js";

import { pool } from "./config/database.js";
import keysRoutes from "./routes/keysRoutes.js";
import peopleRoutes from "./routes/peopleRoutes.js";
import movementsRoutes from "./routes/movementsRoutes.js";

const app = express();

const PORT = 3000;

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  }),
);

app.use(express.json());
app.use(cookieParser());

app.use("/api/auth", authRoutes);

app.get("/", (_req, res) => {
  res.json({
    message: "Keys API funcionando",
  });
});

app.get("/db-test", async (_req, res) => {
  try {
    const [rows] = await pool.query("SELECT 1 AS resultado");

    res.json({
      message: "Conexión a MySQL correcta",
      data: rows,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Error conectando a MySQL",
    });
  }
});

app.use("/api/llaves", keysRoutes);
app.use("/api/personas", peopleRoutes);
app.use("/api/movimientos", movementsRoutes);

app.listen(PORT, () => {
  console.log(`Servidor ejecutándose en http://localhost:${PORT}`);
});
