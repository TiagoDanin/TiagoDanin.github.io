/**
 * Utility functions for parsing and formatting text
 */

/**
 * Converts a title to a URL-friendly slug
 * Uses a direct regex extraction approach to get only alphanumeric characters and spaces
 */
export function titleToSlug(title: string): string {
  const validChars = title.match(/[a-z0-9\s-]+/gi)?.join('') || '';
  
  return validChars
    .toLowerCase()
    .replace(/\s+/g, '-')
    .trim()
    .replace(/^-+|-+$/g, '');
}

/**
 * Generates a consistent color based on the input string
 * Used for tag colors with dark mode support
 */
export function getRandomColorWithDarkMode(tag: string): string {
  const colors = [
    'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100',
    'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100',
    'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100',
    'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100',
    'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-100',
    'bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-100',
    'bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-100',
  ];

  const hash = tag.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  return colors[hash % colors.length];
}

/**
 * Generates a random color for tags
 * Simpler version without dark mode support
 */
export function getRandomColor(): string {
  const colors = [
    'bg-red-100 text-red-800',
    'bg-blue-100 text-blue-800',
    'bg-green-100 text-green-800',
    'bg-yellow-100 text-yellow-800',
    'bg-purple-100 text-purple-800',
    'bg-pink-100 text-pink-800',
    'bg-indigo-100 text-indigo-800',
  ];

  return colors[Math.floor(Math.random() * colors.length)];
}

/**
 * Converts a date string to ISO 8601 format (YYYY-MM-DD, YYYY-MM, or YYYY)
 * Accepts formats like 'May 13, 2025', 'Nov 2023', '2023', '2023-05-13', '13/05/2023'
 */
export function toISODate(dateString: string): string | undefined {
  if (!dateString) return undefined;

  // English month abbreviations
  const monthMap: Record<string, string> = {
    jan: '01', feb: '02', mar: '03', apr: '04', may: '05', jun: '06',
    jul: '07', aug: '08', sep: '09', oct: '10', nov: '11', dec: '12',
  };
  const trimmedDate = dateString.trim();

  // Match 'May 13, 2025'
  const fullDateMatch = trimmedDate.match(/^([A-Za-z]+)\s+(\d{1,2}),\s*(\d{4})$/);
  if (fullDateMatch) {
    const monthAbbr = fullDateMatch[1].toLowerCase().slice(0, 3);
    const month = monthMap[monthAbbr] || '01';
    const day = fullDateMatch[2].padStart(2, '0');
    const year = fullDateMatch[3];
    return `${year}-${month}-${day}`;
  }

  // Match 'Nov 2023'
  const monthYearMatch = trimmedDate.match(/^([A-Za-z]+)\s+(\d{4})$/);
  if (monthYearMatch) {
    const monthAbbr = monthYearMatch[1].toLowerCase().slice(0, 3);
    const month = monthMap[monthAbbr] || '01';
    const year = monthYearMatch[2];
    return `${year}-${month}`;
  }

  // Match '2023-05-13'
  const isoFullDateMatch = trimmedDate.match(/^(\d{4})-(\d{2})-(\d{2})$/);
  if (isoFullDateMatch) {
    return trimmedDate;
  }

  // Match '2023-05'
  const isoMonthMatch = trimmedDate.match(/^(\d{4})-(\d{2})$/);
  if (isoMonthMatch) {
    return trimmedDate;
  }

  // Match '2023'
  const yearMatch = trimmedDate.match(/^(\d{4})$/);
  if (yearMatch) {
    return trimmedDate;
  }

  // Match '13/05/2023'
  const dayMonthYearMatch = trimmedDate.match(/^(\d{2})\/(\d{2})\/(\d{4})$/);
  if (dayMonthYearMatch) {
    const day = dayMonthYearMatch[1];
    const month = dayMonthYearMatch[2];
    const year = dayMonthYearMatch[3];
    return `${year}-${month}-${day}`;
  }

  // Fallback: try Date.parse
  const parsedDate = new Date(trimmedDate);
  if (!isNaN(parsedDate.getTime())) {
    return parsedDate.toISOString().slice(0, 10);
  }

  // If nothing matches
  return (new Date()).toISOString();
} 