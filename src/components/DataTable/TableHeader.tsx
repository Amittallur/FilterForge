import React from 'react';
import {
  TableCell,
  TableHead,
  TableRow,
  TableSortLabel,
  Tooltip,
} from '@mui/material';
import type { SortState } from '../../types/filter.types';

export interface ColumnDef {
  key: string;
  label: string;
  align?: 'left' | 'right' | 'center';
  width?: number | string;
}

interface TableHeaderProps {
  columns: ColumnDef[];
  sort: SortState | null;
  onSort: (key: string) => void;
}

const TableHeader: React.FC<TableHeaderProps> = ({ columns, sort, onSort }) => {
  return (
    <TableHead>
      <TableRow>
        {columns.map((col) => {
          const isActive = sort?.key === col.key;
          return (
            <TableCell
              key={col.key}
              align={col.align ?? 'left'}
              width={col.width}
              sortDirection={isActive ? sort!.direction : false}
              sx={{
                '&.MuiTableCell-head': {
                  // Highlight active sort column
                  color: isActive ? '#2563EB' : '#6B7280',
                  textShadow: 'none',
                  borderBottom: isActive
                    ? '1px solid #2563EB'
                    : '1px solid #E5E7EB',
                  transition: 'color 0.2s, border-color 0.2s',
                },
              }}
            >
              <Tooltip title={`Sort by ${col.label}`} placement="top">
                <TableSortLabel
                  active={isActive}
                  direction={isActive ? sort!.direction : 'asc'}
                  onClick={() => onSort(col.key)}
                  aria-label={`Sort by ${col.label}`}
                  sx={{
                    '& .MuiTableSortLabel-icon': {
                      transition: 'transform 0.2s ease, opacity 0.2s',
                      // MUI auto-rotates 180deg when direction flips — smooth via transition
                    },
                    '&.Mui-active .MuiTableSortLabel-icon': {
                      color: '#2563EB',
                    },
                  }}
                >
                  {col.label}
                </TableSortLabel>
              </Tooltip>
            </TableCell>
          );
        })}
      </TableRow>
    </TableHead>
  );
};

export default TableHeader;
