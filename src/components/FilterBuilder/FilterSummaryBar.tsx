import React from 'react';
import { Box, Chip, Typography } from '@mui/material';
import { SlidersHorizontal } from 'lucide-react';
import type { FilterCondition, FilterConfig } from '../../types/filter.types';
import { OPERATOR_LABELS } from '../../registry/operators';

interface FilterSummaryBarProps {
  conditions: FilterCondition[];
  configs: FilterConfig[];
  onRemove: (id: string) => void;
}

/** Returns a human-readable value string for a condition */
function formatValue(condition: FilterCondition): string {
  switch (condition.type) {
    case 'text':
    case 'select':
      return `"${condition.value}"`;
    case 'number':
      return condition.value === '' ? '?' : String(condition.value);
    case 'date': {
      const [from, to] = condition.value;
      if (from && to) return `${from} → ${to}`;
      if (from) return `from ${from}`;
      if (to) return `until ${to}`;
      return '?';
    }
    case 'amount': {
      const [min, max] = condition.value;
      const minStr = min !== '' ? `$${Number(min).toLocaleString()}` : '$0';
      const maxStr = max !== '' ? `$${Number(max).toLocaleString()}` : '∞';
      return `${minStr} – ${maxStr}`;
    }
    case 'multiselect':
      return condition.value.length > 0 ? condition.value.join(', ') : '?';
    case 'boolean':
      return condition.value ? 'Yes' : 'No';
  }
}

const FilterSummaryBar: React.FC<FilterSummaryBarProps> = ({ conditions, configs, onRemove }) => {
  const active = conditions.filter((c) => {
    if (c.type === 'text' || c.type === 'select') return c.value !== '';
    if (c.type === 'number') return c.value !== '';
    if (c.type === 'date') return c.value[0] !== '' || c.value[1] !== '';
    if (c.type === 'amount') return c.value[0] !== '' || c.value[1] !== '';
    if (c.type === 'multiselect') return c.value.length > 0;
    return true;
  });

  if (active.length === 0) return null;

  return (
    <Box
      sx={{
        display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 0.85,
        px: 2, py: 1.25,
        borderRadius: '12px',
        bgcolor: 'rgba(108,99,255,0.06)',
        border: '1px solid rgba(108,99,255,0.2)',
        boxShadow: '0 0 16px rgba(108,99,255,0.05)',
      }}
    >
      {/* Label */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.6, mr: 0.5 }}>
        <SlidersHorizontal size={12} style={{ color: 'rgba(165,180,252,0.55)' }} />
        <Typography
          variant="caption"
          sx={{ fontWeight: 700, color: 'rgba(165,180,252,0.55)', letterSpacing: '0.04em', textTransform: 'uppercase', fontSize: '0.62rem' }}
        >
          Active filters
        </Typography>
      </Box>

      {active.map((condition) => {
        const config   = configs.find((c) => c.key === condition.key);
        const label    = config?.label ?? condition.key;
        const opLabel  = OPERATOR_LABELS[condition.operator] ?? condition.operator;
        const valueStr = formatValue(condition);

        return (
          <Chip
            key={condition.id}
            className="ff-chip"
            label={`${label}: ${opLabel} ${valueStr}`}
            onDelete={() => onRemove(condition.id)}
            size="small"
            aria-label={`Remove ${label} filter`}
            sx={{
              bgcolor: 'rgba(108,99,255,0.12)',
              color: '#c4b5fd',
              border: '1px solid rgba(108,99,255,0.38)',
              backdropFilter: 'blur(4px)',
              fontWeight: 600,
              fontSize: '0.7rem',
              height: 26,
              '& .MuiChip-label': { px: 1.25 },
              '& .MuiChip-deleteIcon': {
                color: 'rgba(196,181,253,0.5)',
                fontSize: '15px',
                mr: 0.25,
                '&:hover': { color: '#ef4444' },
              },
              '&:hover': {
                boxShadow: '0 0 8px rgba(108,99,255,0.3)',
              },
              transition: 'box-shadow 0.2s',
            }}
          />
        );
      })}
    </Box>
  );
};

export default FilterSummaryBar;
