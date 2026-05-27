import React from 'react';
import {
  Box,
  FormControl,
  IconButton,
  InputLabel,
  MenuItem,
  Select,
  Tooltip,
} from '@mui/material';
import { Trash2 } from 'lucide-react';
import type { FilterCondition, FilterConfig } from '../../types/filter.types';
import type { FieldType } from '../../types/filter.types';
import { filterRegistry } from '../../registry/filterRegistry';
import { OPERATOR_MAP } from '../../registry/operators';

// ─── Type color dots ──────────────────────────────────────────────────────────

const TYPE_DOT_COLOR: Record<FieldType, string> = {
  text:        '#3B82F6', // blue-500
  number:      '#10B981', // emerald-500
  date:        '#8B5CF6', // violet-500
  amount:      '#059669', // emerald-600
  select:      '#EC4899', // pink-500
  multiselect: '#A855F7', // purple-500
  boolean:     '#F97316', // orange-500
};

interface FilterRowProps {
  condition: FilterCondition;
  configs: FilterConfig[];
  onFieldChange: (id: string, newConfig: FilterConfig) => void;
  onOperatorChange: (id: string, operator: string) => void;
  onValueChange: (id: string, value: FilterCondition['value']) => void;
  onRemove: (id: string) => void;
}

const FilterRow: React.FC<FilterRowProps> = ({
  condition, configs, onFieldChange, onOperatorChange, onValueChange, onRemove,
}) => {
  // Resolve current config for this condition's key
  const currentConfig = configs.find((c) => c.key === condition.key) ?? configs[0];

  // Operator list comes from the registry — no switch-on-type here
  const operatorOptions = OPERATOR_MAP[condition.type] ?? [];

  // InputComponent comes from the registry — no switch-on-type here
  const { InputComponent } = filterRegistry[condition.type];

  const handleFieldSelect    = (key: string) => {
    const newConfig = configs.find((c) => c.key === key);
    if (newConfig) onFieldChange(condition.id, newConfig);
  };
  const handleOperatorSelect = (op: string) => onOperatorChange(condition.id, op);
  const handleValueChange    = (value: FilterCondition['value']) => onValueChange(condition.id, value);

  const dotColor = TYPE_DOT_COLOR[condition.type] ?? '#6C63FF';

  return (
    <Box
      className="ff-filter-row"
      sx={{
        display: 'flex', alignItems: 'center', gap: 1.25,
        p: 1.25, pr: 1,
        borderRadius: '10px',
        bgcolor: '#F9FAFB',
        border: '1px solid #E5E7EB',
        transition: 'border-color 0.2s, box-shadow 0.2s',
        '&:hover': {
          borderColor: '#BFDBFE',
          boxShadow: '0 0 0 1px #DBEAFE',
        },
      }}
    >
      {/* Type color indicator dot */}
      <Box
        sx={{
          width: 7, height: 7, borderRadius: '50%',
          bgcolor: dotColor,
          flexShrink: 0,
          boxShadow: `0 0 6px ${dotColor}80`,
        }}
      />

      {/* Field selector */}
      <FormControl size="small" sx={{ minWidth: 148 }}>
        <InputLabel id={`field-label-${condition.id}`}>Field</InputLabel>
        <Select
          labelId={`field-label-${condition.id}`}
          label="Field"
          value={condition.key}
          onChange={(e) => handleFieldSelect(e.target.value)}
          inputProps={{ 'aria-label': 'Filter field' }}
        >
          {configs.map((cfg) => (
            <MenuItem key={cfg.key} value={cfg.key}>
              {cfg.label}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      {/* Operator selector */}
      <FormControl size="small" sx={{ minWidth: 168 }}>
        <InputLabel id={`op-label-${condition.id}`}>Operator</InputLabel>
        <Select
          labelId={`op-label-${condition.id}`}
          label="Operator"
          value={condition.operator}
          onChange={(e) => handleOperatorSelect(e.target.value)}
          inputProps={{ 'aria-label': 'Filter operator' }}
        >
          {operatorOptions.map((op) => (
            <MenuItem key={op.value} value={op.value}>
              {op.label}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      {/* Dynamic value input — resolved from registry, no switch-on-type */}
      <Box sx={{ flex: 1, minWidth: 180, maxWidth: 350 }}>
        <InputComponent
          condition={condition}
          config={currentConfig}
          onChange={handleValueChange}
        />
      </Box>

      {/* Remove button — trash shake + red on hover via CSS class */}
      <Tooltip title="Remove filter" placement="top">
        <IconButton
          size="small"
          onClick={() => onRemove(condition.id)}
          aria-label="Remove filter condition"
          className="ff-trash"
          sx={{
            color: '#9CA3AF',
            borderRadius: 1.5,
            '&:hover': {
              bgcolor: '#FEE2E2',
              color: '#DC2626',
            },
          }}
        >
          <Trash2 size={15} className="ff-trash-icon" />
        </IconButton>
      </Tooltip>
    </Box>
  );
};

export default FilterRow;
