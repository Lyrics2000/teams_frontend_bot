import { CheckCircle2, Info, TriangleAlert, X } from 'lucide-react';
import { useAdminData } from '../state/AdminDataContext';

const icons = {
  success: CheckCircle2,
  warning: TriangleAlert,
  danger: TriangleAlert,
  info: Info,
};

export function ToastStack() {
  const { toasts, dismissToast } = useAdminData();
  return (
    <div className="toast-stack">
      {toasts.map((toast) => {
        const Icon = icons[toast.tone];
        return (
          <div className={`toast ${toast.tone}`} key={toast.id}>
            <Icon size={18} />
            <span>{toast.message}</span>
            <button onClick={() => dismissToast(toast.id)} aria-label="Dismiss"><X size={15} /></button>
          </div>
        );
      })}
    </div>
  );
}
