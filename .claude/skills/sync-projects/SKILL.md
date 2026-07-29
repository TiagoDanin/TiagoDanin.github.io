---
name: sync-projects
description: Synchronize project data from GitHub, NPM, and other sources. Use to refresh project listings with latest stats, new repos, or updated package info.
disable-model-invocation: true
allowed-tools: Bash(yarn *, node *)
---

# Sync Projects Data

Fetch and synchronize project data from multiple sources (GitHub, NPM, etc.) with intelligent error handling and incremental updates.

## What This Does

1. **Fetch GitHub Projects** (`yarn data:github`)
   - Retrieves repositories from GitHub API
   - Current: fetches 300 repos (3 pages × 100 repos)
   - Includes: stars, forks, language, description
   - Output: `src/data/github.json`

2. **Fetch NPM Packages** (`yarn data:npm`)
   - Retrieves published NPM packages
   - Includes: download stats, version info
   - Output: `src/data/npm.json`

3. **Generate RSS Feeds** (`yarn data:rss`)
   - Creates 4 RSS feeds from all data sources
   - Includes projects, posts, talks, timeline

## Enhanced Sync Process

Run the full data sync pipeline with better error handling:

```bash
# Full sync (what you're running)
yarn data:github && yarn data:npm && yarn data:rss
```

**Error Handling:**
- If GitHub API fails, retry once after 5 seconds
- If NPM API fails, keep existing data and warn user
- If RSS generation fails, report specific feed error
- Never corrupt existing data files

**Progress Reporting:**
- Show which step is running
- Report how many repos/packages fetched
- Show file sizes before/after
- Warn if data significantly changed (possible API issue)

## Validation After Sync

After fetching data, automatically:
1. Validate JSON syntax
2. Check for expected data structure
3. Compare entry counts with previous run
4. Warn if data seems incomplete

## Incremental Sync (Future Enhancement)

For faster updates, could implement:
- Only fetch repos updated since last sync
- Cache NPM package data for 24 hours
- Delta updates instead of full refresh

## Usage Scenarios

**Regular Sync** (recommended weekly):
```
/sync-projects
```

**After Publishing New Package:**
```
/sync-projects
```

**Before Important Builds:**
```
/sync-projects
```

## Output

Shows progress and summary:

```
🔄 Syncing project data...

📦 Fetching GitHub repositories...
  ✓ Fetched 300 repositories
  ✓ Saved to src/data/github.json (1.6 MB)

📦 Fetching NPM packages...
  ✓ Fetched 45 packages
  ✓ Saved to src/data/npm.json (77 KB)

📡 Generating RSS feeds...
  ✓ blog.xml (45 posts)
  ✓ talks.xml (28 talks)
  ✓ timeline.xml (67 events)
  ✓ projects.xml (300+ projects)

✅ Sync complete!
Next: Run 'yarn build' to rebuild site with fresh data
```

## Error Recovery

If sync fails:
1. Existing data files are preserved (not overwritten)
2. Error details are logged
3. Partial updates are discarded
4. User can retry or investigate

## Tips

- Run this before major deployments
- GitHub API has rate limits (5000 req/hour authenticated)
- NPM API is generally more stable
- Consider running weekly via cron job
- RSS feeds are fast to regenerate

## Integration

After sync, typically run:
```bash
yarn build  # Rebuild site with fresh data
```

Or full deployment:
```bash
yarn deploy  # Runs sync + build + sitemap
```
