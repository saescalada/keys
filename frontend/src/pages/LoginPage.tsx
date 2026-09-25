import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { login } from "../services/authApi";

function LoginPage() {
  const [usuario, setUsuario] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const handleLogin = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    setError("");

    try {
      await login(usuario, password);

      navigate("/admin");
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError("Error al iniciar sesión");
      }
    }
  };

  return (
    <div className="login-page">
      <div className="login-card">
        <div className="text-center mb-4">
          <div className="key-icon mx-auto mb-3">
            <i className="bi bi-key-fill"></i>
          </div>

          <h1 className="h3 fw-bold mb-1">Keys</h1>

          <p className="text-muted mb-0">Acceso administrativo</p>
        </div>

        <form onSubmit={handleLogin}>
          <div className="mb-3">
            <label htmlFor="usuario" className="form-label">
              Usuario
            </label>

            <input
              id="usuario"
              type="text"
              className="form-control"
              value={usuario}
              onChange={(event) => setUsuario(event.target.value)}
              placeholder="Ingresá tu usuario"
            />
          </div>

          <div className="mb-3">
            <label htmlFor="password" className="form-label">
              Contraseña
            </label>

            <input
              id="password"
              type="password"
              className="form-control"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder="Ingresá tu contraseña"
            />
          </div>

          {error && <div className="alert alert-danger">{error}</div>}

          <button type="submit" className="btn btn-dark w-100">
            Iniciar sesión
          </button>
        </form>
      </div>
    </div>
  );
}

export default LoginPage;
