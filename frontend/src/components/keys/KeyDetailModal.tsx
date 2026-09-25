import { useEffect, useState } from "react";

import { getActivePeople } from "../../services/peopleApi";
import { createMovement } from "../../services/movementsApi";

import type { Llave } from "../../types/key";
import type { Movimiento } from "../../types/movement";
import type { Persona } from "../../types/person";

type KeyDetailModalProps = {
  llave: Llave | null;
  historial: Movimiento[];
  onMovementCreated: () => void;
  mostrar: boolean;
  onClose: () => void;
};

function KeyDetailModal({
  llave,
  historial,
  onMovementCreated,
  mostrar,
  onClose,
}: KeyDetailModalProps) {
  const [personas, setPersonas] = useState<Persona[]>([]);
  const [personaSeleccionada, setPersonaSeleccionada] = useState("");
  const [procesando, setProcesando] = useState(false);
  const [error, setError] = useState("");
  const [busquedaPersona, setBusquedaPersona] = useState("");
  /*
   * Carga las personas activas cuando se selecciona una llave.
   */
  useEffect(() => {
    if (!llave) {
      return;
    }

    async function cargarPersonas() {
      try {
        const data = await getActivePeople();
        setPersonas(data);
      } catch (error) {
        console.error("Error al cargar personas:", error);
        setError("No se pudieron cargar las personas.");
      }
    }

    cargarPersonas();
  }, [llave]);

  /*
   * Mientras el modal esté abierto evitamos que
   * el body pueda desplazarse por detrás.
   */
  useEffect(() => {
    if (!mostrar) {
      return;
    }

    document.body.classList.add("modal-open");

    return () => {
      document.body.classList.remove("modal-open");
    };
  }, [mostrar]);

  /*
   * Permite cerrar el modal presionando Escape.
   */
  useEffect(() => {
    if (!mostrar) {
      return;
    }

    function manejarEscape(event: KeyboardEvent) {
      if (event.key === "Escape") {
        onClose();
      }
    }

    document.addEventListener("keydown", manejarEscape);

    return () => {
      document.removeEventListener("keydown", manejarEscape);
    };
  }, [mostrar, onClose]);

  if (!llave) {
    return null;
  }

  const disponible = llave.estado === "DISPONIBLE";

  const personasFiltradas = personas.filter((persona) => {
    const nombreCompleto =
      `${persona.nombre} ${persona.apellido}`.toLowerCase();

    return nombreCompleto.includes(busquedaPersona.toLowerCase());
  });

  async function registrarMovimiento(llaveActual: Llave) {
    if (!personaSeleccionada) {
      setError("Seleccioná una persona.");
      return;
    }

    try {
      setProcesando(true);
      setError("");

      await createMovement({
        llaveId: llaveActual.id,
        personaId: Number(personaSeleccionada),
        tipo: llaveActual.estado === "DISPONIBLE" ? "RETIRO" : "DEVOLUCION",
      });

      setPersonaSeleccionada("");

      onMovementCreated();
      onClose();
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError("Error al registrar el movimiento.");
      }
    } finally {
      setProcesando(false);
    }
  }

  function formatearFecha(fecha: string) {
    return new Date(fecha).toLocaleString("es-AR", {
      timeZone: "America/Argentina/Buenos_Aires",
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  }

  return (
    <>
      {mostrar && (
        <div className="modal-backdrop fade show" onClick={onClose} />
      )}

      <div
        className={`modal fade ${mostrar ? "show" : ""}`}
        tabIndex={-1}
        role="dialog"
        aria-modal={mostrar}
        aria-hidden={!mostrar}
        style={{
          display: mostrar ? "block" : "none",
          zIndex: 1055,
        }}
        onMouseDown={(event) => {
          if (event.target === event.currentTarget) {
            onClose();
          }
        }}
      >
        <div className="modal-dialog modal-dialog-centered modal-lg">
          <div
            className={`modal-content key-modal-content ${
              disponible ? "key-modal-available" : "key-modal-borrowed"
            }`}
          >
            {/* Header */}
            <div className="modal-header key-modal-header">
              <div className="key-modal-title-group">
                <div className="key-modal-icon">
                  <i className="bi bi-key-fill" />
                </div>

                <div>
                  <h5 className="modal-title mb-1">{llave.nombre}</h5>

                  <small>
                    {llave.codigo} · {llave.ubicacion}
                  </small>
                </div>
              </div>

              <button
                type="button"
                className="btn-close"
                aria-label="Cerrar"
                onClick={onClose}
                disabled={procesando}
              />
            </div>

            {/* Body */}
            <div className="modal-body key-modal-body">
              {/* Estado */}
              <div
                className={`key-modal-status ${
                  disponible
                    ? "key-modal-status-available"
                    : "key-modal-status-borrowed"
                }`}
              >
                <div className="key-modal-status-icon">
                  <i
                    className={`bi ${
                      disponible ? "bi-check-circle-fill" : "bi-person-fill"
                    }`}
                  />
                </div>

                <div>
                  <small>Estado actual</small>

                  <strong>{disponible ? "Disponible" : "Retirada"}</strong>
                </div>
              </div>

              {/* Información de quien tiene la llave */}
              {!disponible && llave.persona_actual && (
                <div className="key-modal-holder">
                  <div className="key-modal-section-label">
                    Actualmente la tiene
                  </div>

                  <div className="key-modal-holder-main">
                    <div className="key-modal-holder-icon">
                      <i className="bi bi-person-fill" />
                    </div>

                    <div>
                      <strong>{llave.persona_actual}</strong>

                      {llave.fecha_retiro && (
                        <small>
                          Desde {formatearFecha(llave.fecha_retiro)}
                        </small>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* Historial */}
              <div className="key-modal-section">
                <div className="key-modal-section-header">
                  <h6>
                    <i className="bi bi-clock-history me-2" />
                    Historial de hoy
                  </h6>

                  <span>{historial.length}</span>
                </div>

                {historial.length === 0 ? (
                  <div className="key-modal-empty">
                    No hay movimientos registrados hoy.
                  </div>
                ) : (
                  <div className="key-modal-history">
                    {historial.map((movimiento) => (
                      <div
                        key={movimiento.id}
                        className="key-modal-history-item"
                      >
                        <div
                          className={`key-modal-history-dot ${
                            movimiento.tipo === "RETIRO"
                              ? "retiro"
                              : "devolucion"
                          }`}
                        />

                        <div className="key-modal-history-info">
                          <strong>{movimiento.persona}</strong>

                          <small>{formatearFecha(movimiento.fecha_hora)}</small>
                        </div>

                        <span
                          className={`key-modal-history-type ${
                            movimiento.tipo === "RETIRO"
                              ? "retiro"
                              : "devolucion"
                          }`}
                        >
                          {movimiento.tipo === "RETIRO"
                            ? "Retiro"
                            : "Devolución"}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Operación */}
              <div className="key-modal-action">
                <div className="key-modal-section-header action">
                  <div>
                    <h6>{disponible ? "Retirar llave" : "Devolver llave"}</h6>

                    <small>
                      Seleccioná la persona que realiza la operación.
                    </small>
                  </div>
                </div>

                {error && (
                  <div className="alert alert-danger key-modal-error">
                    <i className="bi bi-exclamation-circle me-2" />
                    {error}
                  </div>
                )}

                <label htmlFor="personaOperacion" className="form-label">
                  Persona
                </label>

                <div className="key-modal-person-search">
                  <i className="bi bi-search key-modal-person-search-icon" />

                  <input
                    id="personaOperacion"
                    type="text"
                    className="key-modal-person-search-input"
                    placeholder="Buscar por nombre o apellido..."
                    value={busquedaPersona}
                    onChange={(event) => setBusquedaPersona(event.target.value)}
                    disabled={procesando}
                    autoComplete="off"
                  />

                  {busquedaPersona && (
                    <button
                      type="button"
                      className="key-modal-person-search-clear"
                      onClick={() => setBusquedaPersona("")}
                      disabled={procesando}
                      aria-label="Limpiar búsqueda"
                    >
                      <i className="bi bi-x-lg" />
                    </button>
                  )}

                  {busquedaPersona.trim() !== "" && (
                    <div className="key-modal-person-results">
                      {personasFiltradas.length > 0 ? (
                        personasFiltradas.map((persona) => (
                          <button
                            key={persona.id}
                            type="button"
                            className="key-modal-person-result"
                            onClick={() => {
                              setPersonaSeleccionada(String(persona.id));
                              setBusquedaPersona("");
                            }}
                            disabled={procesando}
                          >
                            <i className="bi bi-person-fill" />

                            <span>
                              {persona.nombre} {persona.apellido}
                            </span>
                          </button>
                        ))
                      ) : (
                        <div className="key-modal-person-no-results">
                          No se encontraron personas.
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {!personaSeleccionada ? (
                  <div className="key-modal-person-search">
                    {/* buscador */}
                  </div>
                ) : (
                  <div className="key-modal-person-selected">
                    <div className="key-modal-person-selected-main">
                      <div className="key-modal-person-selected-icon">
                        <i className="bi bi-person-fill" />
                      </div>

                      <span className="key-modal-person-selected-name">
                        {(() => {
                          const persona = personas.find(
                            (p) => String(p.id) === personaSeleccionada,
                          );

                          return persona
                            ? `${persona.nombre} ${persona.apellido}`
                            : "";
                        })()}
                      </span>
                    </div>

                    <button
                      type="button"
                      className="key-modal-person-selected-change"
                      onClick={() => {
                        setPersonaSeleccionada("");
                        setBusquedaPersona("");
                      }}
                      disabled={procesando}
                    >
                      Cambiar
                    </button>
                  </div>
                )}

                <button
                  type="button"
                  className={`btn key-modal-action-button ${
                    disponible
                      ? "key-modal-action-retiro"
                      : "key-modal-action-devolucion"
                  }`}
                  onClick={() => registrarMovimiento(llave)}
                  disabled={procesando}
                >
                  {procesando ? (
                    <>
                      <span
                        className="spinner-border spinner-border-sm me-2"
                        aria-hidden="true"
                      />
                      Procesando...
                    </>
                  ) : (
                    <>
                      <i
                        className={`bi ${
                          disponible
                            ? "bi-box-arrow-up-right"
                            : "bi-box-arrow-in-down-right"
                        } me-2`}
                      />

                      {disponible ? "Retirar llave" : "Registrar devolución"}
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default KeyDetailModal;
