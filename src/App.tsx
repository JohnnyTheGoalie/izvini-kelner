import React from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import WaiterHome from "./pages/WaiterHome";
import TableDash from "./pages/TableDash";
import "./index.css";  // Import your custom CSS here
import MenuPage from "./pages/MenuPage";
import Banner from "./components/Banner";
import FullScreenToggleButton from "./components/FullScreenToggleButton";


const App: React.FC = () => {
  return (
    <Router>
      <nav
        className="fixed top-0 left-0 w-full z-50 px-4 py-3 flex items-center justify-center space-x-8"
        style={{ backgroundColor: 'var(--color-primary)' }}
      >
        <Banner />
        <Link to="/" className="text-white hover:text-gray-200 transition font-semibold">Waiter Dashboard</Link>
        <Link to="/tables" className="text-white hover:text-gray-200 transition font-semibold">Table Dashboard</Link>
        <Link to="/menu" className="text-white hover:text-gray-200 transition font-semibold">Menu Dashboard</Link>
        <FullScreenToggleButton /> {/* Add this line */}
      </nav>




      <div className="min-h-screen" style={{ backgroundColor: 'var(--color-background)' }}>
        <Routes>
          <Route path="/" element={<WaiterHome />} />
          <Route path="/tables" element={<TableDash />} />
          <Route path="/menu" element={<MenuPage />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
