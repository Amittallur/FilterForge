import React from 'react';
import {
  FormControl,
  MenuItem,
  Select,
  InputLabel,
} from '@mui/material';
import type { FilterInputProps } from '../../types/filter.types';

const SelectInput: React.FC<FilterInputProps> = ({ condition, config, onChange }) => {
  const value = condition.type === 'select' ? condition.value : '';
  const options = config.options ?? [];

  return (
    <FormControl size="small" fullWidth>
      <InputLabel id={`select-filter-${config.key}`}>Select value</InputLabel>
      <Select
        labelId={`select-filter-${config.key}`}
        label="Select value"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        inputProps={{ 'aria-label': `${config.label} filter value` }}
      >
        <MenuItem value="">
          <em>Any</em>
        </MenuItem>
        {options.map((opt) => (
          <MenuItem key={opt.value} value={opt.value}>
            {opt.label}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};

export default SelectInput;
