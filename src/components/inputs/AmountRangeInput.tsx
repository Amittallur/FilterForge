import React from 'react';
import { Box, InputAdornment, TextField } from '@mui/material';
import type { FilterInputProps } from '../../types/filter.types';
import { useDebounce } from '../../hooks/useDebounce';

const AmountRangeInput: React.FC<FilterInputProps> = ({ condition, onChange }) => {
  const initial =
    condition.type === 'amount' ? condition.value : (['', ''] as ['' | number, '' | number]);

  const [localMin, setLocalMin] = React.useState<string>(
    initial[0] !== '' ? String(initial[0]) : '',
  );
  const [localMax, setLocalMax] = React.useState<string>(
    initial[1] !== '' ? String(initial[1]) : '',
  );

  const debouncedMin = useDebounce(localMin, 300);
  const debouncedMax = useDebounce(localMax, 300);

  React.useEffect(() => {
    const min: number | '' = debouncedMin === '' ? '' : Number(debouncedMin);
    const max: number | '' = debouncedMax === '' ? '' : Number(debouncedMax);
    onChange([min, max]);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedMin, debouncedMax]);

  const numericOnly = (value: string) => /^\d*\.?\d*$/.test(value) || value === '';

  return (
    <Box sx={{ display: 'flex', gap: 1, alignItems: 'center', width: '100%' }}>
      <TextField
        size="small"
        label="Min"
        placeholder="0"
        value={localMin}
        onChange={(e) => numericOnly(e.target.value) && setLocalMin(e.target.value)}
        slotProps={{
          input: { startAdornment: <InputAdornment position="start">$</InputAdornment> },
          htmlInput: { 'aria-label': 'Minimum amount' },
        }}
        sx={{ flex: 1 }}
      />
      <TextField
        size="small"
        label="Max"
        placeholder="∞"
        value={localMax}
        onChange={(e) => numericOnly(e.target.value) && setLocalMax(e.target.value)}
        slotProps={{
          input: { startAdornment: <InputAdornment position="start">$</InputAdornment> },
          htmlInput: { 'aria-label': 'Maximum amount' },
        }}
        sx={{ flex: 1 }}
      />
    </Box>
  );
};

export default AmountRangeInput;
