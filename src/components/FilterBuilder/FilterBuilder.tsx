import React, { useCallback, useState } from 'react';
import {
  Box,
  Button,
  Collapse,
  Divider,
  Paper,
  Stack,
  Typography,
} from '@mui/material';
import { ChevronDown, Filter, Plus, Trash2 } from 'lucide-react';
import type { FilterCondition, FilterConfig } from '../../types/filter.types';
import FilterRow from './FilterRow';
import FilterSummaryBar from './FilterSummaryBar';
import { filterRegistry } from '../../registry/filterRegistry';

interface FilterBuilderProps {
  configs: FilterConfig[];
  conditions: FilterCondition[];
  onAdd: (config: FilterConfig) => void;
  onUpdate: (id: string, updates: Partial<FilterCondition>) => void;
  onRemove: (id: string) => void;
  onClearAll: () => void;
}

const FilterBuilder: React.FC<FilterBuilderProps> = ({
  configs, conditions, onAdd, onUpdate, onRemove, onClearAll,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleFieldChange = useCallback(
    (id: string, newConfig: FilterConfig) => {
      const definition = filterRegistry[newConfig.type];
      const defaultOperator = definition.operators[0];
      let defaultValue: FilterCondition['value'];
      switch (newConfig.type) {
        case 'text': case 'select': defaultValue = ''; break;
        case 'number': defaultValue = ''; break;
        case 'date': case 'amount': defaultValue = ['', '']; break;
        case 'multiselect': defaultValue = []; break;
        case 'boolean': defaultValue = true; break;
      }
      onUpdate(id, { key: newConfig.key, type: newConfig.type, operator: defaultOperator as FilterCondition['operator'], value: defaultValue } as Partial<FilterCondition>);
    },
    [onUpdate],
  );

  const handleOperatorChange = useCallback(
    (id: string, operator: string) => onUpdate(id, { operator: operator as FilterCondition['operator'] }),
    [onUpdate],
  );

  const handleValueChange = useCallback(
    (id: string, value: FilterCondition['value']) => onUpdate(id, { value } as Partial<FilterCondition>),
    [onUpdate],
  );

  const activeCount = conditions.length;

  return (
    <Stack spacing={2}>
      {/* Summary chips — shown above the panel */}
      <FilterSummaryBar conditions={conditions} configs={configs} onRemove={onRemove} />

      {/* Filter panel */}
      <Paper
        elevation={0}
        sx={{
          borderRadius: '14px',
          overflow: 'hidden',
          border: '1px solid #E5E7EB',
          borderLeft: '4px solid #2563EB',
          bgcolor: '#FFFFFF',
          boxShadow: activeCount > 0 ? '0 4px 12px rgba(37,99,235,0.1)' : 'none',
          transition: 'box-shadow 0.3s ease',
        }}
      >
        {/* Panel header */}
        <Box
          sx={{
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            px: 2.5, py: 1.5,
            cursor: 'pointer', userSelect: 'none',
            background: 'linear-gradient(90deg, #F9FAFB 0%, #FFFFFF 60%)',
            '&:hover': { bgcolor: '#F3F4F6' },
            transition: 'background-color 0.15s',
          }}
          onClick={() => setIsOpen((v) => !v)}
          role="button"
          aria-expanded={isOpen}
          aria-label="Toggle filter panel"
        >
          {/* Left — title + badge */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.25 }}>
            <Box
              sx={{
                width: 28, height: 28, borderRadius: 1.5,
                background: '#EFF6FF',
                border: '1px solid #BFDBFE',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}
            >
              <Filter size={13} style={{ color: '#2563EB' }} />
            </Box>

            <Typography variant="subtitle2" sx={{ fontWeight: 700, color: 'text.primary' }}>
              Filters
            </Typography>

            {activeCount > 0 && (
              <Box
                sx={{
                  px: 0.9, py: 0.1,
                  borderRadius: 10,
                  background: '#2563EB',
                  color: '#fff',
                  fontSize: '0.65rem', fontWeight: 800,
                  lineHeight: 1.7,
                  boxShadow: '0 2px 4px rgba(37,99,235,0.3)',
                  minWidth: 18, textAlign: 'center',
                }}
              >
                {activeCount}
              </Box>
            )}
          </Box>

          {/* Right — buttons */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            {activeCount > 0 && (
              <Button
                size="small"
                variant="text"
                color="error"
                startIcon={<Trash2 size={12} />}
                onClick={(e) => { e.stopPropagation(); onClearAll(); }}
                aria-label="Clear all filters"
                sx={{
                  fontSize: '0.72rem', py: 0.4, px: 1,
                  color: '#DC2626',
                  '&:hover': { color: '#B91C1C', bgcolor: '#FEE2E2' },
                  borderRadius: 10,
                }}
              >
                Clear all
              </Button>
            )}

            <Button
              size="small"
              variant="contained"
              startIcon={<Plus size={13} />}
              onClick={(e) => { e.stopPropagation(); onAdd(configs[0]); setIsOpen(true); }}
              aria-label="Add filter"
              sx={{
                borderRadius: 20,
                fontSize: '0.72rem',
                py: 0.55, px: 1.5,
                background: 'linear-gradient(135deg, #2563EB 0%, #1D4ED8 100%)',
                color: '#fff',
                boxShadow: '0 1px 2px rgba(0,0,0,0.05)',
                '&:hover': {
                  background: 'linear-gradient(135deg, #1D4ED8 0%, #1E40AF 100%)',
                  boxShadow: '0 4px 12px rgba(37,99,235,0.25)',
                  transform: 'scale(1.02)',
                },
              }}
            >
              Add Filter
            </Button>

            <Box
              sx={{
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                width: 26, height: 26, color: 'text.disabled',
                transition: 'transform 0.2s ease',
                transform: isOpen && activeCount > 0 ? 'rotate(180deg)' : 'rotate(0deg)',
              }}
            >
              <ChevronDown size={16} />
            </Box>
          </Box>
        </Box>

        {/* Filter rows */}
        <Collapse in={isOpen && activeCount > 0}>
          <Divider sx={{ borderColor: '#E5E7EB' }} />
          <Stack spacing={1.25} sx={{ p: 2 }}>
            {conditions.map((condition) => (
              <FilterRow
                key={condition.id}
                condition={condition}
                configs={configs}
                onFieldChange={handleFieldChange}
                onOperatorChange={handleOperatorChange}
                onValueChange={handleValueChange}
                onRemove={onRemove}
              />
            ))}
          </Stack>
        </Collapse>
      </Paper>
    </Stack>
  );
};

export default FilterBuilder;
