import "./App.css";
import React from "react";
import { BrowserRouter } from "react-router-dom";
import AppRoutes from "./routes";
import { ToastProvider } from "./context/ToastContext";
import { AuthProvider } from "./context/AuthContext";
import ToastGlobal from "./components/Layout/ToastGlobal";

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <AuthProvider>
          <ToastProvider>
            <ToastGlobal />
            <AppRoutes />
          </ToastProvider>
        </AuthProvider>
      </BrowserRouter>
    </div>
  );
}

export default App;
