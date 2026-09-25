import { useEffect, useMemo, useState } from "react";

import Sidebar from "../components/layout/Sidebar";

import { getKeys } from "../services/keysApi";
import { getMovements } from "../services/movementsApi";

import type { Llave } from "../types/key";
import type { Movimiento } from "../types/movement";

function HistoryPage() {
  const [movimientos, setMovimientos] = useState<Movimiento[]>([]);
  const [llaves, setLlaves] = useState<Llave[]>([]);

  const [llaveSeleccionada, setLlaveSeleccionada] = useState<string>("TODAS");

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  /*
   * Carga el historial y las llaves al entrar a la página.
   *
   * Necesitamos las llaves para poder mostrar el selector
   * y los movimientos para construir el historial.
   */
  useEffect(() => {
    async function cargarDatos() {
      try {
        setLoading(true);
        setError("");

        const [movimientosData, llavesData] = await Promise.all([
          getMovements(),
          getKeys(),
        ]);

        setMovimientos(movimientosData);
        setLlaves(llavesData);
      } catch (error) {
        if (error instanceof Error) {
          setError(error.message);
        } else {
          setError("Error al cargar el historial");
        }
      } finally {
        setLoading(false);
      }
    }

    cargarDatos();
  }, []);

  /*
   * Filtramos los movimientos según la llave seleccionada.
   *
   * Si está seleccionado "TODAS", mostramos todo el historial.
   */
  const movimientosFiltrados = useMemo(() => {
    if (llaveSeleccionada === "TODAS") {
      return movimientos;
    }

    return movimientos.filter(
      (movimiento) => movimiento.llave_id === Number(llaveSeleccionada),
    );
  }, [movimientos, llaveSeleccionada]);

  /*
   * Convierte la fecha recibida desde el backend
   * en un formato más amigable para mostrar al usuario.
   */
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
    <div className="admin-layout">
      <Sidebar />

      <main className="admin-content">
        {/* Encabezado */}
        <div className="d-flex justify-content-between align-items-center mb-4">
          <div>
            <span className="text-muted small">Administración</span>

            <h1 className="page-title mb-1">Historial</h1>

            <p className="text-muted mb-0">
              Consultá los retiros y devoluciones de las llaves.
            </p>
          </div>
        </div>

        {/* Filtro */}
        <div className="card border-0 shadow-sm mb-4">
          <div className="card-body">
            <div className="row align-items-end g-3">
              <div className="col-md-6">
                <label htmlFor="llave" className="form-label">
                  Filtrar por llave
                </label>

                <select
                  id="llave"
                  className="form-select"
                  value={llaveSeleccionada}
                  onChange={(event) => setLlaveSeleccionada(event.target.value)}
                >
                  <option value="TODAS">Todas las llaves</option>

                  {llaves.map((llave) => (
                    <option key={llave.id} value={llave.id}>
                      {llave.nombre}
                    </option>
                  ))}
                </select>
              </div>

              <div className="col-md-6">
                <div className="text-muted small">
                  Mostrando <strong>{movimientosFiltrados.length}</strong>{" "}
                  {movimientosFiltrados.length === 1
                    ? "movimiento"
                    : "movimientos"}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Error */}
        {error && <div className="alert alert-danger">{error}</div>}

        {/* Historial */}
        <div className="card border-0 shadow-sm">
          <div className="card-body p-0">
            {loading ? (
              <div className="text-center py-5">
                <div className="spinner-border" role="status">
                  <span className="visually-hidden">Cargando...</span>
                </div>

                <p className="text-muted mt-3 mb-0">Cargando historial...</p>
              </div>
            ) : movimientosFiltrados.length === 0 ? (
              <div className="empty-state border-0">
                <div className="empty-icon">
                  <i className="bi bi-clock-history" />
                </div>

                <h5>No hay movimientos</h5>

                <p className="text-muted mb-0">
                  No encontramos movimientos para la llave seleccionada.
                </p>
              </div>
            ) : (
              <div className="table-responsive">
                <table className="table table-hover mb-0">
                  <thead>
                    <tr>
                      <th>Fecha y hora</th>
                      <th>Llave</th>
                      <th>Persona</th>
                      <th>Acción</th>
                    </tr>
                  </thead>

                  <tbody>
                    {movimientosFiltrados.map((movimiento) => (
                      <tr key={movimiento.id}>
                        <td>{formatearFecha(movimiento.fecha_hora)}</td>

                        <td>
                          <div className="d-flex align-items-center gap-2">
                            <div className="key-icon">
                              <i className="bi bi-key-fill" />
                            </div>

                            <span className="fw-semibold">
                              {movimiento.llave}
                            </span>
                          </div>
                        </td>

                        <td>
                          <div className="d-flex align-items-center gap-2">
                            <i className="bi bi-person" />

                            {movimiento.persona}
                          </div>
                        </td>

                        <td>
                          {movimiento.tipo === "RETIRO" ? (
                            <span className="badge text-bg-warning">
                              <i className="bi bi-box-arrow-up-right me-1" />
                              Retiro
                            </span>
                          ) : (
                            <span className="badge text-bg-success">
                              <i className="bi bi-box-arrow-in-down-right me-1" />
                              Devolución
                            </span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

export default HistoryPage;
