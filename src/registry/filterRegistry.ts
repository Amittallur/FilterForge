import type { FilterDefinition, FieldType } from '../types/filter.types';
import {
  TEXT_OPERATORS,
  NUMBER_OPERATORS,
  DATE_OPERATORS,
  AMOUNT_OPERATORS,
  SELECT_OPERATORS,
  MULTISELECT_OPERATORS,
  BOOLEAN_OPERATORS,
} from './operators';
import TextInput from '../components/inputs/TextInput';
import NumberInput from '../components/inputs/NumberInput';
import DateRangeInput from '../components/inputs/DateRangeInput';
import AmountRangeInput from '../components/inputs/AmountRangeInput';
import SelectInput from '../components/inputs/SelectInput';
import MultiSelectInput from '../components/inputs/MultiSelectInput';
import BooleanInput from '../components/inputs/BooleanInput';
import {
  applyTextFilter,
  applyNumberFilter,
  applyDateFilter,
  applyAmountFilter,
  applySelectFilter,
  applyMultiSelectFilter,
  applyBooleanFilter,
} from '../utils/filterAlgorithms';

/**
 * Central FilterRegistry — maps each FieldType to:
 *  - operators:      the available operator options
 *  - InputComponent: the React component to render in FilterRow
 *  - filterFn:       the pure function that evaluates a row value
 *
 * To add a new field type:
 *  1. Add the type to FieldType in filter.types.ts
 *  2. Create an InputComponent in src/components/inputs/
 *  3. Add a filterFn in src/utils/filterAlgorithms.ts
 *  4. Register all three here in filterRegistry
 */
export const filterRegistry: Record<FieldType, FilterDefinition> = {
  text: {
    type: 'text',
    operators: TEXT_OPERATORS.map((o) => o.value),
    InputComponent: TextInput,
    filterFn: applyTextFilter,
  },
  number: {
    type: 'number',
    operators: NUMBER_OPERATORS.map((o) => o.value),
    InputComponent: NumberInput,
    filterFn: applyNumberFilter,
  },
  date: {
    type: 'date',
    operators: DATE_OPERATORS.map((o) => o.value),
    InputComponent: DateRangeInput,
    filterFn: applyDateFilter,
  },
  amount: {
    type: 'amount',
    operators: AMOUNT_OPERATORS.map((o) => o.value),
    InputComponent: AmountRangeInput,
    filterFn: applyAmountFilter,
  },
  select: {
    type: 'select',
    operators: SELECT_OPERATORS.map((o) => o.value),
    InputComponent: SelectInput,
    filterFn: applySelectFilter,
  },
  multiselect: {
    type: 'multiselect',
    operators: MULTISELECT_OPERATORS.map((o) => o.value),
    InputComponent: MultiSelectInput,
    filterFn: applyMultiSelectFilter,
  },
  boolean: {
    type: 'boolean',
    operators: BOOLEAN_OPERATORS.map((o) => o.value),
    InputComponent: BooleanInput,
    filterFn: applyBooleanFilter,
  },
};
