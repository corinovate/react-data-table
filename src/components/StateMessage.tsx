import type { ReactNode } from 'react';

interface StateMessageProps {
  icon?: ReactNode;
  title: ReactNode;
  description?: ReactNode;
  action?: ReactNode;
  tone?: 'neutral' | 'danger';
  role?: 'alert' | 'status';
}

export function StateMessage({ icon, title, description, action, tone = 'neutral', role }: StateMessageProps) {
  return (
    <div className="cdt-state" data-tone={tone} role={role}>
      {icon && <div className="cdt-state-icon">{icon}</div>}
      <div className="cdt-state-title">{title}</div>
      {description && <div className="cdt-state-description">{description}</div>}
      {action && <div className="cdt-state-action">{action}</div>}
    </div>
  );
}
