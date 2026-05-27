import { useCallback, useMemo, useState } from 'react';
import {
  AppBar,
  Box,
  CircularProgress,
  Container,
  CssBaseline,
  Stack,
  ThemeProvider,
  Toolbar,
  Typography,
  createTheme,
} from '@mui/material';
import type { Employee, FilterConfig } from './types/filter.types';
import { useFilterEngine } from './hooks/useFilterEngine';
import { FilterBuilder } from './components/FilterBuilder';
import { DataTable } from './components/DataTable';
import employeesData from './data/employees.json';

// ─── MUI Dark Theme ───────────────────────────────────────────────────────────

const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main:  '#6C63FF',
      light: '#a5b4fc',
      dark:  '#4f46e5',
    },
    secondary: { main: '#3B82F6' },
    background: {
      default: '#0A0B0F',
      paper:   '#13151C',
    },
    divider: 'rgba(255,255,255,0.06)',
    text: {
      primary:   '#F1F5F9',
      secondary: '#94A3B8',
      disabled:  '#475569',
    },
    success: { main: '#22c55e', light: '#4ade80' },
    error:   { main: '#ef4444', light: '#fca5a5', dark: '#7f1d1d' },
  },
  typography: {
    fontFamily: '"Inter", "Segoe UI", Roboto, sans-serif',
    h5:       { fontWeight: 800, letterSpacing: '-0.02em' },
    h6:       { fontWeight: 700, letterSpacing: '-0.01em' },
    subtitle2:{ fontWeight: 600 },
    body2:    { fontSize: '0.85rem' },
    caption:  { fontSize: '0.72rem' },
  },
  shape: { borderRadius: 10 },
  components: {
    MuiCssBaseline: {
      styleOverrides: { body: { backgroundColor: '#0A0B0F' } },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
          backgroundColor: '#13151C',
          border: '1px solid rgba(255,255,255,0.06)',
        },
      },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          backgroundColor: '#1C1F2B',
          borderRadius: '8px',
          fontSize: '0.875rem',
          transition: 'box-shadow 0.18s',
          '& .MuiOutlinedInput-notchedOutline': {
            borderColor: 'rgba(255,255,255,0.08)',
            transition: 'border-color 0.18s',
          },
          '&:hover .MuiOutlinedInput-notchedOutline': {
            borderColor: 'rgba(255,255,255,0.18)',
          },
          '&.Mui-focused': {
            boxShadow: '0 0 0 2.5px rgba(108,99,255,0.28)',
          },
          '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
            borderColor: '#6C63FF',
            borderWidth: '1px',
          },
        },
      },
    },
    MuiInputLabel: {
      styleOverrides: {
        root: {
          fontSize: '0.85rem',
          color: 'rgba(255,255,255,0.35)',
          '&.Mui-focused': { color: '#6C63FF' },
        },
      },
    },
    MuiSelect: {
      styleOverrides: {
        root: { fontSize: '0.875rem' },
        icon: { color: 'rgba(255,255,255,0.3)' },
      },
    },
    MuiMenuItem: {
      styleOverrides: {
        root: {
          fontSize: '0.875rem',
          '&.Mui-selected': {
            backgroundColor: 'rgba(108,99,255,0.15)',
            '&:hover': { backgroundColor: 'rgba(108,99,255,0.22)' },
          },
          '&:hover': { backgroundColor: 'rgba(255,255,255,0.05)' },
        },
      },
    },
    MuiMenu: {
      styleOverrides: {
        paper: {
          backgroundColor: '#1C1F2B',
          border: '1px solid rgba(255,255,255,0.08)',
          boxShadow: '0 8px 32px rgba(0,0,0,0.5)',
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          fontWeight: 600,
          letterSpacing: '0',
          transition: 'all 0.15s ease',
          '&:active': { transform: 'scale(0.97)' },
        },
        contained: {
          background: 'linear-gradient(135deg, #6C63FF 0%, #3B82F6 100%)',
          boxShadow: 'none',
          '&:hover': {
            background: 'linear-gradient(135deg, #5a52e8 0%, #2d74e7 100%)',
            boxShadow: '0 0 16px rgba(108,99,255,0.4)',
            transform: 'scale(1.02)',
          },
        },
        outlined: {
          borderColor: 'rgba(255,255,255,0.12)',
          '&:hover': {
            borderColor: '#6C63FF',
            backgroundColor: 'rgba(108,99,255,0.08)',
          },
        },
      },
    },
    MuiIconButton: {
      styleOverrides: {
        root: {
          transition: 'all 0.15s ease',
          '&:active': { transform: 'scale(0.9)' },
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          fontWeight: 600,
          fontSize: '0.72rem',
          height: 26,
          backgroundColor: 'rgba(108,99,255,0.12)',
          border: '1px solid rgba(108,99,255,0.35)',
          color: '#a5b4fc',
          '& .MuiChip-deleteIcon': {
            color: 'rgba(165,180,252,0.6)',
            fontSize: '14px',
            '&:hover': { color: '#ef4444' },
          },
        },
      },
    },
    MuiTableCell: {
      styleOverrides: {
        head: {
          backgroundColor: '#1C1F2B',
          color: 'rgba(255,255,255,0.38)',
          fontSize: '0.68rem',
          fontWeight: 700,
          textTransform: 'uppercase',
          letterSpacing: '0.09em',
          borderBottom: '1px solid rgba(255,255,255,0.06)',
          padding: '10px 16px',
        },
        body: {
          borderColor: 'rgba(255,255,255,0.04)',
          padding: '10px 16px',
        },
      },
    },
    MuiTableSortLabel: {
      styleOverrides: {
        root: {
          color: 'rgba(255,255,255,0.38)',
          '&:hover': { color: 'rgba(255,255,255,0.7)' },
          '&.Mui-active': {
            color: '#6C63FF',
            textShadow: '0 0 8px rgba(108,99,255,0.5)',
          },
          '& .MuiTableSortLabel-icon': {
            transition: 'transform 0.2s ease, opacity 0.2s',
          },
        },
      },
    },
    MuiTooltip: {
      styleOverrides: {
        tooltip: {
          backgroundColor: '#1C1F2B',
          border: '1px solid rgba(255,255,255,0.1)',
          fontSize: '0.72rem',
          fontWeight: 500,
        },
      },
    },
    MuiTablePagination: {
      styleOverrides: {
        root: { color: 'rgba(255,255,255,0.45)', fontSize: '0.8rem' },
        selectLabel: { fontSize: '0.8rem', color: 'rgba(255,255,255,0.45)' },
        displayedRows: { fontSize: '0.8rem', color: 'rgba(255,255,255,0.45)' },
        actions: {
          '& .MuiIconButton-root': {
            color: 'rgba(255,255,255,0.4)',
            '&:not(:disabled):hover': {
              color: '#6C63FF',
              backgroundColor: 'rgba(108,99,255,0.12)',
            },
            '&:disabled': { opacity: 0.25 },
          },
        },
      },
    },
    MuiDivider: {
      styleOverrides: {
        root: { borderColor: 'rgba(255,255,255,0.06)' },
      },
    },
  },
});

