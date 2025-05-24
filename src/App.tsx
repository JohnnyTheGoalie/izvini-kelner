import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate, Link, useLocation } from "react-router-dom";
import WaiterHome from "./pages/WaiterHome";
import TableDash from "./pages/TableDash";
import MenuPage from "./pages/MenuPage";
import LoginPage from "./pages/LoginPage";
import Banner from "./components/Banner";
import FullScreenToggleButton from "./components/FullScreenToggleButton";
import "./index.css";

const isAuthenticated = () => !!localStorage.getItem("authToken");

const ProtectedRoute = ({ children }: { children: JSX.Element }) => {
  const location = useLocation();
  return isAuthenticated() ? (
    children
  ) : (
    <Navigate to="/login" replace state={{ from: location }} />
  );
};

const App: React.FC = () => {
  return (
    <Router>
      <nav
        className="fixed top-0 left-0 w-full z-50 px-4 py-3 flex items-center justify-center space-x-8"
        style={{ backgroundColor: "var(--color-primary)" }}
      >
        <Banner />
        <Link to="/home" className="text-white hover:text-gray-200 transition font-semibold">
          Waiter Dashboard
        </Link>
        <Link to="/tables" className="text-white hover:text-gray-200 transition font-semibold">
          Table Dashboard
        </Link>
        <Link to="/menu" className="text-white hover:text-gray-200 transition font-semibold">
          Menu Dashboard
        </Link>
        <button
          onClick={() => {
            localStorage.removeItem("authToken");
            window.location.href = "/login";
          }}
          className="text-white hover:text-gray-200 transition font-semibold"
        >
          Logout
        </button>
        <FullScreenToggleButton />
      </nav>

      <div className="pt-20 min-h-screen" style={{ backgroundColor: "var(--color-background)" }}>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route
            path="/home"
            element={
              <ProtectedRoute>
                <WaiterHome />
              </ProtectedRoute>
            }
          />
          <Route
            path="/tables"
            element={
              <ProtectedRoute>
                <TableDash />
              </ProtectedRoute>
            }
          />
          <Route
            path="/menu"
            element={
              <ProtectedRoute>
                <MenuPage />
              </ProtectedRoute>
            }
          />
          {/* Redirect root to login */}
          <Route path="/" element={<Navigate to="/login" replace />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
