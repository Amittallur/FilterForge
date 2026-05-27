import React, { useMemo, useState, useCallback, useRef, useEffect } from 'react';
import {
  Box,
  Button,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TablePagination,
  TableRow,
  Tooltip,
  Typography,
} from '@mui/material';
import { Check, Download, FilterX } from 'lucide-react';
import type { Employee } from '../../types/filter.types';
import type { SortState } from '../../types/filter.types';
import TableHeader, { type ColumnDef } from './TableHeader';
import { getNestedValue } from '../../utils/getNestedValue';
import { exportToCsv } from '../../utils/csvExport';

// ─── Column definitions ───────────────────────────────────────────────────────

const COLUMNS: ColumnDef[] = [
  { key: 'name',              label: 'Employee',     width: 200 },
  { key: 'department',        label: 'Department',   width: 130 },
  { key: 'role',              label: 'Role',         width: 180 },
  { key: 'salary',            label: 'Salary',       align: 'right', width: 105 },
  { key: 'joinDate',          label: 'Joined',       width: 95 },
  { key: 'isActive',          label: 'Active',       align: 'center', width: 72 },
  { key: 'address.city',      label: 'City',         width: 120 },
  { key: 'projects',          label: 'Projects',     align: 'right', width: 80 },
  { key: 'performanceRating', label: 'Rating',       align: 'center', width: 115 },
  { key: 'skills',            label: 'Skills',       width: 230 },
];

// ─── Visual helpers ───────────────────────────────────────────────────────────

/** Deterministic HSL color from a string (for avatars) */
function hashToHsl(str: string): string {
  let h = 0;
  for (let i = 0; i < str.length; i++) h = ((h << 5) - h + str.charCodeAt(i)) | 0;
  return `hsl(${Math.abs(h) % 360}, 52%, 40%)`;
}

/** 6 preset color pairs for skill tags */
const SKILL_PALETTE = [
  { bg: '#DBEAFE', color: '#1E40AF' },
  { bg: '#D1FAE5', color: '#065F46' },
  { bg: '#FEF3C7', color: '#92400E' },
  { bg: '#FCE7F3', color: '#9D174D' },
  { bg: '#E0E7FF', color: '#3730A3' },
  { bg: '#F3E8FF', color: '#6B21A8' },
] as const;

function hashSkillColor(skill: string) {
  let h = 0;
  for (let i = 0; i < skill.length; i++) h = ((h << 5) - h + skill.charCodeAt(i)) | 0;
  return SKILL_PALETTE[Math.abs(h) % SKILL_PALETTE.length];
}

/** Department gradient badges */
const DEPT_STYLE: Record<string, { bg: string; color: string; glow: string }> = {
  Engineering: { bg: 'linear-gradient(135deg, #DBEAFE, #EFF6FF)',  color: '#1D4ED8', glow: 'rgba(37,99,235,0.2)' },
  Marketing:   { bg: 'linear-gradient(135deg, #FCE7F3, #FDF2F8)',  color: '#BE185D', glow: 'rgba(219,39,119,0.2)' },
  Design:      { bg: 'linear-gradient(135deg, #D1FAE5, #ECFDF5)',  color: '#047857', glow: 'rgba(5,150,105,0.2)' },
  Finance:     { bg: 'linear-gradient(135deg, #FEF3C7, #FFFBEB)',  color: '#B45309', glow: 'rgba(217,119,6,0.2)' },
  HR:          { bg: 'linear-gradient(135deg, #E0E7FF, #EEF2FF)',  color: '#4338CA', glow: 'rgba(79,70,229,0.2)' },
};

/** Rating color + ratingScale */
function ratingStyle(r: number): { color: string; bg: string } {
  if (r >= 4.5) return { color: '#B45309', bg: '#FEF3C7' };
  if (r >= 4.0) return { color: '#047857', bg: '#D1FAE5' };
  if (r >= 3.5) return { color: '#C2410C', bg: '#FFEDD5' };
  return          { color: '#B91C1C', bg: '#FEE2E2' };
}

// ─── CountUp hook ─────────────────────────────────────────────────────────────

