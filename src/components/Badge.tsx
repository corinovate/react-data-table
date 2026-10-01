import type { HTMLAttributes, ReactNode } from 'react';
import { cx } from '../utils';

export type BadgeTone = 'neutral' | 'accent' | 'success' | 'warning' | 'danger' | 'info';

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  tone?: BadgeTone;
  /** Show a small colored dot before the text. */
  dot?: boolean;
}

/** Theme-aware status badge. Use inside table cells. */
export function Badge({ tone = 'neutral', dot = false, className, children, ...rest }: BadgeProps) {
  return (
    <span className={cx('cdt-badge', `cdt-badge--${tone}`, className)} {...rest}>
      {dot && <span className="cdt-badge-dot" aria-hidden="true" />}
      {children}
    </span>
  );
}

/**
 * Column `render` helper that maps values to badge tones.
 *
 * ```ts
 * { key: 'status', render: renderBadge({ active: 'success', pending: 'warning', banned: 'danger' }) }
 * ```
 */
export function renderBadge(
  tones: Record<string, BadgeTone>,
  options: { dot?: boolean; fallback?: BadgeTone; format?: (value: unknown) => ReactNode } = {},
) {
  const { dot = true, fallback = 'neutral', format } = options;
  return (value: unknown): ReactNode => {
    if (value === null || value === undefined || value === '') return null;
    const text = String(value);
    return (
      <Badge tone={tones[text] ?? tones[text.toLowerCase()] ?? fallback} dot={dot}>
        {format ? format(value) : text}
      </Badge>
    );
  };
}
