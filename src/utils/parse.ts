/**
 * Utility functions for parsing and formatting text
 */

/**
 * Converts a title to a URL-friendly slug
 * Uses a direct regex extraction approach to get only alphanumeric characters and spaces
 */
export function titleToSlug(title: string): string {
  // Extract only letters, numbers, spaces, and hyphens
  const validChars = title.match(/[a-z0-9\s-]+/gi)?.join('') || '';
  
  // Replace multiple spaces with a single hyphen and trim
  return validChars
    .toLowerCase()
    .replace(/\s+/g, '-')
    .trim();
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