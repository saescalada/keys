import { useEffect, useState } from "react";

function calcularTiempoTranscurrido(fechaInicio: string, ahora: number) {
  const inicio = new Date(fechaInicio).getTime();
  const diferencia = Math.max(0, ahora - inicio);

  const segundosTotales = Math.floor(diferencia / 1000);
  const horas = Math.floor(segundosTotales / 3600);
  const minutos = Math.floor((segundosTotales % 3600) / 60);
  const segundos = segundosTotales % 60;

  return [horas, minutos, segundos]
    .map((valor) => String(valor).padStart(2, "0"))
    .join(":");
}

export function useElapsedTime(fechaInicio: string | null) {
  const [ahora, setAhora] = useState(() => Date.now());

  useEffect(() => {
    if (!fechaInicio) {
      return;
    }

    const interval = window.setInterval(() => {
      setAhora(Date.now());
    }, 1000);

    return () => {
      window.clearInterval(interval);
    };
  }, [fechaInicio]);

  if (!fechaInicio) {
    return "00:00:00";
  }

  return calcularTiempoTranscurrido(fechaInicio, ahora);
}
