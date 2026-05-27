import type {
  TextOperator,
  NumberOperator,
  DateOperator,
  AmountOperator,
  SelectOperator,
  MultiSelectOperator,
  BooleanOperator,
  FieldType,
} from '../types/filter.types';

export const TEXT_OPERATORS: { value: TextOperator; label: string }[] = [
  { value: 'contains', label: 'Contains' },
  { value: 'equals', label: 'Equals' },
  { value: 'starts_with', label: 'Starts with' },
  { value: 'ends_with', label: 'Ends with' },
  { value: 'not_contains', label: 'Does not contain' },
];

export const NUMBER_OPERATORS: { value: NumberOperator; label: string }[] = [
  { value: 'eq', label: 'Equals (=)' },
  { value: 'gt', label: 'Greater than (>)' },
  { value: 'gte', label: 'Greater than or equal (≥)' },
  { value: 'lt', label: 'Less than (<)' },
  { value: 'lte', label: 'Less than or equal (≤)' },
];

export const DATE_OPERATORS: { value: DateOperator; label: string }[] = [
  { value: 'between', label: 'Between' },
];

export const AMOUNT_OPERATORS: { value: AmountOperator; label: string }[] = [
  { value: 'between', label: 'Between' },
];

export const SELECT_OPERATORS: { value: SelectOperator; label: string }[] = [
  { value: 'is', label: 'Is' },
  { value: 'is_not', label: 'Is not' },
];

export const MULTISELECT_OPERATORS: { value: MultiSelectOperator; label: string }[] = [
  { value: 'in', label: 'Includes any of' },
  { value: 'not_in', label: 'Excludes all of' },
];

export const BOOLEAN_OPERATORS: { value: BooleanOperator; label: string }[] = [
  { value: 'is', label: 'Is' },
];

/** Map from FieldType to its operator list (typed as generic strings for convenience) */
export const OPERATOR_MAP: Record<FieldType, { value: string; label: string }[]> = {
  text: TEXT_OPERATORS,
  number: NUMBER_OPERATORS,
  date: DATE_OPERATORS,
  amount: AMOUNT_OPERATORS,
  select: SELECT_OPERATORS,
  multiselect: MULTISELECT_OPERATORS,
  boolean: BOOLEAN_OPERATORS,
};

/** Human-readable label for an operator value */
export const OPERATOR_LABELS: Record<string, string> = {
  equals: 'equals',
  contains: 'contains',
  starts_with: 'starts with',
  ends_with: 'ends with',
  not_contains: 'not contains',
  eq: '=',
  gt: '>',
  gte: '≥',
  lt: '<',
  lte: '≤',
  between: 'between',
  is: 'is',
  is_not: 'is not',
  in: 'includes',
  not_in: 'excludes',
};
