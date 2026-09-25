import { BrowserRouter, Routes, Route } from "react-router-dom";

import PersonalPage from "./pages/PersonalPage";
import LoginPage from "./pages/LoginPage";
import DashboardAdminPage from "./pages/DashboardAdminPage";

import ProtectedRoute from "./components/ProtectedRoute";
import PublicRoute from "./components/PublicRoute";
import PeoplePage from "./pages/PeoplePage";
import HistoryPage from "./pages/HistoryPage";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<PersonalPage />} />

        <Route
          path="/login"
          element={
            <PublicRoute>
              <LoginPage />
            </PublicRoute>
          }
        />
        <Route
          path="/admin/historial"
          element={
            <ProtectedRoute>
              <HistoryPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin"
          element={
            <ProtectedRoute>
              <DashboardAdminPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/personal"
          element={
            <ProtectedRoute>
              <PeoplePage />
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
