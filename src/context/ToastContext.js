import { createContext, useCallback, useContext, useState } from "react";

const ToastContext = createContext();

export const ToastProvider = ({ children }) => {
  const [toast, setToast] = useState({
    show: false,
    message: "",
    type: "info",
  });

  const showToast = useCallback((message, type = "info") => {
    setToast({ show: true, message, type });

    setTimeout(() => {
      setToast({ show: false, message: "", type: "info" });
    }, 3000);
  }, []);

  return (
    <ToastContext.Provider value={{ toast, showToast, setToast }}>
      {children}
    </ToastContext.Provider>
  );
};

// hook custom
export const useToast = () => useContext(ToastContext);
