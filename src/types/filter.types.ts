// ─── Field Types ─────────────────────────────────────────────────────────────

export type FieldType =
  | 'text'
  | 'number'
  | 'date'
  | 'amount'
  | 'select'
  | 'multiselect'
  | 'boolean';

// ─── Operators ────────────────────────────────────────────────────────────────

export type TextOperator =
  | 'equals'
  | 'contains'
  | 'starts_with'
  | 'ends_with'
  | 'not_contains';

export type NumberOperator = 'eq' | 'neq' | 'gt' | 'lt' | 'gte' | 'lte';

export type DateOperator = 'between';

export type AmountOperator = 'between';

export type SelectOperator = 'is' | 'is_not';

export type MultiSelectOperator = 'in' | 'contains_all' | 'not_in';

export type BooleanOperator = 'is';

export type Operator =
  | TextOperator
  | NumberOperator
  | DateOperator
  | AmountOperator
  | SelectOperator
  | MultiSelectOperator
  | BooleanOperator;

// ─── FilterCondition (discriminated union) ────────────────────────────────────

export type FilterCondition =
  | {
      id: string;
      key: string;
      type: 'text';
      operator: TextOperator;
      value: string;
    }
  | {
      id: string;
      key: string;
      type: 'number';
      operator: NumberOperator;
      value: number | '';
    }
  | {
      id: string;
      key: string;
      type: 'date';
      operator: 'between';
      value: [string, string];
    }
  | {
      id: string;
      key: string;
      type: 'amount';
      operator: 'between';
      value: [number | '', number | ''];
    }
  | {
      id: string;
      key: string;
      type: 'select';
      operator: SelectOperator;
      value: string;
    }
  | {
      id: string;
      key: string;
      type: 'multiselect';
      operator: MultiSelectOperator;
      value: string[];
    }
  | {
      id: string;
      key: string;
      type: 'boolean';
      operator: 'is';
      value: boolean;
    };

// ─── FilterConfig (consumer API) ─────────────────────────────────────────────

export interface SelectOption {
  label: string;
  value: string;
}

export interface FilterConfig {
  key: string; // supports dot notation e.g. "address.city"
  label: string;
  type: FieldType;
  options?: SelectOption[]; // for select / multiselect
}

// ─── FilterRegistry ───────────────────────────────────────────────────────────

export interface FilterInputProps {
  condition: FilterCondition;
  config: FilterConfig;
  onChange: (value: FilterCondition['value']) => void;
}

export interface FilterDefinition {
  type: FieldType;
  operators: Operator[];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any — registry stores heterogeneous components
  InputComponent: React.FC<FilterInputProps>;
  filterFn: (rowValue: unknown, filterValue: unknown, operator: string) => boolean;
}

// ─── Sort ─────────────────────────────────────────────────────────────────────

export type SortDirection = 'asc' | 'desc';

export interface SortState {
  key: string;
  direction: SortDirection;
}

// ─── Employee (data model) ────────────────────────────────────────────────────

export interface Employee {
  id: number;
  name: string;
  email: string;
  department: string;
  role: string;
  salary: number;
  joinDate: string;
  isActive: boolean;
  skills: string[];
  address: {
    city: string;
    state: string;
    country: string;
  };
  projects: number;
  lastReview: string;
  performanceRating: number;
}