function useCountUp(target: number, duration = 380): number {
  const [displayed, setDisplayed] = useState(target);
  const rafRef  = useRef(0);
  const fromRef = useRef(target);

  useEffect(() => {
    const from = fromRef.current;
    let startTs = 0;
    cancelAnimationFrame(rafRef.current);

    const step = (ts: number) => {
      if (!startTs) startTs = ts;
      const prog = Math.min((ts - startTs) / duration, 1);
      const ease = 1 - (1 - prog) ** 3;
      const next = Math.round(from + (target - from) * ease);
      setDisplayed(next);
      if (prog < 1) rafRef.current = requestAnimationFrame(step);
      else fromRef.current = target;
    };

    rafRef.current = requestAnimationFrame(step);
    return () => cancelAnimationFrame(rafRef.current);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [target]);

  return displayed;
}

// ─── Cell renderers ───────────────────────────────────────────────────────────

function renderCell(col: ColumnDef, row: Employee): React.ReactNode {
  const raw = getNestedValue(row, col.key);

  switch (col.key) {
    // ── Name + avatar + email ──
    case 'name': {
      const name = String(raw ?? '');
      const initials = name.split(' ').slice(0, 2).map(w => w[0]).join('').toUpperCase();
      const avatarBg = hashToHsl(name);
      return (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.25 }}>
          <Box
            sx={{
              width: 32, height: 32, borderRadius: '50%',
              bgcolor: avatarBg,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '0.65rem', fontWeight: 700, color: '#fff',
              flexShrink: 0, letterSpacing: '0.03em',
              boxShadow: `0 0 0 2px rgba(255,255,255,0.06)`,
            }}
          >
            {initials}
          </Box>
          <Box sx={{ minWidth: 0 }}>
            <Typography variant="body2" sx={{ fontWeight: 600, color: 'text.primary', lineHeight: 1.2 }} noWrap>
              {name}
            </Typography>
            <Typography variant="caption" sx={{ color: 'text.secondary', lineHeight: 1.2, display: 'block' }} noWrap>
              {row.email}
            </Typography>
          </Box>
        </Box>
      );
    }

    // ── Salary gradient ──
    case 'salary':
      return (
        <span className="ff-salary">
          ${(raw as number).toLocaleString()}
        </span>
      );

    // ── Active pulsing dot ──
    case 'isActive':
      return (
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          {raw ? (
            <Tooltip title="Active" placement="top">
              <Box className="ff-pulse">
                <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: '#10B981', position: 'relative', zIndex: 1 }} />
              </Box>
            </Tooltip>
          ) : (
            <Tooltip title="Inactive" placement="top">
              <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: '#E5E7EB' }} />
            </Tooltip>
          )}
        </Box>
      );

    // ── Department gradient badge ──
    case 'department': {
      const dept = String(raw ?? '');
      const ds = DEPT_STYLE[dept] ?? { bg: 'rgba(255,255,255,0.06)', color: 'text.secondary', glow: 'transparent' };
      return (
        <Box
          sx={{
            display: 'inline-flex', alignItems: 'center',
            px: 1.25, py: 0.35,
            borderRadius: 1.5,
            background: ds.bg,
            color: ds.color,
            fontSize: '0.7rem', fontWeight: 700,
            whiteSpace: 'nowrap',
            border: `1px solid ${ds.glow}`,
            transition: 'box-shadow 0.2s',
            '&:hover': { boxShadow: `0 0 10px ${ds.glow}` },
          }}
        >
          {dept}
        </Box>
      );
    }

    // ── Rating dots + color ──
    case 'performanceRating': {
      const r = raw as number;
      const rs = ratingStyle(r);
      const filled = Math.round(r);
      return (
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 0.75 }}>
          <Box
            sx={{
              px: 0.75, py: 0.2, borderRadius: 1,
              bgcolor: rs.bg, color: rs.color,
              fontSize: '0.72rem', fontWeight: 800, lineHeight: 1.4, minWidth: 28, textAlign: 'center',
            }}
          >
            {r.toFixed(1)}
          </Box>
          <Box sx={{ display: 'flex', gap: 0.35 }}>
            {Array.from({ length: 5 }, (_, i) => (
              <Box
                key={i}
                sx={{
                  width: 5, height: 5, borderRadius: '50%',
                  bgcolor: i < filled ? rs.color : '#E5E7EB',
                  transition: 'background-color 0.2s',
                }}
              />
            ))}
          </Box>
        </Box>
      );
    }

    // ── Skill color-hashed pills ──
    case 'skills': {
      const skills = raw as string[];
      return (
        <Box sx={{ display: 'flex', flexWrap: 'nowrap', gap: 0.5, alignItems: 'center' }}>
          {skills.slice(0, 2).map((s) => {
            const sc = hashSkillColor(s);
            return (
              <Box
                key={s}
                sx={{
                  px: 0.85, py: 0.15,
                  borderRadius: 10,
                  bgcolor: sc.bg, color: sc.color,
                  fontSize: '0.62rem', fontWeight: 600,
                  whiteSpace: 'nowrap',
                  border: `1px solid ${sc.color}40`,
                }}
              >
                {s}
              </Box>
            );
          })}
          {skills.length > 2 && (
            <Box
              sx={{
                px: 0.75, py: 0.15,
                borderRadius: 10,
                bgcolor: '#F3F4F6', color: 'text.secondary',
                fontSize: '0.62rem', fontWeight: 600, whiteSpace: 'nowrap',
              }}
            >
              +{skills.length - 2}
            </Box>
          )}
        </Box>
      );
    }

    // ── Join date ──
    case 'joinDate':
      return (
        <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 500 }}>
          {new Date(String(raw)).toLocaleDateString('en-US', { year: 'numeric', month: 'short' })}
        </Typography>
      );

    // ── Projects ──
    case 'projects':
      return (
        <Typography variant="body2" sx={{ fontWeight: 700, color: 'text.primary', textAlign: 'right' }}>
          {String(raw ?? '—')}
        </Typography>
      );

    default:
      return (
        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
          {raw === null || raw === undefined ? '—' : String(raw)}
        </Typography>
      );
  }
}

