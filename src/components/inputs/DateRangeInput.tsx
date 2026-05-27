import React from 'react';
import { Box, TextField } from '@mui/material';
import type { FilterInputProps } from '../../types/filter.types';

const DateRangeInput: React.FC<FilterInputProps> = ({ condition, onChange }) => {
  const [from, to] =
    condition.type === 'date' ? condition.value : ['', ''];

  const handleFrom = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange([e.target.value, to]);
  };

  const handleTo = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange([from, e.target.value]);
  };

  return (
    <Box sx={{ display: 'flex', gap: 1, alignItems: 'center', width: '100%' }}>
      <TextField
        size="small"
        type="date"
        label="From"
        value={from}
        onChange={handleFrom}
        slotProps={{
          inputLabel: { shrink: true },
          htmlInput: { 'aria-label': 'Date from' },
        }}
        sx={{ flex: 1 }}
      />
      <TextField
        size="small"
        type="date"
        label="To"
        value={to}
        onChange={handleTo}
        slotProps={{
          inputLabel: { shrink: true },
          htmlInput: { 'aria-label': 'Date to' },
        }}
        sx={{ flex: 1 }}
      />
    </Box>
  );
};

export default DateRangeInput;
