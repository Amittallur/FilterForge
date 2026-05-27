import React from 'react';
import {
  Checkbox,
  Chip,
  FormControl,
  InputLabel,
  ListItemText,
  MenuItem,
  OutlinedInput,
  Select,
} from '@mui/material';
import type { FilterInputProps } from '../../types/filter.types';

const MultiSelectInput: React.FC<FilterInputProps> = ({ condition, config, onChange }) => {
  const value = condition.type === 'multiselect' ? condition.value : [];
  const options = config.options ?? [];

  return (
    <FormControl size="small" fullWidth>
      <InputLabel id={`multiselect-filter-${config.key}`}>Select values</InputLabel>
      <Select
        labelId={`multiselect-filter-${config.key}`}
        multiple
        value={value}
        onChange={(e) => {
          const val = e.target.value;
          onChange(typeof val === 'string' ? val.split(',') : val);
        }}
        input={<OutlinedInput label="Select values" />}
        renderValue={(selected) => (
          <React.Fragment>
            {(selected as string[]).slice(0, 2).map((s) => (
              <Chip key={s} label={s} size="small" sx={{ mr: 0.5 }} />
            ))}
            {(selected as string[]).length > 2 && (
              <Chip
                label={`+${(selected as string[]).length - 2} more`}
                size="small"
              />
            )}
          </React.Fragment>
        )}
        inputProps={{ 'aria-label': `${config.label} multiselect filter` }}
      >
        {options.map((opt) => (
          <MenuItem key={opt.value} value={opt.value}>
            <Checkbox
              checked={value.includes(opt.value)}
              size="small"
              aria-label={`Select ${opt.label}`}
            />
            <ListItemText primary={opt.label} />
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};

export default MultiSelectInput;
