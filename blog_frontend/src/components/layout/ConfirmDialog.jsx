import { useState, useCallback, createContext, useContext } from "react";


function ConfirmDialog({
  isOpen,
  title,
  message,
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  variant = "danger",
  onConfirm,
  onCancel,
}) {
  if (!isOpen) return null;

  const confirmButtonClass =
    variant === "danger"
      ? "bg-red-600 hover:bg-red-700 dark:bg-red-600 dark:hover:bg-red-500"
      : "bg-rose-800 hover:bg-rose-900 dark:bg-rose-600 dark:hover:bg-rose-500";

  return (
    <div
      className="fixed inset-0 z-100 flex items-center justify-center bg-black/50 backdrop-blur-sm px-4"
      onClick={onCancel}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-sm rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl p-6 text-center"
      >
        <div className="text-5xl mb-4">
          {variant === "danger" ? "⚠️" : "❓"}
        </div>

        <h3 className="text-xl font-semibold text-slate-800 dark:text-white mb-2">
          {title}
        </h3>

        <p className="text-slate-500 dark:text-slate-400 mb-6 text-sm leading-relaxed">
          {message}
        </p>

        <div className="flex gap-3">
          <button
            type="button"
            onClick={onCancel}
            className="flex-1 py-3 rounded-xl font-medium text-slate-700 border border-slate-300 hover:bg-slate-50 dark:text-slate-300 dark:border-slate-700 dark:hover:bg-slate-800 transition"
          >
            {cancelLabel}
          </button>

          <button
            type="button"
            onClick={onConfirm}
            className={`flex-1 py-3 rounded-xl font-semibold text-white transition ${confirmButtonClass}`}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}




const ConfirmContext = createContext(null);

export function ConfirmProvider({ children }) {
  const [dialogState, setDialogState] = useState({
    isOpen: false,
    title: "",
    message: "",
    confirmLabel: "Confirm",
    cancelLabel: "Cancel",
    variant: "danger",
    resolve: null,
  });

  const confirm = useCallback((options) => {
    return new Promise((resolve) => {
      setDialogState({
        isOpen: true,
        title: options.title || "Are you sure?",
        message: options.message || "This action cannot be undone.",
        confirmLabel: options.confirmLabel || "Confirm",
        cancelLabel: options.cancelLabel || "Cancel",
        variant: options.variant || "danger",
        resolve,
      });
    });
  }, []);

  const handleConfirm = () => {
    dialogState.resolve?.(true);
    setDialogState((prev) => ({ ...prev, isOpen: false }));
  };

  const handleCancel = () => {
    dialogState.resolve?.(false);
    setDialogState((prev) => ({ ...prev, isOpen: false }));
  };

  return (
    <ConfirmContext.Provider value={confirm}>
      {children}

      <ConfirmDialog
        isOpen={dialogState.isOpen}
        title={dialogState.title}
        message={dialogState.message}
        confirmLabel={dialogState.confirmLabel}
        cancelLabel={dialogState.cancelLabel}
        variant={dialogState.variant}
        onConfirm={handleConfirm}
        onCancel={handleCancel}
      />
    </ConfirmContext.Provider>
  );
}


export function useConfirm() {
  const context = useContext(ConfirmContext);

  if (!context) {
    throw new Error("useConfirm must be used within a ConfirmProvider");
  }

  return context;
}