import { Router } from "express";
import { pool } from "../config/database.js";

const router = Router();

router.post("/", async (req, res) => {
  const { llaveId, personaId, tipo } = req.body;

  // 1. Validar que lleguen los datos necesarios
  if (!llaveId || !personaId || !tipo) {
    return res.status(400).json({
      message: "llaveId, personaId y tipo son obligatorios",
    });
  }

  // 2. Validar que tipo sea válido
  if (tipo !== "RETIRO" && tipo !== "DEVOLUCION") {
    return res.status(400).json({
      message: "El tipo debe ser RETIRO o DEVOLUCION",
    });
  }

  // Obtenemos una conexión específica del pool.
  const connection = await pool.getConnection();

  try {
    // 3. Comenzamos la transacción
    await connection.beginTransaction();

    // 4. Buscar la llave
    const [keyRows] = await connection.execute(
      `
            SELECT id, estado
            FROM llaves
            WHERE id = ?
            `,
      [llaveId],
    );

    const keys = keyRows as {
      id: number;
      estado: "DISPONIBLE" | "RETIRADA" | "INACTIVA";
    }[];

    if (keys.length === 0) {
      await connection.rollback();

      return res.status(404).json({
        message: "La llave no existe",
      });
    }

    const llave = keys[0];

    // 5. Buscar la persona
    const [personRows] = await connection.execute(
      `
            SELECT id
            FROM personas
            WHERE id = ?
              AND activo = TRUE
            `,
      [personaId],
    );

    const personas = personRows as {
      id: number;
    }[];

    if (personas.length === 0) {
      await connection.rollback();

      return res.status(404).json({
        message: "La persona no existe o está inactiva",
      });
    }

    // 6. Validar estado de la llave
    if (tipo === "RETIRO" && llave.estado !== "DISPONIBLE") {
      await connection.rollback();

      return res.status(409).json({
        message: "La llave no está disponible",
      });
    }

    if (tipo === "DEVOLUCION" && llave.estado !== "RETIRADA") {
      await connection.rollback();

      return res.status(409).json({
        message: "La llave no está retirada",
      });
    }

    // 7. Registrar el movimiento
    const [movementResult] = await connection.execute(
      `
            INSERT INTO movimientos (llave_id, persona_id, tipo)
            VALUES (?, ?, ?)
            `,
      [llaveId, personaId, tipo],
    );

    // 8. Cambiar el estado de la llave
    const nuevoEstado = tipo === "RETIRO" ? "RETIRADA" : "DISPONIBLE";

    await connection.execute(
      `
            UPDATE llaves
            SET estado = ?
            WHERE id = ?
            `,
      [nuevoEstado, llaveId],
    );

    // 9. Confirmamos todos los cambios
    await connection.commit();

    res.status(201).json({
      message: "Movimiento registrado correctamente",
      data: {
        movimientoId: (movementResult as any).insertId,
        llaveId,
        personaId,
        tipo,
        estadoLlave: nuevoEstado,
      },
    });
  } catch (error) {
    // Si algo falló, deshacemos todo
    await connection.rollback();

    console.error(error);

    res.status(500).json({
      message: "Error al registrar el movimiento",
    });
  } finally {
    // Devolvemos la conexión al pool
    connection.release();
  }
});

router.get("/", async (_req, res) => {
  try {
    const [rows] = await pool.execute(`
            SELECT
                m.id,
                m.tipo,
                m.fecha_hora,
                l.id AS llave_id,
                l.nombre AS llave,
                CONCAT(p.nombre, ' ', p.apellido) AS persona
            FROM movimientos m
            INNER JOIN llaves l
                ON m.llave_id = l.id
            INNER JOIN personas p
                ON m.persona_id = p.id
            ORDER BY m.fecha_hora DESC
        `);

    res.json(rows);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Error al obtener los movimientos",
    });
  }
});

export default router;
