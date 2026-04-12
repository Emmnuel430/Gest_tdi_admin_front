import "./App.css";
import React from "react";
import AppRoutes from "./routes"; // Importation des routes de l'application
import { ToastProvider } from "./context/ToastContext";
import ToastGlobal from "./components/Layout/ToastGlobal";

function App() {
  return (
    <div className="App">
      <ToastProvider>
        <ToastGlobal />
        <AppRoutes />{" "}
      </ToastProvider>
    </div>
  );
}

export default App;
