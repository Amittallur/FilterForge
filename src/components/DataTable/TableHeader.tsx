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
                  color: isActive ? '#8B83FF' : 'rgba(255,255,255,0.38)',
                  textShadow: isActive ? '0 0 10px rgba(108,99,255,0.55)' : 'none',
                  borderBottom: isActive
                    ? '1px solid rgba(108,99,255,0.35)'
                    : '1px solid rgba(255,255,255,0.06)',
                  transition: 'color 0.2s, text-shadow 0.2s, border-color 0.2s',
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
                      color: '#8B83FF',
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
