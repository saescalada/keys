import type { Llave } from "../../types/key";
import { useElapsedTime } from "../../hooks/useElapsedTime";

type KeyCardProps = {
  llave: Llave;
  onClick: () => void;
};

function KeyCard({ llave, onClick }: KeyCardProps) {
  const disponible = llave.estado === "DISPONIBLE";
  const inactiva = llave.estado === "INACTIVA" || llave.activo === 0;

  const tiempoRetirada = useElapsedTime(
    disponible || inactiva ? null : llave.fecha_retiro,
  );

  return (
    <button
      type="button"
      className={`key-card ${
        inactiva ? "key-card-inactive" : disponible ? "key-card-available" : "key-card-borrowed"
      }`}
      onClick={onClick}
      aria-label={`${llave.codigo}, ${llave.nombre}, ${inactiva ? "inactiva" : disponible ? "disponible" : `retirada por ${llave.persona_actual ?? "una persona"}`}`}
    >
      <div className="key-card-icon">
        <i className="bi bi-key-fill" />
      </div>

      <div className="key-card-code">{llave.codigo}</div>
      <div className="key-card-name" title={llave.nombre}>{llave.nombre}</div>

      {inactiva ? <div className="key-card-available-info"><span>Inactiva</span></div> : disponible ? (
        <div className="key-card-available-info">
          <span className="key-status-dot" />
          <span>Disponible</span>
        </div>
      ) : (
        <div className="key-card-borrowed-info">
          {llave.persona_actual && (
            <div className="key-card-holder">
              <i className="bi bi-person-fill" />
              <span>{llave.persona_actual}</span>
            </div>
          )}

          <div className="key-card-timer">
            <i className="bi bi-stopwatch-fill" />
            <strong>{tiempoRetirada}</strong>
          </div>
        </div>
      )}
    </button>
  );
}

export default KeyCard;
