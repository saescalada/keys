const API_URL = "http://localhost:3000/api";

export async function getMovements() {
  const response = await fetch(`${API_URL}/movimientos`);

  if (!response.ok) {
    throw new Error("Error al obtener el historial");
  }

  return response.json();
}

export async function createMovement(data: {
  llaveId: number;
  personaId: number;
  tipo: "RETIRO" | "DEVOLUCION";
}) {
  const response = await fetch(`${API_URL}/movimientos`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.message ?? "Error al registrar el movimiento");
  }

  return result;
}
