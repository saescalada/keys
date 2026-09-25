// Responsabilidad: definir la forma de una llave en un solo lugar.
// Al exportar este tipo, los componentes pueden compartir la misma definicion
// sin repetirla en distintos archivos.
export type Llave = {
  id: number;
  nombre: string;
  codigo: string;
  ubicacion: string;
  estado: "DISPONIBLE" | "RETIRADA" | "INACTIVA";
  activo: number;
  persona_actual: string | null;
  fecha_retiro: string | null;
};
