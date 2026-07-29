---
name: validate-data
description: Validate all JSON data files for consistency, format errors, and data integrity. Use before builds or after making manual changes to data files.
allowed-tools: Read, Bash(node *)
---

# Validate Data Files

Perform comprehensive validation of all JSON data files in `src/data/` to catch errors before they cause build failures.

## Validation Checks

### 1. JSON Syntax Validation
- Parse all JSON files in `src/data/`
- Report any syntax errors with line numbers
- Check for trailing commas, missing quotes, etc.

### 2. Posts Validation (`posts.json`)
Check each entry for:
- ✓ Required fields: `date`, `title`, `description`, `slug`, `originalUrl`
- ✓ Date format: "MMM DD, YYYY" (e.g., "Jan 26, 2026")
- ✓ Valid month abbreviations: Jan, Feb, Mar, Apr, May, Jun, Jul, Aug, Sep, Oct, Nov, Dec
- ✓ Slug uniqueness (no duplicates)
- ✓ Slug format: lowercase, hyphens only, no special chars
- ✓ URL format: starts with http:// or https://
- ✓ Description length: warn if <50 or >500 characters
- ✓ Chronological order: newest first

### 3. Talks Validation (`talks.json`)
Check each entry for:
- ✓ Required fields: `id`, `date`, `title`, `description`, `event`, `slug`, `tags`
- ✓ ID uniqueness and sequential order
- ✓ Date format consistency
- ✓ Slug uniqueness
- ✓ Tags array format (must be array of strings)
- ✓ Optional: `youtubeUrl` format if present
- ✓ Chronological order: newest first

### 4. Timeline Validation (`timeline.json`)
Check each entry for:
- ✓ Required fields: `date`, `title`, `description`, `slug`
- ✓ Date format: ISO (2024-11-15) or "MMM YYYY" or "YYYY"
- ✓ Slug uniqueness
- ✓ Tags array format (if present)
- ✓ Chronological order

### 5. Projects Validation
Check large auto-generated files:
- ✓ `github.json`: Valid GitHub repo structure
- ✓ `npm.json`: Valid NPM package structure
- ✓ Other project sources (google-play.json, etc.)
- ✓ Required fields per project type
- ✓ URL formats

### 6. Cross-File Validation
- ✓ No duplicate slugs across posts, talks, timeline
- ✓ Consistent date formats across files
- ✓ Consistent tag naming (case-sensitive check)
- ✓ All referenced external URLs are properly formatted

### 7. Data Integrity Checks
- ✓ File size warnings (if files grow unexpectedly)
- ✓ Entry count (warn if sudden changes)
- ✓ Character encoding (UTF-8)
- ✓ Line endings (LF vs CRLF)

## Output Format

Provide a validation report:

```
✅ Data Validation Report
━━━━━━━━━━━━━━━━━━━━━━━━

📄 posts.json
  ✓ 45 entries validated
  ✓ All dates formatted correctly
  ✓ All slugs unique
  ⚠️ Warning: 2 descriptions under 100 characters
  ⚠️ Warning: 1 description over 400 characters

📄 talks.json
  ✓ 28 entries validated
  ✓ IDs sequential (1-28)
  ✓ All required fields present
  ✗ Error: Duplicate slug "my-talk" found in entries 12 and 15

📄 timeline.json
  ✓ 67 entries validated
  ✓ Chronological order correct

📄 github.json
  ✓ 300 repos validated
  ✓ File size: 1.6 MB (normal)

━━━━━━━━━━━━━━━━━━━━━━━━
Summary: 3 warnings, 1 error
```

## Automated Fixes (Optional)

After reporting issues, offer to:
- Fix date formats automatically
- Sort entries chronologically
- Generate missing slugs
- Remove duplicate entries (with confirmation)
- Normalize tag capitalization

## Usage

Can be run:
- Before builds: `/validate-data`
- After manual JSON edits
- Before commits
- As part of CI/CD pipeline

## Tips

- Run this after bulk updates to data files
- Use before `yarn build` to catch issues early
- Can be integrated into git pre-commit hook
- Validation should be non-destructive (only report, don't auto-fix without confirmation)