// ─── Employee FilterConfig ────────────────────────────────────────────────────

const EMPLOYEE_FILTER_CONFIG: FilterConfig[] = [
  { key: 'name',              label: 'Name',               type: 'text' },
  { key: 'email',             label: 'Email',              type: 'text' },
  { key: 'role',              label: 'Role',               type: 'text' },
  {
    key: 'department',
    label: 'Department',
    type: 'select',
    options: [
      { label: 'Engineering', value: 'Engineering' },
      { label: 'Marketing',   value: 'Marketing' },
      { label: 'Design',      value: 'Design' },
      { label: 'Finance',     value: 'Finance' },
      { label: 'HR',          value: 'HR' },
    ],
  },
  { key: 'salary',            label: 'Salary',             type: 'amount' },
  { key: 'joinDate',          label: 'Join Date',          type: 'date' },
  { key: 'isActive',          label: 'Active',             type: 'boolean' },
  {
    key: 'skills',
    label: 'Skills',
    type: 'multiselect',
    options: [
      { label: 'React',             value: 'React' },
      { label: 'TypeScript',        value: 'TypeScript' },
      { label: 'Node.js',           value: 'Node.js' },
      { label: 'Python',            value: 'Python' },
      { label: 'Go',                value: 'Go' },
      { label: 'AWS',               value: 'AWS' },
      { label: 'Docker',            value: 'Docker' },
      { label: 'Kubernetes',        value: 'Kubernetes' },
      { label: 'PostgreSQL',        value: 'PostgreSQL' },
      { label: 'GraphQL',           value: 'GraphQL' },
      { label: 'Figma',             value: 'Figma' },
      { label: 'SQL',               value: 'SQL' },
      { label: 'Excel',             value: 'Excel' },
      { label: 'SEO',               value: 'SEO' },
      { label: 'Leadership',        value: 'Leadership' },
    ],
  },
  {
    key: 'address.city',
    label: 'City',
    type: 'select',
    options: [
      { label: 'San Francisco', value: 'San Francisco' },
      { label: 'New York',      value: 'New York' },
      { label: 'Seattle',       value: 'Seattle' },
      { label: 'Austin',        value: 'Austin' },
      { label: 'Chicago',       value: 'Chicago' },
      { label: 'Boston',        value: 'Boston' },
      { label: 'Los Angeles',   value: 'Los Angeles' },
      { label: 'Denver',        value: 'Denver' },
      { label: 'Miami',         value: 'Miami' },
      { label: 'Atlanta',       value: 'Atlanta' },
      { label: 'Phoenix',       value: 'Phoenix' },
      { label: 'Portland',      value: 'Portland' },
      { label: 'Minneapolis',   value: 'Minneapolis' },
      { label: 'Charlotte',     value: 'Charlotte' },
      { label: 'Dallas',        value: 'Dallas' },
      { label: 'San Jose',      value: 'San Jose' },
    ],
  },
  { key: 'projects',          label: 'Projects',           type: 'number' },
  { key: 'performanceRating', label: 'Performance Rating', type: 'number' },
];

