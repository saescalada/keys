import { useCallback, useEffect, useMemo, useState } from "react";

import KeyCard from "../components/keys/KeyCard";
import KeyDetailModal from "../components/keys/KeyDetailModal";

import { getKeys, getKeyById } from "../services/keysApi";

import type { Llave } from "../types/key";
import type { Movimiento } from "../types/movement";

function PersonalPage() {
  const [llaves, setLlaves] = useState<Llave[]>([]);
  const [mostrarModal, setMostrarModal] = useState(false);
  const [llaveSeleccionada, setLlaveSeleccionada] = useState<Llave | null>(
    null,
  );
  const [historial, setHistorial] = useState<Movimiento[]>([]);
  const [busqueda, setBusqueda] = useState("");
  const [filtro, setFiltro] = useState<"TODAS" | "DISPONIBLES" | "RETIRADAS">("TODAS");
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState("");

  const cargarLlaves = useCallback(async () => {
    try {
      setCargando(true);
      setError("");
      setLlaves(await getKeys());
    } catch (error) {
      console.error("Error al cargar las llaves:", error);
      setError("No se pudieron cargar las llaves. Intentá nuevamente.");
    } finally {
      setCargando(false);
    }
  }, []);

  useEffect(() => {
    void cargarLlaves();
  }, [cargarLlaves]);

  /*
   * Actualiza el estado de las llaves después
   * de registrar un retiro o devolución.
   */
  async function actualizarLlaves() {
    try {
      const data = await getKeys();

      setLlaves(data);
    } catch (error) {
      console.error("Error al actualizar las llaves:", error);
    }
  }

  const llavesFiltradas = useMemo(() => {
    const consulta = busqueda.trim().toLocaleLowerCase("es-AR");
    return llaves.filter((llave) => {
      const coincideBusqueda = [llave.codigo, llave.nombre, llave.ubicacion]
        .some((valor) => valor.toLocaleLowerCase("es-AR").includes(consulta));
      const coincideFiltro = filtro === "TODAS" ||
        (filtro === "DISPONIBLES" && llave.estado === "DISPONIBLE") ||
        (filtro === "RETIRADAS" && llave.estado === "RETIRADA");
      return coincideBusqueda && coincideFiltro;
    });
  }, [llaves, busqueda, filtro]);

  const disponibles = llaves.filter((llave) => llave.estado === "DISPONIBLE").length;
  const retiradas = llaves.filter((llave) => llave.estado === "RETIRADA").length;

  /*
   * Obtiene la información completa de la llave
   * y abre el modal.
   */
  async function verLlave(llave: Llave) {
    try {
      const data = await getKeyById(llave.id);

      setLlaveSeleccionada(data.llave);
      setHistorial(data.historial);
      setMostrarModal(true);
    } catch (error) {
      console.error("Error al obtener la llave:", error);
    }
  }

  return (
    <main className="personal-page">
      <div className="container py-3">
        {/* Encabezado */}
        <header className="personal-header">
          <h1>Llaves</h1>
          <p>Consultá la disponibilidad y seleccioná una llave</p>
        </header>

        <section className="public-key-board" aria-label="Tablero de llaves">
          <div className="public-key-summary" aria-label="Resumen de llaves">
            <span><strong>{llaves.length}</strong> en total</span>
            <span><strong>{disponibles}</strong> disponibles</span>
            <span><strong>{retiradas}</strong> retiradas</span>
          </div>

          <div className="public-key-toolbar">
            <label className="public-key-search">
              <i className="bi bi-search" aria-hidden="true" />
              <span className="visually-hidden">Buscar llaves</span>
              <input value={busqueda} onChange={(event) => setBusqueda(event.target.value)}
                placeholder="Buscar por código, nombre o ubicación" />
              {busqueda && <button type="button" onClick={() => setBusqueda("")} aria-label="Limpiar búsqueda">
                <i className="bi bi-x-lg" />
              </button>}
            </label>
            <div className="public-key-filters" role="group" aria-label="Filtrar llaves">
              {(["TODAS", "DISPONIBLES", "RETIRADAS"] as const).map((opcion) => (
                <button key={opcion} type="button" aria-pressed={filtro === opcion}
                  className={filtro === opcion ? "active" : ""} onClick={() => setFiltro(opcion)}>
                  {opcion === "TODAS" ? "Todas" : opcion === "DISPONIBLES" ? "Disponibles" : "Retiradas"}
                  <span>{opcion === "TODAS" ? llaves.length : opcion === "DISPONIBLES" ? disponibles : retiradas}</span>
                </button>
              ))}
            </div>
          </div>

          {cargando ? <div className="public-key-empty" role="status"><span className="spinner-border spinner-border-sm" /> Cargando llaves...</div>
            : error ? <div className="public-key-empty" role="alert"><i className="bi bi-exclamation-circle" /><p>{error}</p>
                <button type="button" className="btn btn-outline-light btn-sm" onClick={() => void cargarLlaves()}>Reintentar</button></div>
            : llavesFiltradas.length === 0 ? <div className="public-key-empty"><i className="bi bi-key" /><p>{llaves.length === 0 ? "Todavía no hay llaves para mostrar." : "No hay llaves que coincidan con la búsqueda."}</p></div>
            : <div className="row g-3">
                {llavesFiltradas.map((llave) => <div className="col-6 col-lg-3" key={llave.id}>
                  <KeyCard llave={llave} onClick={() => verLlave(llave)} />
                </div>)}
              </div>}
        </section>
      </div>

      {/* Detalle de la llave */}
      <KeyDetailModal
        llave={llaveSeleccionada}
        historial={historial}
        mostrar={mostrarModal}
        onClose={() => setMostrarModal(false)}
        onMovementCreated={actualizarLlaves}
      />
    </main>
  );
}

export default PersonalPage;
