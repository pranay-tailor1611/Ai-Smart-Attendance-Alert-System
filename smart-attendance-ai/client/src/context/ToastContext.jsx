import { createContext, useCallback, useContext, useState } from 'react';
import { X, CheckCircle, AlertCircle, Info } from 'lucide-react';
import { cn } from '../lib/utils';

const ToastContext = createContext(null);

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const toast = useCallback((message, type = 'info') => {
    const id = Date.now();
    setToasts((t) => [...t, { id, message, type }]);
    setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), 4000);
  }, []);

  const dismiss = (id) => setToasts((t) => t.filter((x) => x.id !== id));

  const icons = { success: CheckCircle, error: AlertCircle, info: Info };

  return (
    <ToastContext.Provider value={{ toast }}>
      {children}
      <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2">
        {toasts.map((t) => {
          const Icon = icons[t.type] || Info;
          return (
            <div
              key={t.id}
              className={cn(
                'glass-card flex min-w-[280px] items-center gap-3 px-4 py-3.5 shadow-glow-sm',
                t.type === 'success' && 'border-emerald-400/35',
                t.type === 'error' && 'border-rose-400/35'
              )}
            >
              <Icon className="h-5 w-5 shrink-0 text-primary" />
              <p className="text-sm flex-1">{t.message}</p>
              <button type="button" onClick={() => dismiss(t.id)} className="text-muted-foreground hover:text-foreground">
                <X className="h-4 w-4" />
              </button>
            </div>
          );
        })}
      </div>
    </ToastContext.Provider>
  );
}

export const useToast = () => {
  const ctx = useContext(ToastContext);
  if (!ctx) {
    return { toast: (msg) => console.warn('[toast]', msg) };
  }
  return ctx;
};
