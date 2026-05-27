import React from 'react';
import { TextField } from '@mui/material';
import type { FilterInputProps } from '../../types/filter.types';
import { useDebounce } from '../../hooks/useDebounce';

const NumberInput: React.FC<FilterInputProps> = ({ condition, onChange }) => {
  const [localValue, setLocalValue] = React.useState<string>(
    condition.type === 'number' && condition.value !== '' ? String(condition.value) : '',
  );

  React.useEffect(() => {
    if (condition.type === 'number') {
      setLocalValue(condition.value !== '' ? String(condition.value) : '');
    }
  }, [condition]);

  const debounced = useDebounce(localValue, 300);

  React.useEffect(() => {
    const parsed = debounced === '' ? '' : Number(debounced);
    onChange(parsed);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debounced]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value;
    // Allow empty string, minus sign, decimal point
    if (raw === '' || raw === '-' || /^-?\d*\.?\d*$/.test(raw)) {
      setLocalValue(raw);
    }
  };

  return (
    <TextField
      size="small"
      fullWidth
      placeholder="Enter number…"
      value={localValue}
      onChange={handleChange}
      slotProps={{ htmlInput: { 'aria-label': 'Number filter value', inputMode: 'numeric' } }}
    />
  );
};

export default NumberInput;
