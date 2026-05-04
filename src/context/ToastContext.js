import { createContext, useCallback, useContext, useState } from "react";

const ToastContext = createContext();

export const ToastProvider = ({ children }) => {
  const [toast, setToast] = useState({
    show: false,
    message: "",
    type: "success",
  });

  const showToast = useCallback((message, type = "success") => {
    setToast({ show: true, message, type });

    setTimeout(() => {
      setToast({ show: false, message: "", type: "success" });
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
