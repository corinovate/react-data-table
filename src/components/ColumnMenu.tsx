import { useEffect, useId, useRef, useState } from 'react';
import type { ResolvedColumn } from '../core/columns';
import { ColumnsIcon } from './icons';

interface ColumnMenuProps {
  columns: ResolvedColumn[];
  hiddenColumns: string[];
  onToggle: (key: string) => void;
  label: string;
  title: string;
}

export function ColumnMenu({ columns, hiddenColumns, onToggle, label, title }: ColumnMenuProps) {
  const [open, setOpen] = useState(false);
  const panelId = useId();
  const rootRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  const visibleCount = columns.filter((c) => !hiddenColumns.includes(c.key)).length;

  useEffect(() => {
    if (!open) return;
    panelRef.current?.querySelector<HTMLInputElement>('input:not(:disabled)')?.focus();

    const onPointerDown = (event: PointerEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) setOpen(false);
    };
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setOpen(false);
        buttonRef.current?.focus();
      }
    };
    document.addEventListener('pointerdown', onPointerDown);
    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.removeEventListener('pointerdown', onPointerDown);
      document.removeEventListener('keydown', onKeyDown);
    };
  }, [open]);

  return (
    <div
      className="cdt-menu"
      ref={rootRef}
      onBlur={(event) => {
        if (open && !rootRef.current?.contains(event.relatedTarget as Node | null)) setOpen(false);
      }}
    >
      <button
        ref={buttonRef}
        type="button"
        className="cdt-btn"
        aria-expanded={open}
        aria-controls={open ? panelId : undefined}
        title={title}
        onClick={() => setOpen((o) => !o)}
      >
        <ColumnsIcon />
        <span className="cdt-btn-text">{label}</span>
      </button>
      {open && (
        <div ref={panelRef} id={panelId} className="cdt-menu-panel" role="group" aria-label={title}>
          {columns
            .filter((c) => c.canHide)
            .map((column) => {
              const visible = !hiddenColumns.includes(column.key);
              return (
                <label key={column.key} className="cdt-menu-item">
                  <input
                    type="checkbox"
                    className="cdt-checkbox"
                    checked={visible}
                    disabled={visible && visibleCount <= 1}
                    onChange={() => onToggle(column.key)}
                  />
                  <span>{column.label}</span>
                </label>
              );
            })}
        </div>
      )}
    </div>
  );
}
