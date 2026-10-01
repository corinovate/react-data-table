import { useCallback, useRef, useState } from 'react';

type Updater<T> = T | ((previous: T) => T);

/**
 * State that is controlled when `value` is defined and internal otherwise.
 * `onChange` fires in both cases.
 */
export function useControllableState<T>(
  value: T | undefined,
  defaultValue: T | (() => T),
  onChange?: (value: T) => void,
): [T, (next: Updater<T>) => void] {
  const [internal, setInternal] = useState<T>(defaultValue);
  const isControlled = value !== undefined;
  const current = isControlled ? value : internal;

  const currentRef = useRef(current);
  currentRef.current = current;
  const onChangeRef = useRef(onChange);
  onChangeRef.current = onChange;

  const setValue = useCallback(
    (next: Updater<T>) => {
      const resolved =
        typeof next === 'function' ? (next as (previous: T) => T)(currentRef.current) : next;
      if (Object.is(resolved, currentRef.current)) return;
      // Lets several updates in the same event see each other's result.
      currentRef.current = resolved;
      if (!isControlled) setInternal(resolved);
      onChangeRef.current?.(resolved);
    },
    [isControlled],
  );

  return [current, setValue];
}
