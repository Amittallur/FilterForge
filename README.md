# FilterForge

> A production-grade, configuration-driven dynamic filter engine for data tables — built with React 18, TypeScript, Vite, and Material UI v5.

---

## Setup

```bash
# Install dependencies
npm install

# Start dev server
npm run dev

# TypeScript build (production)
npm run build
```

The app will be available at `http://localhost:5173`.

---

## Architecture

### The FilterRegistry Pattern

The core design principle is a **central registry** that maps each field type to three things:

```ts
// src/registry/filterRegistry.ts
export const filterRegistry: Record<FieldType, FilterDefinition> = {
  text: {
    type: 'text',
    operators: TEXT_OPERATORS.map(o => o.value),
    InputComponent: TextInput,           // what to render in FilterRow
    filterFn: applyTextFilter,           // how to evaluate a row
  },
  // ... 6 more entries
};
```

This means `FilterRow` **never has a `switch(type)` statement**. It looks up the component and operators from the registry at render time:

```tsx
// FilterRow.tsx — registry-driven, zero type switching in UI
const { InputComponent } = filterRegistry[condition.type];
const operatorOptions    = OPERATOR_MAP[condition.type];

return <InputComponent condition={condition} config={config} onChange={handleValueChange} />;
```

### Discriminated Union State

All filter conditions are typed as a discriminated union on `type`. TypeScript narrows the `value` type automatically in every `switch` block:

```ts
type FilterCondition =
  | { id: string; key: string; type: 'text';        operator: TextOperator;        value: string }
  | { id: string; key: string; type: 'number';      operator: NumberOperator;      value: number | '' }
  | { id: string; key: string; type: 'date';        operator: 'between';           value: [string, string] }
  | { id: string; key: string; type: 'amount';      operator: 'between';           value: [number|'', number|''] }
  | { id: string; key: string; type: 'select';      operator: SelectOperator;      value: string }
  | { id: string; key: string; type: 'multiselect'; operator: MultiSelectOperator; value: string[] }
  | { id: string; key: string; type: 'boolean';     operator: 'is';                value: boolean }
```

### AND / OR Logic

- **Different fields → AND**: Every distinct field key must pass.
- **Same field → OR**: Multiple conditions on the same key are OR'd together.

Implemented in `useFilterEngine.ts` using a `Map<key, conditions[]>` group-by approach.

### URL Persistence

Active filter state is Base64-encoded as JSON and written to `?filters=<encoded>` on every change. On load, it is decoded and rehydrated. This makes filter views shareable via URL.

### Debouncing

Text and number inputs maintain local state and push to the engine after 300 ms of inactivity via `useDebounce`. This prevents excessive re-renders on every keystroke.

---

## File Structure

```
src/
  components/
    FilterBuilder/
      FilterBuilder.tsx     ← collapsible panel, add/clear buttons
      FilterRow.tsx         ← registry-driven field/operator/value row
      FilterSummaryBar.tsx  ← dismissible active-filter chips
      index.ts
    DataTable/
      DataTable.tsx         ← sortable, paginated MUI table + CSV export
      TableHeader.tsx       ← TableSortLabel per column
      index.ts
    inputs/
      TextInput.tsx         ← debounced MUI TextField
      NumberInput.tsx       ← debounced numeric MUI TextField
      DateRangeInput.tsx    ← two date pickers (from/to)
      AmountRangeInput.tsx  ← min/max with $ prefix, debounced
      SelectInput.tsx       ← MUI Select
      MultiSelectInput.tsx  ← MUI Select + Checkbox + Chip render
      BooleanInput.tsx      ← MUI Switch
  hooks/
    useFilterEngine.ts      ← core logic: conditions state, filteredData memo, AND/OR
    useDebounce.ts          ← generic 300ms debounce
    useUrlFilterState.ts    ← Base64 URL encode/decode
  registry/
    filterRegistry.ts       ← THE central registry
    operators.ts            ← operator label maps
  types/
    filter.types.ts         ← all TypeScript interfaces & discriminated unions
  data/
    employees.json          ← 50 diverse employee records
  utils/
    filterAlgorithms.ts     ← pure, null-safe filter functions
    csvExport.ts            ← CSV download utility
    getNestedValue.ts       ← lodash _.get wrapper for dot-notation
  App.tsx                   ← theme, FilterConfig array, composition
```

---

## How to Add a New Field Type

It takes exactly **3 steps** — no changes needed in FilterRow, FilterSummaryBar, or useFilterEngine:

### Step 1 — Add the type to `filter.types.ts`

```ts
// Add to FieldType union
export type FieldType = 'text' | 'number' | ... | 'rating';

// Add a member to the FilterCondition discriminated union
| { id: string; key: string; type: 'rating'; operator: 'gte' | 'lte'; value: number | '' }
```

### Step 2 — Create an input component in `src/components/inputs/`

```tsx
// RatingInput.tsx
const RatingInput: React.FC<FilterInputProps> = ({ condition, onChange }) => (
  <Rating
    value={condition.type === 'rating' ? condition.value || 0 : 0}
    onChange={(_, v) => onChange(v ?? '')}
  />
);
export default RatingInput;
```

### Step 3 — Register it in `src/registry/filterRegistry.ts`

```ts
rating: {
  type: 'rating',
  operators: ['gte', 'lte'],
  InputComponent: RatingInput,
  filterFn: (rowValue, filterValue, operator) =>
    operator === 'gte' ? Number(rowValue) >= Number(filterValue) : Number(rowValue) <= Number(filterValue),
},
```

That's it. The filter UI, URL persistence, CSV export, and all chips update automatically.

---

## Features

| Feature | Implementation |
|---|---|
| 7 field types | `text`, `number`, `date`, `amount`, `select`, `multiselect`, `boolean` |
| AND / OR logic | AND across fields, OR within same field |
| URL persistence | Base64-encoded `?filters=` param |
| Debounced inputs | 300ms via `useDebounce` |
| CSV export | Flattens nested objects, streams download |
| Sortable columns | Click header to toggle asc/desc |
| Dot-notation keys | `address.city` resolved via lodash `_.get` |
| Active filter chips | FilterSummaryBar with dismiss per chip |
| Empty state | SearchX icon + contextual message |
| Animated count | CSS transition on record count colour |
| Accessible | `aria-label` on all inputs, `role="button"`, `aria-expanded` |
