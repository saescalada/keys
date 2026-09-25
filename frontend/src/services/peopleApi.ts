import type { Persona } from "../types/person";

const API_URL = "http://localhost:3000/api";

export async function getPeople(): Promise<Persona[]> {
  const response = await fetch(`${API_URL}/personas`, {
    credentials: "include",
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Error al obtener las personas");
  }

  return data;
}

export async function getActivePeople() {
  const response = await fetch(`${API_URL}/personas/activas`);

  if (!response.ok) {
    throw new Error("Error al obtener las personas activas");
  }

  return response.json();
}

export async function createPerson(persona: {
  nombre: string;
  apellido: string;
  dni: string;
}) {
  const response = await fetch(`${API_URL}/personas`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify(persona),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Error al crear la persona");
  }

  return data;
}

export async function updatePerson(
  id: number,
  persona: {
    nombre: string;
    apellido: string;
    dni: string;
  },
) {
  const response = await fetch(`${API_URL}/personas/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify(persona),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Error al actualizar la persona");
  }

  return data;
}

export async function updatePersonStatus(id: number, activo: boolean) {
  const response = await fetch(`${API_URL}/personas/${id}/estado`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify({ activo }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Error al cambiar el estado");
  }

  return data;
}
