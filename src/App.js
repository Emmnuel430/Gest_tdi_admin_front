import "./App.css";
import React from "react";
import AppRoutes from "./routes"; // Importation des routes de l'application
import { ToastProvider } from "./context/ToastContext";
import { AuthProvider } from "./context/AuthContext";
import ToastGlobal from "./components/Layout/ToastGlobal";

function App() {
  return (
    <div className="App">
      <AuthProvider>
        <ToastProvider>
          <ToastGlobal />
          <AppRoutes />{" "}
        </ToastProvider>
      </AuthProvider>
      +
    </div>
  );
}

export default App;
