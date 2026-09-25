import { useState } from "react";
import type { Persona } from "../../types/person";

type FormData = {
  nombre: string;
  apellido: string;
  dni: string;
};

type Props = {
  persona: Persona | null;
  onSave: (data: FormData) => void;
  onClose: () => void;
  error?: string;
};

function PersonFormModal({ persona, onSave, onClose, error }: Props) {
  const [nombre, setNombre] = useState("");
  const [apellido, setApellido] = useState("");
  const [dni, setDni] = useState("");

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    onSave({
      nombre: nombre.trim(),
      apellido: apellido.trim(),
      dni: dni.trim(),
    });
  }

  const editando = persona !== null;

  return (
    <div
      className="modal d-block"
      style={{
        backgroundColor: "rgba(0, 0, 0, 0.5)",
      }}
    >
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content border-0 shadow-lg">
          <div className="modal-header border-0 px-4 pt-4">
            <div>
              <h5 className="modal-title fw-bold">
                {editando ? "Editar persona" : "Nueva persona"}
              </h5>

              <p className="text-muted small mb-0">
                {editando
                  ? "Modificá los datos de la persona."
                  : "Agregá una persona al sistema."}
              </p>
            </div>

            <button type="button" className="btn-close" onClick={onClose} />
          </div>

          <form onSubmit={handleSubmit}>
            <div className="modal-body px-4">
              {error && <div className="alert alert-danger py-2">{error}</div>}

              <div className="mb-3">
                <label htmlFor="nombre" className="form-label fw-semibold">
                  Nombre
                </label>

                <input
                  id="nombre"
                  type="text"
                  className="form-control form-control-lg"
                  value={nombre}
                  onChange={(event) => setNombre(event.target.value)}
                  required
                />
              </div>

              <div className="mb-3">
                <label htmlFor="apellido" className="form-label fw-semibold">
                  Apellido
                </label>

                <input
                  id="apellido"
                  type="text"
                  className="form-control form-control-lg"
                  value={apellido}
                  onChange={(event) => setApellido(event.target.value)}
                  required
                />
              </div>

              <div className="mb-2">
                <label htmlFor="dni" className="form-label fw-semibold">
                  DNI
                </label>

                <input
                  id="dni"
                  type="text"
                  className="form-control form-control-lg"
                  value={dni}
                  onChange={(event) => setDni(event.target.value)}
                  required
                />
              </div>
            </div>

            <div className="modal-footer border-0 px-4 pb-4">
              <button type="button" className="btn btn-light" onClick={onClose}>
                Cancelar
              </button>

              <button type="submit" className="btn btn-dark px-4">
                {editando ? "Guardar cambios" : "Crear persona"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default PersonFormModal;
