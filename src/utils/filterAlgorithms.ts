import type {
  TextOperator,
  NumberOperator,
  SelectOperator,
  MultiSelectOperator,
} from '../types/filter.types';

// ─── Text ─────────────────────────────────────────────────────────────────────

export function applyTextFilter(
  rowValue: unknown,
  filterValue: unknown,
  operator: string,
): boolean {
  if (rowValue === null || rowValue === undefined) return false;
  if (filterValue === null || filterValue === undefined || filterValue === '') return true;

  const row = String(rowValue).toLowerCase().trim();
  const filter = String(filterValue).toLowerCase().trim();

  const op = operator as TextOperator;
  switch (op) {
    case 'equals':
      return row === filter;
    case 'contains':
      return row.includes(filter);
    case 'starts_with':
      return row.startsWith(filter);
    case 'ends_with':
      return row.endsWith(filter);
    case 'not_contains':
      return !row.includes(filter);
    default:
      return true;
  }
}

// ─── Number ───────────────────────────────────────────────────────────────────

export function applyNumberFilter(
  rowValue: unknown,
  filterValue: unknown,
  operator: string,
): boolean {
  if (filterValue === '' || filterValue === null || filterValue === undefined) return true;

  const row = Number(rowValue);
  const filter = Number(filterValue);

  if (isNaN(row) || isNaN(filter)) return false;

  const op = operator as NumberOperator;
  switch (op) {
    case 'eq':
      return row === filter;
    case 'neq':
      return row !== filter;
    case 'gt':
      return row > filter;
    case 'gte':
      return row >= filter;
    case 'lt':
      return row < filter;
    case 'lte':
      return row <= filter;
    default:
      return true;
  }
}

// ─── Date Range ───────────────────────────────────────────────────────────────

export function applyDateFilter(
  rowValue: unknown,
  filterValue: unknown,
  _operator: string,
): boolean {
  if (!Array.isArray(filterValue)) return true;
  const [from, to] = filterValue as [string, string];
  if (!from && !to) return true;

  const rowDate = new Date(String(rowValue));
  if (isNaN(rowDate.getTime())) return false;

  if (from && to) {
    const fromDate = new Date(from);
    const toDate = new Date(to);
    if (isNaN(fromDate.getTime()) || isNaN(toDate.getTime())) return true;
    return rowDate >= fromDate && rowDate <= toDate;
  }
  if (from) {
    const fromDate = new Date(from);
    if (isNaN(fromDate.getTime())) return true;
    return rowDate >= fromDate;
  }
  if (to) {
    const toDate = new Date(to);
    if (isNaN(toDate.getTime())) return true;
    return rowDate <= toDate;
  }
  return true;
}

// ─── Amount Range ─────────────────────────────────────────────────────────────

export function applyAmountFilter(
  rowValue: unknown,
  filterValue: unknown,
  _operator: string,
): boolean {
  if (!Array.isArray(filterValue)) return true;
  const [min, max] = filterValue as [number | '', number | ''];
  if (min === '' && max === '') return true;

  const row = Number(rowValue);
  if (isNaN(row)) return false;

  if (min !== '' && max !== '') {
    return row >= Number(min) && row <= Number(max);
  }
  if (min !== '') {
    return row >= Number(min);
  }
  if (max !== '') {
    return row <= Number(max);
  }
  return true;
}

// ─── Select ───────────────────────────────────────────────────────────────────

export function applySelectFilter(
  rowValue: unknown,
  filterValue: unknown,
  operator: string,
): boolean {
  if (filterValue === '' || filterValue === null || filterValue === undefined) return true;

  const row = String(rowValue).toLowerCase();
  const filter = String(filterValue).toLowerCase();

  const op = operator as SelectOperator;
  switch (op) {
    case 'is':
      return row === filter;
    case 'is_not':
      return row !== filter;
    default:
      return true;
  }
}

// ─── MultiSelect ──────────────────────────────────────────────────────────────

export function applyMultiSelectFilter(
  rowValue: unknown,
  filterValue: unknown,
  operator: string,
): boolean {
  if (!Array.isArray(filterValue) || filterValue.length === 0) return true;

  // rowValue can be a scalar or an array (e.g. skills field)
  const rowArr: string[] = Array.isArray(rowValue)
    ? (rowValue as unknown[]).map((v) => String(v).toLowerCase())
    : [String(rowValue).toLowerCase()];

  const filterArr = (filterValue as string[]).map((v) => v.toLowerCase());

  const op = operator as MultiSelectOperator;
  switch (op) {
    case 'in':
      // row must contain at least one of the selected values
      return filterArr.some((f) => rowArr.includes(f));
    case 'contains_all':
      // row must contain EVERY selected value
      return filterArr.every((f) => rowArr.includes(f));
    case 'not_in':
      // row must not contain any of the selected values
      return !filterArr.some((f) => rowArr.includes(f));
    default:
      return true;
  }
}

// ─── Boolean ──────────────────────────────────────────────────────────────────

export function applyBooleanFilter(
  rowValue: unknown,
  filterValue: unknown,
  _operator: string,
): boolean {
  if (filterValue === null || filterValue === undefined) return true;
  return Boolean(rowValue) === Boolean(filterValue);
}
