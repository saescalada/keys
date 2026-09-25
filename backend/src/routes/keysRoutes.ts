import { Router } from "express";
import { pool } from "../config/database.js";

const router = Router();

// Todas las llaves
router.get("/", async (_req, res) => {
  try {
    const [rows] = await pool.execute(`
            SELECT
                l.id,
                l.nombre,
                l.codigo,
                l.ubicacion,
                l.estado,
                l.activo,

                CASE
                    WHEN ultimo_movimiento.tipo = 'RETIRO'
                    THEN CONCAT(p.nombre, ' ', p.apellido)
                    ELSE NULL
                END AS persona_actual,

                CASE
                    WHEN ultimo_movimiento.tipo = 'RETIRO'
                    THEN ultimo_movimiento.fecha_hora
                    ELSE NULL
                END AS fecha_retiro

            FROM llaves l

            LEFT JOIN (
                SELECT m.*
                FROM movimientos m
                INNER JOIN (
                    SELECT
                        llave_id,
                        MAX(id) AS ultimo_id
                    FROM movimientos
                    GROUP BY llave_id
                ) ultimos
                    ON m.id = ultimos.ultimo_id
            ) ultimo_movimiento
                ON l.id = ultimo_movimiento.llave_id

            LEFT JOIN personas p
                ON ultimo_movimiento.persona_id = p.id

            ORDER BY l.nombre
        `);

    res.json(rows);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Error al obtener las llaves",
    });
  }
});

// Una llave específica + historial del día
router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const [keyRows] = await pool.execute(
      `
            SELECT
                id,
                nombre,
                codigo,
                ubicacion,
                estado,
                activo
            FROM llaves
            WHERE id = ?
            `,
      [id],
    );

    const keys = keyRows as {
      id: number;
      nombre: string;
      codigo: string;
      ubicacion: string;
      estado: string;
      activo: number;
    }[];

    if (keys.length === 0) {
      return res.status(404).json({
        message: "Llave no encontrada",
      });
    }

    const [movementRows] = await pool.execute(
      `
            SELECT
                m.id,
                m.tipo,
                m.fecha_hora,
                CONCAT(p.nombre, ' ', p.apellido) AS persona
            FROM movimientos m
            INNER JOIN personas p
                ON m.persona_id = p.id
            WHERE m.llave_id = ?
              AND DATE(m.fecha_hora) = CURDATE()
            ORDER BY m.fecha_hora DESC
            `,
      [id],
    );

    res.json({
      llave: keys[0],
      historial: movementRows,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Error al obtener la información de la llave",
    });
  }
});

// Historial de una llave
router.get("/:id/movimientos", async (req, res) => {
  try {
    const { id } = req.params;

    const [rows] = await pool.execute(
      `
            SELECT
                m.id,
                m.tipo,
                m.fecha_hora,
                CONCAT(p.nombre, ' ', p.apellido) AS persona
            FROM movimientos m
            INNER JOIN personas p
                ON m.persona_id = p.id
            WHERE m.llave_id = ?
              AND DATE(m.fecha_hora) = CURDATE()
            ORDER BY m.fecha_hora DESC
            `,
      [id],
    );

    res.json(rows);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Error al obtener el historial",
    });
  }
});

export default router;
