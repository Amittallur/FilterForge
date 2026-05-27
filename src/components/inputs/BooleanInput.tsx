import React from 'react';
import { Box, FormControlLabel, Switch, Typography } from '@mui/material';
import type { FilterInputProps } from '../../types/filter.types';

const BooleanInput: React.FC<FilterInputProps> = ({ condition, config, onChange }) => {
  const value = condition.type === 'boolean' ? condition.value : true;

  return (
    <Box sx={{ display: 'flex', alignItems: 'center', pl: 1 }}>
      <FormControlLabel
        control={
          <Switch
            checked={value}
            onChange={(e) => onChange(e.target.checked)}
            size="small"
            slotProps={{ input: { 'aria-label': `${config.label} boolean filter` } }}
          />
        }
        label={
          <Typography variant="body2" sx={{ ml: 0.5 }}>
            {value ? 'True' : 'False'}
          </Typography>
        }
      />
    </Box>
  );
};

export default BooleanInput;
