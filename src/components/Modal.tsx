import type { ReactNode } from 'react';
import { X } from 'lucide-react';

export function Modal({ title, description, children, onClose }: { title: string; description?: string; children: ReactNode; onClose: () => void }) {
  return (
    <div className="modal-backdrop" role="dialog" aria-modal="true">
      <div className="modal-card">
        <div className="modal-header">
          <div>
            <h2>{title}</h2>
            {description ? <p>{description}</p> : null}
          </div>
          <button className="icon-btn" onClick={onClose} aria-label="Close"><X size={18} /></button>
        </div>
        <div>{children}</div>
      </div>
    </div>
  );
}