// ─── Props ────────────────────────────────────────────────────────────────────

interface DataTableProps {
  data: Employee[];
  totalCount: number;
  activeFilterCount: number;
}

// ─── Component ────────────────────────────────────────────────────────────────

const DataTable: React.FC<DataTableProps> = ({ data, totalCount, activeFilterCount }) => {
  const [sort, setSort]               = useState<SortState | null>(null);
  const [page, setPage]               = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [exportDone, setExportDone]   = useState(false);

  const animatedCount = useCountUp(data.length);

  const handleSort = useCallback((key: string) => {
    setSort((prev) => {
      if (prev?.key === key) return { key, direction: prev.direction === 'asc' ? 'desc' : 'asc' };
      return { key, direction: 'asc' };
    });
    setPage(0);
  }, []);

  const sortedData = useMemo<Employee[]>(() => {
    if (!sort) return data;
    return [...data].sort((a, b) => {
      const aVal = getNestedValue(a, sort.key);
      const bVal = getNestedValue(b, sort.key);
      const cmp  = String(aVal ?? '').localeCompare(String(bVal ?? ''), undefined, { numeric: true });
      return sort.direction === 'asc' ? cmp : -cmp;
    });
  }, [data, sort]);

  const paginatedData = useMemo(
    () => sortedData.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage),
    [sortedData, page, rowsPerPage],
  );

  const handleExport = useCallback(() => {
    exportToCsv(data, 'filterforge-employees');
    setExportDone(true);
    setTimeout(() => setExportDone(false), 1500);
  }, [data]);

  const handleChangePage       = useCallback((_: unknown, p: number) => setPage(p), []);
  const handleChangeRowsPerPage = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(e.target.value, 10));
    setPage(0);
  }, []);

  const progressPct = totalCount > 0 ? (data.length / totalCount) * 100 : 100;

  return (
    <Paper
      elevation={0}
      sx={{
        borderRadius: '16px',
        overflow: 'hidden',
        border: '1px solid #E5E7EB',
        boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
        bgcolor: '#FFFFFF',
      }}
    >
      {/* ── Toolbar ── */}
      <Box
        sx={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          px: 2.5, py: 1.5,
          borderBottom: '1px solid #E5E7EB',
          background: 'linear-gradient(180deg, #F9FAFB 0%, #FFFFFF 100%)',
        }}
      >
        {/* Record count + progress */}
        <Box>
          <Typography variant="body2" sx={{ fontWeight: 500, color: 'text.secondary' }}>
            Showing{' '}
            <Box
              key={data.length}
              component="span"
              className="ff-count"
              sx={{
                fontWeight: 800,
                color: data.length < totalCount ? '#2563EB' : 'text.primary',
                fontSize: '1rem',
              }}
            >
              {animatedCount.toLocaleString()}
            </Box>{' '}
            <Box component="span" sx={{ color: 'text.disabled' }}>of</Box>{' '}
            <Box component="span" sx={{ fontWeight: 700, color: 'text.primary' }}>
              {totalCount.toLocaleString()}
            </Box>{' '}
            employees
            {activeFilterCount > 0 && (
              <Box component="span" sx={{ color: 'text.disabled', ml: 1, fontSize: '0.75rem' }}>
                · {activeFilterCount} filter{activeFilterCount !== 1 ? 's' : ''} active
              </Box>
            )}
          </Typography>

          {/* Progress bar */}
          {data.length < totalCount && (
            <Box sx={{ mt: 0.75, height: 2, width: 240, bgcolor: '#E5E7EB', borderRadius: 1, overflow: 'hidden' }}>
              <Box
                className="ff-progress"
                key={`pb-${data.length}`}
                sx={{
                  height: '100%',
                  width: `${progressPct}%`,
                  background: 'linear-gradient(90deg, #2563EB, #60A5FA)',
                  borderRadius: 1,
                  transition: 'width 0.4s cubic-bezier(0.34,1.56,0.64,1)',
                }}
              />
            </Box>
          )}
        </Box>

        {/* Export CSV button */}
        <Button
          size="small"
          variant="outlined"
          startIcon={exportDone ? <Check size={14} /> : <Download size={14} />}
          onClick={handleExport}
          disabled={data.length === 0}
          aria-label="Export filtered data as CSV"
          sx={{
            borderRadius: 20,
            fontSize: '0.75rem',
            px: 2, py: 0.6,
            borderColor: exportDone ? 'rgba(16,185,129,0.4)' : '#E5E7EB',
            color: exportDone ? '#10B981' : 'text.secondary',
            transition: 'all 0.2s ease',
            '&:hover': {
              borderColor: exportDone ? 'rgba(16,185,129,0.6)' : '#2563EB',
              color: exportDone ? '#10B981' : '#1D4ED8',
              bgcolor: exportDone ? 'rgba(16,185,129,0.08)' : '#EFF6FF',
            },
          }}
        >
          {exportDone ? 'Exported!' : 'Export CSV'}
        </Button>
      </Box>

      {/* ── Empty State ── */}
      {data.length === 0 ? (
        <Box
          sx={{
            display: 'flex', flexDirection: 'column', alignItems: 'center',
            justifyContent: 'center', py: 12, gap: 2, px: 3,
          }}
        >
          <Box
            sx={{
              width: 72, height: 72, borderRadius: '50%',
              bgcolor: '#EFF6FF',
              border: '1px solid #BFDBFE',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}
          >
            <FilterX size={32} strokeWidth={1.5} style={{ color: '#2563EB' }} />
          </Box>
          <Box sx={{ textAlign: 'center' }}>
            <Typography variant="h6" sx={{ fontWeight: 700, color: 'text.secondary', mb: 0.5 }}>
              No employees match your filters
            </Typography>
            <Typography variant="body2" sx={{ color: 'text.disabled', maxWidth: 340 }}>
              {activeFilterCount > 0
                ? `You have ${activeFilterCount} active filter${activeFilterCount !== 1 ? 's' : ''}. Try relaxing your conditions.`
                : 'Try adjusting your filter conditions.'}
            </Typography>
          </Box>
        </Box>
      ) : (
        <>
          <TableContainer sx={{ maxHeight: 520 }}>
            <Table stickyHeader size="small" aria-label="Employee data table">
              <TableHeader columns={COLUMNS} sort={sort} onSort={handleSort} />
              <TableBody>
                {paginatedData.map((row, idx) => (
                  <TableRow
                    key={row.id}
                    sx={{
                      bgcolor: idx % 2 === 0 ? '#FFFFFF' : '#F9FAFB',
                      transition: 'background-color 0.15s, box-shadow 0.15s',
                      '&:hover': {
                        bgcolor: '#F3F4F6',
                        boxShadow: 'inset 3px 0 0 #2563EB',
                      },
                      '&:last-child td': { borderBottom: 0 },
                    }}
                  >
                    {COLUMNS.map((col) => (
                      <TableCell
                        key={col.key}
                        align={col.align ?? 'left'}
                        sx={{ whiteSpace: col.key === 'name' ? 'nowrap' : undefined }}
                      >
                        {renderCell(col, row)}
                      </TableCell>
                    ))}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>

          <TablePagination
            component="div"
            count={sortedData.length}
            page={page}
            rowsPerPage={rowsPerPage}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
            rowsPerPageOptions={[10, 25, 50]}
            sx={{
              borderTop: '1px solid #E5E7EB',
              bgcolor: '#F9FAFB',
            }}
          />
        </>
      )}
    </Paper>
  );
};

export default DataTable;