// ─── App ──────────────────────────────────────────────────────────────────────

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const employees = employeesData as any as Employee[];

function AppContent() {
  const [isLoading] = useState(false);

  const { conditions, filteredData, addCondition, updateCondition, removeCondition, clearAll } =
    useFilterEngine<Employee>(EMPLOYEE_FILTER_CONFIG, employees);

  const activeFilterCount = useMemo(
    () => conditions.filter((c) => {
      if (c.type === 'text' || c.type === 'select') return c.value !== '';
      if (c.type === 'number') return c.value !== '';
      if (c.type === 'date' || c.type === 'amount') return c.value[0] !== '' || c.value[1] !== '';
      if (c.type === 'multiselect') return c.value.length > 0;
      return true;
    }).length,
    [conditions],
  );

  const handleAdd = useCallback(
    (config: FilterConfig) => addCondition(config),
    [addCondition],
  );

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
      {/* ── App Bar ── */}
      <AppBar
        position="sticky"
        elevation={0}
        sx={{
          bgcolor: 'rgba(19,21,28,0.82)',
          backdropFilter: 'blur(14px)',
          borderBottom: '1px solid rgba(255,255,255,0.06)',
          boxShadow: '0 1px 24px rgba(0,0,0,0.35)',
        }}
      >
        <Toolbar sx={{ gap: 1.5, minHeight: '62px !important', px: { xs: 2, md: 3 } }}>
          {/* Animated logo SVG */}
          <Box className="ff-logo">
            <svg width="34" height="34" viewBox="0 0 34 34" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
              <defs>
                <linearGradient id="ff-g1" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#6C63FF" />
                  <stop offset="100%" stopColor="#3B82F6" />
                </linearGradient>
              </defs>
              {/* Back funnel (offset, lighter) */}
              <path d="M7 7h22l-7.5 10.5V27l-7-3.5V17.5L7 7z" fill="url(#ff-g1)" opacity="0.4" />
              {/* Front funnel */}
              <path d="M5 5h22l-7.5 10.5V25l-7-3.5V15.5L5 5z" fill="url(#ff-g1)" />
              {/* Top highlight band */}
              <path d="M5 5h22l-2.2 3.2H7.2L5 5z" fill="rgba(255,255,255,0.22)" />
            </svg>
          </Box>

          {/* Brand text */}
          <Box sx={{ flexGrow: 1 }}>
            <Typography
              variant="h6"
              sx={{
                fontWeight: 800,
                fontSize: '1.05rem',
                letterSpacing: '-0.03em',
                background: 'linear-gradient(135deg, #8B83FF 0%, #C0BAFF 45%, #60A5FA 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
                lineHeight: 1.1,
              }}
            >
              FilterForge
            </Typography>
            <Typography
              variant="caption"
              sx={{ color: 'text.disabled', lineHeight: 1, display: 'block', mt: 0.1 }}
            >
              Dynamic Filter Engine
            </Typography>
          </Box>

          {/* Employee count glowing pill */}
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 0.8,
              px: 1.75,
              py: 0.65,
              borderRadius: 20,
              bgcolor: 'rgba(108,99,255,0.12)',
              border: '1px solid rgba(108,99,255,0.32)',
              boxShadow: '0 0 14px rgba(108,99,255,0.28)',
            }}
          >
            <Box
              sx={{
                width: 7,
                height: 7,
                borderRadius: '50%',
                background: 'linear-gradient(135deg, #6C63FF, #3B82F6)',
                boxShadow: '0 0 6px rgba(108,99,255,0.7)',
              }}
            />
            <Typography
              variant="caption"
              sx={{ fontWeight: 700, color: '#a5b4fc', whiteSpace: 'nowrap', letterSpacing: '0.01em' }}
            >
              {employees.length} employees
            </Typography>
          </Box>
        </Toolbar>
      </AppBar>

      {/* ── Main Content ── */}
      <Container maxWidth="xl" sx={{ py: { xs: 3, md: 4 }, px: { xs: 2, md: 3 } }}>
        {isLoading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 12 }}>
            <CircularProgress sx={{ color: '#6C63FF' }} />
          </Box>
        ) : (
          <Stack spacing={3}>
            <FilterBuilder
              configs={EMPLOYEE_FILTER_CONFIG}
              conditions={conditions}
              onAdd={handleAdd}
              onUpdate={updateCondition}
              onRemove={removeCondition}
              onClearAll={clearAll}
            />

            <DataTable
              data={filteredData}
              totalCount={employees.length}
              activeFilterCount={activeFilterCount}
            />
          </Stack>
        )}
      </Container>
    </Box>
  );
}

export default function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AppContent />
    </ThemeProvider>
  );
}
