---
name: sort-data
description: Sort existing JSON data files alphabetically to clean up git diffs. Use when you want to reorganize data without fetching from APIs.
disable-model-invocation: true
allowed-tools: Read, Write
---

# Sort Data Files Alphabetically

Reorganize existing JSON data files in alphabetical order without fetching from external APIs.

## What This Does

Reads existing JSON files and sorts them alphabetically by name, maintaining the same structure but ensuring consistent ordering for cleaner git diffs.

## Supported Files

### 1. GitHub Projects (`src/data/github.json`)
- Sorts by `name` field (case-insensitive)
- Maintains all project data
- ~300 repositories

### 2. NPM Packages (`src/data/npm.json`)
- Sorts by `name` field (case-insensitive)
- Maintains all package data
- ~45 packages

### 3. Posts (`src/data/posts.json`)
- Already sorted chronologically (newest first)
- No alphabetical sorting needed
- Keep chronological order

### 4. Talks (`src/data/talks.json`)
- Already sorted chronologically (newest first)
- No alphabetical sorting needed
- Keep chronological order

### 5. Timeline (`src/data/timeline.json`)
- Already sorted chronologically (newest first)
- No alphabetical sorting needed
- Keep chronological order

## Process

1. **Read Data Files**
   - Load github.json and npm.json
   - Validate JSON structure

2. **Remove Duplicates**
   - Detect duplicate entries by unique ID (GitHub) or name (NPM)
   - Keep only the first occurrence
   - Report number of duplicates removed

3. **Sort Alphabetically**
   - Sort by `name` field (case-insensitive)
   - Use `localeCompare()` for proper string sorting
   - Example: "Add-License-Bot" < "API-Tools" < "awesome-nodejs"

4. **Write Back**
   - Maintain 4-space indentation (consistent with scripts)
   - Preserve all data fields
   - Keep file structure intact

5. **Report Changes**
   - Show how many duplicates were removed
   - Show how many items were reordered
   - Display sample of ordering (first 10 items)

## Example Output

```
🔤 Sorting data files alphabetically...

📦 GitHub Projects (github.json)
  ✓ Removed 2 duplicate repositories
  ✓ Sorted 239 repositories by name
  First 10: Add-License-Bot, Android-Debug-Bridge-MCP, AndroidManifestExported, ...
  ✓ Saved to src/data/github.json

📦 NPM Packages (npm.json)
  ✓ No duplicates found
  ✓ Sorted 66 packages by name
  First 10: @orgmanager/node-orgmanager-api, add-license-bot, another-xss-example, ...
  ✓ Saved to src/data/npm.json

✅ Data sorted successfully!
Next: Run 'git diff' to see the changes
```

## When to Use

**After manual edits**: If you manually edited JSON files
**Before commits**: Clean up ordering before committing
**One-time reorganization**: Sort existing data without API calls
**Quick fix**: Fix ordering without waiting for API fetch

## Usage

```bash
/sort-data
```

Or sort specific file:
```bash
/sort-data github
/sort-data npm
/sort-data all  # default
```

## Arguments

- `$ARGUMENTS` = File to sort: "github", "npm", "all" (default: "all")

## Implementation Details

### Deduplication & Sorting Algorithm

```typescript
// Remove duplicates by ID (GitHub) or name (NPM)
const unique = Array.from(
  new Map(items.map(item => [item.id || item.name, item])).values()
)

// Case-insensitive alphabetical sort
unique.sort((a, b) =>
  a.name.toLowerCase().localeCompare(b.name.toLowerCase())
)
```

### Why Case-Insensitive?

- "Add-License-Bot" vs "awesome-nodejs"
- Without case-insensitive: all uppercase come first
- With case-insensitive: true alphabetical order
- More human-readable sorting

## Benefits

1. **Cleaner Git Diffs**
   - Consistent ordering = smaller diffs
   - Easy to spot actual changes
   - No random reordering between fetches

2. **Faster Than API Fetch**
   - No network calls
   - Instant reorganization
   - Works offline

3. **Safe Operation**
   - Doesn't modify data content
   - Only changes order
   - Validates JSON structure

## Integration with Sync

The sync scripts (`getProjectsGithub.ts` and `getProjectsNPM.ts`) now automatically sort data alphabetically, so future syncs will maintain this order.

## Validation After Sort

After sorting, you can:
```bash
/validate-data  # Verify data integrity
git diff        # Check what changed
yarn build      # Test build still works
```

## Tips

- Run this once to reorganize existing data
- Future syncs will maintain alphabetical order automatically
- Check git diff to verify only ordering changed
- Content (posts, talks, timeline) should stay chronologically sorted
