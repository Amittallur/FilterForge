import { useCallback, useEffect, useMemo, useState } from 'react';
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
    mode: 'light',
    primary: {
      main:  '#2563EB',
      light: '#60A5FA',
      dark:  '#1D4ED8',
    },
    secondary: { main: '#0F766E' },
    background: {
      default: '#F3F4F6',
      paper:   '#FFFFFF',
    },
    divider: '#E5E7EB',
    text: {
      primary:   '#111827',
      secondary: '#4B5563',
      disabled:  '#9CA3AF',
    },
    success: { main: '#10B981', light: '#34D399' },
    error:   { main: '#EF4444', light: '#F87171', dark: '#B91C1C' },
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
      styleOverrides: { body: { backgroundColor: '#F3F4F6' } },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
          backgroundColor: '#FFFFFF',
          border: '1px solid #E5E7EB',
        },
      },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          backgroundColor: '#F9FAFB',
          borderRadius: '8px',
          fontSize: '0.875rem',
          transition: 'box-shadow 0.18s, border-color 0.18s',
          '& .MuiOutlinedInput-notchedOutline': {
            borderColor: '#E5E7EB',
            transition: 'border-color 0.18s',
          },
          '&:hover .MuiOutlinedInput-notchedOutline': {
            borderColor: '#D1D5DB',
          },
          '&.Mui-focused': {
            boxShadow: '0 0 0 2.5px rgba(37,99,235,0.2)',
          },
          '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
            borderColor: '#2563EB',
            borderWidth: '1px',
          },
        },
      },
    },
    MuiInputLabel: {
      styleOverrides: {
        root: {
          fontSize: '0.85rem',
          color: '#6B7280',
          '&.Mui-focused': { color: '#2563EB' },
        },
      },
    },
    MuiSelect: {
      styleOverrides: {
        root: { fontSize: '0.875rem' },
        icon: { color: '#6B7280' },
      },
    },
    MuiMenuItem: {
      styleOverrides: {
        root: {
          fontSize: '0.875rem',
          color: '#111827',
          '&.Mui-selected': {
            backgroundColor: '#EFF6FF',
            '&:hover': { backgroundColor: '#DBEAFE' },
          },
          '&:hover': { backgroundColor: '#F3F4F6' },
        },
      },
    },
    MuiMenu: {
      styleOverrides: {
        paper: {
          backgroundColor: '#FFFFFF',
          border: '1px solid #E5E7EB',
          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
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
          background: 'linear-gradient(135deg, #2563EB 0%, #1D4ED8 100%)',
          color: '#FFFFFF',
          boxShadow: '0 1px 2px rgba(0,0,0,0.05)',
          '&:hover': {
            background: 'linear-gradient(135deg, #1D4ED8 0%, #1E40AF 100%)',
            boxShadow: '0 4px 12px rgba(37,99,235,0.25)',
            transform: 'scale(1.02)',
          },
        },
        outlined: {
          borderColor: '#E5E7EB',
          color: '#4B5563',
          backgroundColor: '#FFFFFF',
          '&:hover': {
            borderColor: '#2563EB',
            backgroundColor: '#EFF6FF',
            color: '#1D4ED8',
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
          backgroundColor: '#EFF6FF',
          border: '1px solid #BFDBFE',
          color: '#1D4ED8',
          '& .MuiChip-deleteIcon': {
            color: '#93C5FD',
            fontSize: '14px',
            '&:hover': { color: '#EF4444' },
          },
        },
      },
    },
    MuiTableCell: {
      styleOverrides: {
        head: {
          backgroundColor: '#F9FAFB',
          color: '#6B7280',
          fontSize: '0.68rem',
          fontWeight: 700,
          textTransform: 'uppercase',
          letterSpacing: '0.05em',
          borderBottom: '1px solid #E5E7EB',
          padding: '10px 16px',
        },
        body: {
          borderColor: '#F3F4F6',
          padding: '10px 16px',
        },
      },
    },
    MuiTableSortLabel: {
      styleOverrides: {
        root: {
          color: '#6B7280',
          '&:hover': { color: '#111827' },
          '&.Mui-active': {
            color: '#2563EB',
            textShadow: 'none',
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
          backgroundColor: '#111827',
          border: 'none',
          fontSize: '0.72rem',
          fontWeight: 500,
          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
        },
      },
    },
    MuiTablePagination: {
      styleOverrides: {
        root: { color: '#4B5563', fontSize: '0.8rem' },
        selectLabel: { fontSize: '0.8rem', color: '#4B5563' },
        displayedRows: { fontSize: '0.8rem', color: '#4B5563' },
        actions: {
          '& .MuiIconButton-root': {
            color: '#4B5563',
            '&:not(:disabled):hover': {
              color: '#2563EB',
              backgroundColor: '#EFF6FF',
            },
            '&:disabled': { opacity: 0.25 },
          },
        },
      },
    },
    MuiDivider: {
      styleOverrides: {
        root: { borderColor: '#E5E7EB' },
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

function AppContent() {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetch('http://localhost:4000/employees')
      .then((res) => {
        if (!res.ok) throw new Error('Failed to fetch from mock API');
        return res.json();
      })
      .then((data) => {
        setEmployees(data);
        setIsLoading(false);
      })
      .catch((err) => {
        console.warn('Mock API not available, falling back to static JSON data.', err);
        setEmployees(employeesData as any as Employee[]);
        setIsLoading(false);
      });
  }, []);

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
          bgcolor: 'rgba(255,255,255,0.9)',
          backdropFilter: 'blur(14px)',
          borderBottom: '1px solid #E5E7EB',
          boxShadow: '0 1px 2px rgba(0,0,0,0.05)',
        }}
      >
        <Toolbar sx={{ gap: 1.5, minHeight: '62px !important', px: { xs: 2, md: 3 } }}>
          {/* Animated logo SVG */}
          <Box className="ff-logo">
            <svg width="34" height="34" viewBox="0 0 34 34" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
              <defs>
                <linearGradient id="ff-g1" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#2563EB" />
                  <stop offset="100%" stopColor="#1D4ED8" />
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
                color: '#111827',
                lineHeight: 1.1,
              }}
            >
              FilterForge
            </Typography>
            <Typography
              variant="caption"
              sx={{ color: '#6B7280', lineHeight: 1, display: 'block', mt: 0.1 }}
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
              bgcolor: '#EFF6FF',
              border: '1px solid #BFDBFE',
              boxShadow: '0 1px 2px rgba(37,99,235,0.1)',
            }}
          >
            <Box
              sx={{
                width: 7,
                height: 7,
                borderRadius: '50%',
                background: '#2563EB',
                boxShadow: '0 0 4px rgba(37,99,235,0.4)',
              }}
            />
            <Typography
              variant="caption"
              sx={{ fontWeight: 700, color: '#1D4ED8', whiteSpace: 'nowrap', letterSpacing: '0.01em' }}
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
            <CircularProgress sx={{ color: '#2563EB' }} />
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
