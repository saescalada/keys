import { useEffect, useMemo, useState } from "react";

import PersonCard from "../components/people/PersonCard";
import PersonFormModal from "../components/people/PersonFormModal";
import Sidebar from "../components/layout/Sidebar";

import {
  createPerson,
  getPeople,
  updatePerson,
  updatePersonStatus,
} from "../services/peopleApi";

import type { Persona } from "../types/person";

type StatusFilter = "TODOS" | "ACTIVOS" | "INACTIVOS";

function PeoplePage() {
  const [personas, setPersonas] = useState<Persona[]>([]);
  const [loading, setLoading] = useState(true);

  const [busqueda, setBusqueda] = useState("");
  const [filtroEstado, setFiltroEstado] = useState<StatusFilter>("TODOS");

  const [mostrarFormulario, setMostrarFormulario] = useState(false);

  const [personaEditando, setPersonaEditando] = useState<Persona | null>(null);

  const [error, setError] = useState("");

  /*
   * Carga inicial de las personas.
   *
   * Este useEffect se ejecuta una sola vez cuando
   * el componente se monta.
   */
  useEffect(() => {
    async function cargarPersonasIniciales() {
      try {
        setLoading(true);
        setError("");

        const data = await getPeople();

        setPersonas(data);
      } catch (error) {
        if (error instanceof Error) {
          setError(error.message);
        } else {
          setError("Error al cargar las personas");
        }
      } finally {
        setLoading(false);
      }
    }

    cargarPersonasIniciales();
  }, []);

  /*
   * Vuelve a consultar la lista de personas.
   *
   * La utilizamos después de crear, editar
   * o cambiar el estado de una persona.
   */
  async function cargarPersonas() {
    try {
      setLoading(true);
      setError("");

      const data = await getPeople();

      setPersonas(data);
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError("Error al cargar las personas");
      }
    } finally {
      setLoading(false);
    }
  }

  function abrirNuevaPersona() {
    setError("");
    setPersonaEditando(null);
    setMostrarFormulario(true);
  }

  function editarPersona(persona: Persona) {
    setError("");
    setPersonaEditando(persona);
    setMostrarFormulario(true);
  }

  async function cambiarEstado(persona: Persona) {
    try {
      setError("");

      await updatePersonStatus(persona.id, persona.activo === 0);

      await cargarPersonas();
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError("Error al cambiar el estado");
      }
    }
  }

  async function guardarPersona(data: {
    nombre: string;
    apellido: string;
    dni: string;
  }) {
    try {
      setError("");

      if (personaEditando) {
        await updatePerson(personaEditando.id, data);
      } else {
        await createPerson(data);
      }

      setMostrarFormulario(false);
      setPersonaEditando(null);

      await cargarPersonas();
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError("Error al guardar la persona");
      }
    }
  }

  /*
   * Filtra las personas según:
   * - texto de búsqueda
   * - estado seleccionado
   *
   * useMemo evita recalcular el resultado
   * si no cambiaron estos valores.
   */
  const personasFiltradas = useMemo(() => {
    const texto = busqueda.trim().toLowerCase();

    return personas.filter((persona) => {
      const coincideBusqueda =
        !texto ||
        persona.nombre.toLowerCase().includes(texto) ||
        persona.apellido.toLowerCase().includes(texto) ||
        persona.dni.toLowerCase().includes(texto);

      const coincideEstado =
        filtroEstado === "TODOS" ||
        (filtroEstado === "ACTIVOS" && persona.activo === 1) ||
        (filtroEstado === "INACTIVOS" && persona.activo === 0);

      return coincideBusqueda && coincideEstado;
    });
  }, [personas, busqueda, filtroEstado]);

  const personasActivas = personas.filter(
    (persona) => persona.activo === 1,
  ).length;

  const personasInactivas = personas.filter(
    (persona) => persona.activo === 0,
  ).length;

  return (
    <div className="admin-layout">
      <Sidebar />

      <main className="admin-content">
        {/* Encabezado */}
        <div className="d-flex justify-content-between align-items-center mb-4">
          <div>
            <span className="text-muted small">Administración</span>

            <h1 className="h3 fw-bold mb-1">Personal</h1>

            <p className="text-muted mb-0">
              Gestioná las personas que pueden utilizar las llaves.
            </p>
          </div>

          <button className="btn btn-dark" onClick={abrirNuevaPersona}>
            <i className="bi bi-person-plus-fill me-2" />
            Nueva persona
          </button>
        </div>

        {/* Resumen */}
        <div className="row g-3 mb-4">
          <div className="col-md-4">
            <div className="people-summary-card">
              <div className="summary-icon">
                <i className="bi bi-people-fill" />
              </div>

              <div>
                <small>Total</small>
                <strong>{personas.length}</strong>
              </div>
            </div>
          </div>

          <div className="col-md-4">
            <div className="people-summary-card">
              <div className="summary-icon success">
                <i className="bi bi-person-check-fill" />
              </div>

              <div>
                <small>Activos</small>
                <strong>{personasActivas}</strong>
              </div>
            </div>
          </div>

          <div className="col-md-4">
            <div className="people-summary-card">
              <div className="summary-icon secondary">
                <i className="bi bi-person-x-fill" />
              </div>

              <div>
                <small>Inactivos</small>
                <strong>{personasInactivas}</strong>
              </div>
            </div>
          </div>
        </div>

        {error && !mostrarFormulario && (
          <div className="alert alert-danger">{error}</div>
        )}

        {/* Buscador y filtros */}
        <div className="people-toolbar">
          <div className="search-box">
            <i className="bi bi-search" />

            <input
              type="text"
              placeholder="Buscar por nombre, apellido o DNI..."
              value={busqueda}
              onChange={(event) => setBusqueda(event.target.value)}
            />
          </div>

          <div className="filter-buttons">
            <button
              type="button"
              className={
                filtroEstado === "TODOS"
                  ? "filter-button active"
                  : "filter-button"
              }
              onClick={() => setFiltroEstado("TODOS")}
            >
              Todos
            </button>

            <button
              type="button"
              className={
                filtroEstado === "ACTIVOS"
                  ? "filter-button active"
                  : "filter-button"
              }
              onClick={() => setFiltroEstado("ACTIVOS")}
            >
              Activos
            </button>

            <button
              type="button"
              className={
                filtroEstado === "INACTIVOS"
                  ? "filter-button active"
                  : "filter-button"
              }
              onClick={() => setFiltroEstado("INACTIVOS")}
            >
              Inactivos
            </button>
          </div>
        </div>

        {/* Contador */}
        <div className="d-flex justify-content-between align-items-center mb-3">
          <span className="text-muted small">
            {personasFiltradas.length}{" "}
            {personasFiltradas.length === 1
              ? "persona encontrada"
              : "personas encontradas"}
          </span>
        </div>

        {/* Listado */}
        {loading ? (
          <div className="text-center py-5">
            <div className="spinner-border" role="status">
              <span className="visually-hidden">Cargando...</span>
            </div>
          </div>
        ) : personasFiltradas.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">
              <i className="bi bi-person-x" />
            </div>

            <h5>No encontramos personas</h5>

            <p className="text-muted mb-0">
              Probá cambiar la búsqueda o el filtro.
            </p>
          </div>
        ) : (
          <div className="people-list">
            {personasFiltradas.map((persona) => (
              <PersonCard
                key={persona.id}
                persona={persona}
                onEdit={() => editarPersona(persona)}
                onToggleStatus={() => cambiarEstado(persona)}
              />
            ))}
          </div>
        )}

        {mostrarFormulario && (
          <PersonFormModal
            key={personaEditando?.id ?? "new"}
            persona={personaEditando}
            error={error}
            onSave={guardarPersona}
            onClose={() => {
              setMostrarFormulario(false);
              setPersonaEditando(null);
              setError("");
            }}
          />
        )}
      </main>
    </div>
  );
}

export default PeoplePage;
