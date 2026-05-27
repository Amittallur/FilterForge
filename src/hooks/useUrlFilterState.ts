import { useCallback, useEffect, useRef } from 'react';
import type { FilterCondition } from '../types/filter.types';

const PARAM_KEY = 'filters';

/**
 * Encodes conditions to a base64 URL-safe JSON string and
 * writes it to the `?filters=` query parameter.
 *
 * Decodes on mount to rehydrate state.
 */
export function useUrlFilterState(
  conditions: FilterCondition[],
  onLoad: (conditions: FilterCondition[]) => void,
): void {
  const onLoadRef = useRef(onLoad);
  onLoadRef.current = onLoad;

  // Rehydrate from URL on first mount
  useEffect(() => {
    try {
      const params = new URLSearchParams(window.location.search);
      const encoded = params.get(PARAM_KEY);
      if (!encoded) return;
      const decoded = JSON.parse(atob(encoded)) as FilterCondition[];
      if (Array.isArray(decoded) && decoded.length > 0) {
        onLoadRef.current(decoded);
      }
    } catch {
      // Ignore malformed URL state
    }
  }, []);

  // Sync conditions → URL
  const syncToUrl = useCallback((conds: FilterCondition[]) => {
    const params = new URLSearchParams(window.location.search);
    if (conds.length === 0) {
      params.delete(PARAM_KEY);
    } else {
      params.set(PARAM_KEY, btoa(JSON.stringify(conds)));
    }
    const newSearch = params.toString();
    const newUrl = newSearch
      ? `${window.location.pathname}?${newSearch}`
      : window.location.pathname;
    window.history.replaceState(null, '', newUrl);
  }, []);

  useEffect(() => {
    syncToUrl(conditions);
  }, [conditions, syncToUrl]);
}
