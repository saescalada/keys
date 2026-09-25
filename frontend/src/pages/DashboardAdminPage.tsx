import { useEffect, useState } from "react";

import KeyCard from "../components/keys/KeyCard";
import KeyDetailModal from "../components/keys/KeyDetailModal";
import Sidebar from "../components/layout/Sidebar";
import StatsCard from "../components/dashboard/StatsCard";

import { getKeyById, getKeys } from "../services/keysApi";

import type { Llave } from "../types/key";
import type { Movimiento } from "../types/movement";

// Responsabilidad: componer la pantalla principal del tablero.
// Esta página coordina estado, efectos y componentes de interfaz.
function DashboardAdminPage() {
  const [llaves, setLlaves] = useState<Llave[]>([]);

  const [llaveSeleccionada, setLlaveSeleccionada] = useState<Llave | null>(
    null,
  );

  const [historial, setHistorial] = useState<Movimiento[]>([]);

  const [mostrarModal, setMostrarModal] = useState(false);

  useEffect(() => {
    // useEffect con [] se ejecuta una vez al montar la página.
    // Es el lugar adecuado para cargar datos iniciales desde la API.
    getKeys()
      .then((data) => {
        setLlaves(data);
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  }, []);

  async function actualizarLlaves() {
    try {
      const data = await getKeys();

      setLlaves(data);
    } catch (error) {
      console.error("Error al actualizar las llaves:", error);
    }
  }

  const disponibles = llaves.filter(
    (llave) => llave.estado === "DISPONIBLE",
  ).length;

  const retiradas = llaves.filter(
    (llave) => llave.estado === "RETIRADA",
  ).length;

  const verLlave = async (llave: Llave) => {
    try {
      // El componente recibe la llave clickeada, pero pedimos el detalle
      // actualizado al backend antes de mostrar la información completa.
      const data = await getKeyById(llave.id);

      setLlaveSeleccionada(data.llave);
      setHistorial(data.historial);
      setMostrarModal(true);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <div className="admin-layout">
      <Sidebar />
      <main className="admin-content">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <div>
            <h1 className="page-title mb-1">Tablero de llaves</h1>

            <p className="text-muted mb-0">
              Gestión y control de las llaves de la institución
            </p>
          </div>

          <button type="button" className="btn btn-dark" onClick={actualizarLlaves}>
            <i className="bi bi-arrow-clockwise me-2"></i>
            Actualizar
          </button>
        </div>

        <div className="row g-4 mb-4">
          <div className="col-md-4">
            <StatsCard
              label="Total de llaves"
              value={llaves.length}
              icon="bi bi-key-fill"
            />
          </div>

          <div className="col-md-4">
            <StatsCard
              label="Disponibles"
              value={disponibles}
              icon="bi bi-check-circle-fill"
              variant="available"
            />
          </div>

          <div className="col-md-4">
            <StatsCard
              label="Retiradas"
              value={retiradas}
              icon="bi bi-person-fill"
              variant="borrowed"
            />
          </div>
        </div>

        <div className="section-header mb-3">
          <div>
            <h2>Llaves</h2>

            <span className="text-muted">
              Seleccioná una llave para consultar su información
            </span>
          </div>
        </div>

        <div className="row g-4">
          {llaves.map((llave) => (
            <div className="col-sm-6 col-lg-4 col-xl-3" key={llave.id}>
              <KeyCard llave={llave} onClick={() => verLlave(llave)} />
            </div>
          ))}
        </div>
      </main>
      <KeyDetailModal
        llave={llaveSeleccionada}
        historial={historial}
        onMovementCreated={actualizarLlaves}
        mostrar={mostrarModal}
        onClose={() => setMostrarModal(false)}
      />{" "}
    </div>
  );
}

export default DashboardAdminPage;
