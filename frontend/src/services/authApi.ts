const API_URL = "http://localhost:3000/api";

type LoginResponse = {
  message: string;
  usuario: {
    id: number;
    usuario: string;
    nombre: string;
  };
};

export async function login(
  usuario: string,
  password: string,
): Promise<LoginResponse> {
  const response = await fetch(`${API_URL}/auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify({
      usuario,
      password,
    }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Error al iniciar sesión");
  }

  return data;
}

export async function logout() {
  const response = await fetch(`${API_URL}/auth/logout`, {
    method: "POST",
    credentials: "include",
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Error al cerrar sesión");
  }

  return data;
}

export async function getCurrentUser() {
  const response = await fetch(`${API_URL}/auth/me`, {
    method: "GET",
    credentials: "include",
  });

  if (!response.ok) {
    throw new Error("No autenticado");
  }

  return response.json();
}
