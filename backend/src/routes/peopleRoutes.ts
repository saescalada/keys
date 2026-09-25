import { Router } from "express";
import { pool } from "../config/database.js";
import { requireAuth } from "../middleware/authMiddleware.js";

const router = Router();

router.get("/", requireAuth, async (_req, res) => {
  try {
    const [rows] = await pool.query("SELECT * FROM personas");

    res.json(rows);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Error al obtener las personas",
    });
  }
});

router.get("/activas", async (_req, res) => {
  try {
    const [rows] = await pool.execute(`
      SELECT
        id,
        nombre,
        apellido
      FROM personas
      WHERE activo = TRUE
      ORDER BY apellido, nombre
    `);

    res.json(rows);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Error al obtener las personas activas",
    });
  }
});

router.get("/:id", requireAuth, async (req, res) => {
  try {
    const { id } = req.params;

    const [rows] = await pool.execute(
      `
            SELECT
                id,
                nombre,
                apellido,
                dni,
                activo
            FROM personas
            WHERE id = ?
            `,
      [id],
    );

    const personas = rows as {
      id: number;
      nombre: string;
      apellido: string;
      dni: string;
      activo: number;
    }[];

    if (personas.length === 0) {
      return res.status(404).json({
        message: "Persona no encontrada",
      });
    }

    res.json(personas[0]);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Error al obtener la persona",
    });
  }
});

//add person
router.post("/", requireAuth, async (req, res) => {
  try {
    const { nombre, apellido, dni } = req.body;

    // Validamos los campos obligatorios.
    if (!nombre || !apellido || !dni) {
      return res.status(400).json({
        message: "Nombre, apellido y DNI son obligatorios",
      });
    }

    // Comprobamos si ya existe una persona con ese DNI.
    const [existingRows] = await pool.execute(
      `
            SELECT id
            FROM personas
            WHERE dni = ?
            `,
      [dni],
    );

    const existingPeople = existingRows as {
      id: number;
    }[];

    if (existingPeople.length > 0) {
      return res.status(409).json({
        message: "Ya existe una persona con ese DNI",
      });
    }

    // Creamos la persona.
    const [result] = await pool.execute(
      `
            INSERT INTO personas (
                nombre,
                apellido,
                dni,
                activo
            )
            VALUES (?, ?, ?, TRUE)
            `,
      [nombre, apellido, dni],
    );

    const insertResult = result as {
      insertId: number;
    };

    res.status(201).json({
      message: "Persona creada correctamente",
      personaId: insertResult.insertId,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Error al crear la persona",
    });
  }
});

router.put("/:id", requireAuth, async (req, res) => {
  try {
    const { id } = req.params;
    const { nombre, apellido, dni } = req.body;

    // Validamos los campos obligatorios.
    if (!nombre || !apellido || !dni) {
      return res.status(400).json({
        message: "Nombre, apellido y DNI son obligatorios",
      });
    }

    // Verificamos que la persona exista.
    const [personRows] = await pool.execute(
      `
            SELECT id
            FROM personas
            WHERE id = ?
            `,
      [id],
    );

    const personas = personRows as {
      id: number;
    }[];

    if (personas.length === 0) {
      return res.status(404).json({
        message: "Persona no encontrada",
      });
    }

    // Verificamos que el DNI no pertenezca a otra persona.
    const [dniRows] = await pool.execute(
      `
            SELECT id
            FROM personas
            WHERE dni = ?
              AND id <> ?
            `,
      [dni, id],
    );

    const personasConMismoDni = dniRows as {
      id: number;
    }[];

    if (personasConMismoDni.length > 0) {
      return res.status(409).json({
        message: "El DNI ya pertenece a otra persona",
      });
    }

    // Actualizamos la persona.
    await pool.execute(
      `
            UPDATE personas
            SET
                nombre = ?,
                apellido = ?,
                dni = ?
            WHERE id = ?
            `,
      [nombre, apellido, dni, id],
    );

    res.json({
      message: "Persona actualizada correctamente",
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Error al actualizar la persona",
    });
  }
});

router.patch("/:id/estado", requireAuth, async (req, res) => {
  try {
    const { id } = req.params;
    const { activo } = req.body;

    // El valor activo debe ser booleano.
    if (typeof activo !== "boolean") {
      return res.status(400).json({
        message: "El campo activo debe ser booleano",
      });
    }

    // Verificamos que la persona exista.
    const [personRows] = await pool.execute(
      `
            SELECT id
            FROM personas
            WHERE id = ?
            `,
      [id],
    );

    const personas = personRows as {
      id: number;
    }[];

    if (personas.length === 0) {
      return res.status(404).json({
        message: "Persona no encontrada",
      });
    }

    // Actualizamos el estado.
    await pool.execute(
      `
            UPDATE personas
            SET activo = ?
            WHERE id = ?
            `,
      [activo, id],
    );

    res.json({
      message: activo
        ? "Persona activada correctamente"
        : "Persona desactivada correctamente",
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Error al cambiar el estado de la persona",
    });
  }
});

export default router;
