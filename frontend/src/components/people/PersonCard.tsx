import type { Persona } from "../../types/person";

type Props = {
  persona: Persona;
  onEdit: () => void;
  onToggleStatus: () => void;
};

function PersonCard({ persona, onEdit, onToggleStatus }: Props) {
  const activo = persona.activo === 1;

  const iniciales =
    `${persona.nombre.charAt(0)}${persona.apellido.charAt(0)}`.toUpperCase();

  return (
    <div className="person-card">
      <div className="person-main">
        <div className="person-avatar">{iniciales}</div>

        <div className="person-info">
          <div className="d-flex align-items-center gap-2 flex-wrap">
            <h5 className="person-name mb-0">
              {persona.nombre} {persona.apellido}
            </h5>

            <span
              className={`status-dot ${
                activo ? "status-active" : "status-inactive"
              }`}
            >
              <span />
              {activo ? "Activo" : "Inactivo"}
            </span>
          </div>

          <div className="person-meta">
            <span>
              <i className="bi bi-credit-card-2-front me-1" />
              {persona.dni}
            </span>
          </div>
        </div>
      </div>

      <div className="person-actions">
        <button
          type="button"
          className="btn btn-light btn-sm"
          onClick={onEdit}
          title="Editar persona"
        >
          <i className="bi bi-pencil" />
        </button>

        <button
          type="button"
          className={`btn btn-sm ${
            activo ? "btn-outline-danger" : "btn-outline-success"
          }`}
          onClick={onToggleStatus}
          title={activo ? "Desactivar" : "Activar"}
        >
          <i
            className={`bi ${activo ? "bi-person-dash" : "bi-person-check"}`}
          />
        </button>
      </div>
    </div>
  );
}

export default PersonCard;
