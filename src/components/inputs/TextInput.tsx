import React from 'react';
import { TextField } from '@mui/material';
import type { FilterInputProps } from '../../types/filter.types';
import { useDebounce } from '../../hooks/useDebounce';

const TextInput: React.FC<FilterInputProps> = ({ condition, onChange }) => {
  const [localValue, setLocalValue] = React.useState(
    condition.type === 'text' ? condition.value : '',
  );

  // Keep local value in sync if condition changes externally (e.g. from URL rehydration)
  React.useEffect(() => {
    if (condition.type === 'text') setLocalValue(condition.value);
  }, [condition]);

  const debounced = useDebounce(localValue, 300);

  React.useEffect(() => {
    onChange(debounced);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debounced]);

  return (
    <TextField
      size="small"
      fullWidth
      placeholder="Enter value…"
      value={localValue}
      onChange={(e) => setLocalValue(e.target.value)}
      slotProps={{ htmlInput: { 'aria-label': 'Text filter value' } }}
    />
  );
};

export default TextInput;
