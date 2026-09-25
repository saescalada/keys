import type { Llave } from "../types/key";
import type { Movimiento } from "../types/movement";

const API_URL = "http://localhost:3000/api";

type KeyDetailResponse = {
  llave: Llave;
  historial: Movimiento[];
};

// Responsabilidad: centralizar la comunicacion con la API de llaves.
// Asi los componentes no necesitan conocer URLs ni detalles de fetch.

export async function getKeys(): Promise<Llave[]> {
  const response = await fetch(`${API_URL}/llaves`);

  if (!response.ok) {
    throw new Error("Error al obtener las llaves");
  }

  return response.json();
}

export async function getKeyById(id: number): Promise<KeyDetailResponse> {
  const response = await fetch(`${API_URL}/llaves/${id}`);

  if (!response.ok) {
    throw new Error("No se pudo obtener la llave");
  }

  return response.json();
}
