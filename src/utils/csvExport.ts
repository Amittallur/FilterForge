import { getNestedValue } from './getNestedValue';

/**
 * Converts a dataset to a CSV string and triggers a browser download.
 *
 * @param data - Array of objects to export
 * @param filename - The filename for the downloaded file (without extension)
 */
export function exportToCsv<T extends object>(
  data: T[],
  filename = 'export',
): void {
  if (data.length === 0) return;

  // Flatten nested objects to dot-notation keys
  const flattenObject = (
    obj: Record<string, unknown>,
    prefix = '',
  ): Record<string, string> => {
    return Object.keys(obj).reduce<Record<string, string>>((acc, key) => {
      const fullKey = prefix ? `${prefix}.${key}` : key;
      const val = obj[key];
      if (val !== null && typeof val === 'object' && !Array.isArray(val)) {
        Object.assign(acc, flattenObject(val as Record<string, unknown>, fullKey));
      } else if (Array.isArray(val)) {
        acc[fullKey] = val.join('; ');
      } else {
        acc[fullKey] = val === null || val === undefined ? '' : String(val);
      }
      return acc;
    }, {});
  };

  const flatData = data.map((row) => flattenObject(row as Record<string, unknown>));
  const headers = Object.keys(flatData[0]);

  const escape = (value: string) => {
    if (value.includes(',') || value.includes('"') || value.includes('\n')) {
      return `"${value.replace(/"/g, '""')}"`;
    }
    return value;
  };

  const csvRows = [
    headers.map(escape).join(','),
    ...flatData.map((row) => headers.map((h) => escape(row[h] ?? '')).join(',')),
  ];

  const blob = new Blob([csvRows.join('\n')], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', `${filename}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

// Re-export getNestedValue so consumers can use it directly from utils
export { getNestedValue };
