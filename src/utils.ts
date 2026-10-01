export function cx(...classes: (string | false | null | undefined)[]): string {
  return classes.filter(Boolean).join(' ');
}

export function toCssSize(value: number | string | undefined): string | undefined {
  return typeof value === 'number' ? `${value}px` : value;
}

const INTERACTIVE = 'a, button, input, select, textarea, label, summary, [role="button"], [role="checkbox"], [role="link"], [data-cdt-no-row-click]';

/** True when the event started on an interactive element inside the row (so the row click should be ignored). */
export function isFromInteractive(target: EventTarget | null, row: HTMLElement): boolean {
  if (!(target instanceof Element)) return false;
  const interactive = target.closest(INTERACTIVE);
  return interactive !== null && interactive !== row && row.contains(interactive);
}
