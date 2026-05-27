import { useCallback, useMemo, useState } from 'react';
import type { FilterCondition, FilterConfig } from '../types/filter.types';
import { filterRegistry } from '../registry/filterRegistry';
import { getNestedValue } from '../utils/getNestedValue';
import { useUrlFilterState } from './useUrlFilterState';

let idCounter = 0;
const genId = () => `fc_${++idCounter}_${Date.now()}`;

/** Default condition for a given FilterConfig */
function defaultCondition(config: FilterConfig): FilterCondition {
  const definition = filterRegistry[config.type];
  const operator = definition.operators[0] as FilterCondition['operator'];

  // Return correctly typed default based on discriminated union
  switch (config.type) {
    case 'text':
      return { id: genId(), key: config.key, type: 'text', operator: operator as 'equals', value: '' };
    case 'number':
      return { id: genId(), key: config.key, type: 'number', operator: operator as 'eq', value: '' };
    case 'date':
      return { id: genId(), key: config.key, type: 'date', operator: 'between', value: ['', ''] };
    case 'amount':
      return { id: genId(), key: config.key, type: 'amount', operator: 'between', value: ['', ''] };
    case 'select':
      return { id: genId(), key: config.key, type: 'select', operator: 'is', value: '' };
    case 'multiselect':
      return { id: genId(), key: config.key, type: 'multiselect', operator: 'in', value: [] };
    case 'boolean':
      return { id: genId(), key: config.key, type: 'boolean', operator: 'is', value: true };
  }
}

/** Checks whether a condition has a meaningful (non-empty) value */
function isConditionActive(condition: FilterCondition): boolean {
  switch (condition.type) {
    case 'text':
    case 'select':
      return condition.value.trim() !== '';
    case 'number':
      return condition.value !== '';
    case 'date':
      return condition.value[0] !== '' || condition.value[1] !== '';
    case 'amount':
      return condition.value[0] !== '' || condition.value[1] !== '';
    case 'multiselect':
      return condition.value.length > 0;
    case 'boolean':
      return true; // boolean always has a meaningful value
  }
}

export interface UseFilterEngineReturn<T> {
  conditions: FilterCondition[];
  filteredData: T[];
  addCondition: (config: FilterConfig) => void;
  updateCondition: (id: string, updates: Partial<FilterCondition>) => void;
  removeCondition: (id: string) => void;
  clearAll: () => void;
}

export function useFilterEngine<T extends object>(
  _config: FilterConfig[],
  data: T[],
): UseFilterEngineReturn<T> {
  const [conditions, setConditions] = useState<FilterCondition[]>([]);

  // URL persistence — rehydrate on mount
  useUrlFilterState(conditions, useCallback((loaded) => {
    setConditions(loaded);
  }, []));

  const addCondition = useCallback(
    (fieldConfig: FilterConfig) => {
      setConditions((prev) => [...prev, defaultCondition(fieldConfig)]);
    },
    [],
  );

  const updateCondition = useCallback(
    (id: string, updates: Partial<FilterCondition>) => {
      setConditions((prev) =>
        prev.map((c) =>
          c.id === id
            ? // eslint-disable-next-line @typescript-eslint/no-explicit-any — spreading discriminated union update
              ({ ...c, ...updates } as FilterCondition)
            : c,
        ),
      );
    },
    [],
  );

  const removeCondition = useCallback((id: string) => {
    setConditions((prev) => prev.filter((c) => c.id !== id));
  }, []);

  const clearAll = useCallback(() => setConditions([]), []);

  /**
   * Apply AND between different keys, OR within the same key.
   * Only active conditions (non-empty values) are applied.
   */
  const filteredData = useMemo<T[]>(() => {
    const active = conditions.filter(isConditionActive);
    if (active.length === 0) return data;

    // Group by key
    const byKey = new Map<string, FilterCondition[]>();
    for (const cond of active) {
      if (!byKey.has(cond.key)) byKey.set(cond.key, []);
      byKey.get(cond.key)!.push(cond);
    }

    return data.filter((row) => {
      // AND across keys
      for (const [key, conditionsForKey] of byKey) {
        const rowValue = getNestedValue(row, key);
        const definition = filterRegistry[conditionsForKey[0].type];

        // OR within the same key
        const keyPasses = conditionsForKey.some((cond) =>
          definition.filterFn(rowValue, cond.value, cond.operator),
        );

        if (!keyPasses) return false;
      }
      return true;
    });
  }, [conditions, data]);

  return { conditions, filteredData, addCondition, updateCondition, removeCondition, clearAll };
}
