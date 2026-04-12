import { useToast } from "../../context/ToastContext";

const ToastGlobal = () => {
  const { toast, setToast } = useToast();

  if (!toast.show) return null;

  return (
    <div
      className="position-fixed top-0 start-50 translate-middle-x mt-3"
      style={{ zIndex: 9999 }}
    >
      <div
        className={`toast show align-items-center text-white border-0 bg-${toast.type}`}
      >
        <div className="d-flex">
          <div className="toast-body">{toast.message}</div>
          <button
            className="btn-close btn-close-white me-2 m-auto"
            onClick={() => setToast({ ...toast, show: false })}
          ></button>
        </div>
      </div>
    </div>
  );
};

export default ToastGlobal;
