// Responsabilidad: definir la forma de un movimiento de llave.
// Este tipo representa los registros que llegan desde el historial del backend.
export type Movimiento = {
  id: number;
  tipo: "RETIRO" | "DEVOLUCION";
  fecha_hora: string;
  llave_id: number;
  llave: string;
  persona_id: number;
  persona: string;
};
