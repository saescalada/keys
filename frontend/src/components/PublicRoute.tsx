import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";

import { getCurrentUser } from "../services/authApi";

type Props = {
  children: React.ReactNode;
};

function PublicRoute({ children }: Props) {
  const [checking, setChecking] = useState(true);
  const [authenticated, setAuthenticated] = useState(false);

  useEffect(() => {
    async function checkAuthentication() {
      try {
        await getCurrentUser();

        setAuthenticated(true);
      } catch {
        setAuthenticated(false);
      } finally {
        setChecking(false);
      }
    }

    checkAuthentication();
  }, []);

  if (checking) {
    return (
      <div className="d-flex justify-content-center align-items-center min-vh-100">
        <div className="spinner-border" role="status">
          <span className="visually-hidden">Verificando sesión...</span>
        </div>
      </div>
    );
  }

  if (authenticated) {
    return <Navigate to="/admin" replace />;
  }

  return children;
}

export default PublicRoute;
