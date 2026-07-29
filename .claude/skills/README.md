# Custom Claude Code Skills for TiagoDanin.com

This directory contains custom skills that extend Claude Code's capabilities specifically for this Next.js website project.

## Available Skills

### 📝 Content Creation Skills

#### `/create-post` - Create New Blog Post
Creates a new blog post entry in `src/data/posts.json` with automatic slug generation and validation.

**When to use**: Adding a new blog post, article, LinkedIn post, or YouTube video to the website.

**Features**:
- Interactive prompts for title, description, URL, date
- Automatic slug generation (handles Portuguese accents)
- Date format standardization ("MMM DD, YYYY")
- Chronological insertion (newest first)
- Uniqueness validation

**Usage**:
```bash
# Interactive mode
/create-post

# With arguments
/create-post "Post Title" "https://linkedin.com/..." "Feb 2, 2026"
```

---

#### `/create-talk` - Create New Talk Entry
Creates a new talk/presentation entry in `src/data/talks.json` with event details and optional video.

**When to use**: Adding a speaking engagement, conference talk, meetup presentation, or workshop.

**Features**:
- Auto-increments ID sequentially
- Suggests relevant tags based on content
- Handles optional YouTube URL
- Event name tracking
- Chronological ordering

**Usage**:
```bash
# Interactive mode
/create-talk

# With arguments
/create-talk "My Talk" "DevFest 2026" "Mar 15, 2026" "https://youtube.com/..."
```

---

#### `/create-timeline` - Create Timeline Event
Creates a professional timeline event entry in `src/data/timeline.json`.

**When to use**: Adding career milestones, achievements, certifications, project launches, awards.

**Features**:
- Flexible date formats (full date, month/year, year only)
- Tag suggestions (Career, Education, Project, Achievement, etc.)
- Categorization support
- Chronological ordering

**Usage**:
```bash
# Interactive mode
/create-timeline

# With arguments
/create-timeline "Joined New Company" "2026-02-01" "Started as Senior Engineer"
```

---

### 🔍 Data Management Skills

#### `/validate-data` - Validate All JSON Data
Performs comprehensive validation of all data files in `src/data/` to catch errors before builds.

**When to use**: Before builds, after manual JSON edits, before commits, as part of CI/CD.

**Validates**:
- ✓ JSON syntax (parsing errors, trailing commas)
- ✓ Required fields presence
- ✓ Date format consistency
- ✓ Slug uniqueness across all content types
- ✓ URL format validation
- ✓ Chronological ordering
- ✓ Description length warnings (SEO optimization)
- ✓ Tag format validation
- ✓ Cross-file duplicate detection

**Usage**:
```bash
/validate-data
```

**Output**: Detailed validation report with errors, warnings, and suggestions.

---

#### `/sync-projects` - Sync Project Data
Fetches and synchronizes project data from GitHub, NPM, and other sources with error handling.

**When to use**: Weekly updates, after publishing new packages, before important builds.

**Features**:
- Fetches GitHub repos (300 repos from API)
- Fetches NPM packages with download stats
- Generates RSS feeds for all content
- Error recovery (preserves existing data on failure)
- Progress reporting

**Usage**:
```bash
/sync-projects
```

**Pipeline**:
1. `yarn data:github` - Fetch GitHub repos
2. `yarn data:npm` - Fetch NPM packages
3. `yarn data:rss` - Generate RSS feeds

---

#### `/sort-data` - Sort Data Alphabetically
Reorganizes GitHub and NPM data files in alphabetical order for cleaner git diffs.

**When to use**: After manual edits, before commits, to clean up existing data without API calls.

**Features**:
- Sorts github.json and npm.json by name (case-insensitive)
- Removes duplicate entries automatically
- Maintains all data fields
- Offline operation (no API calls)
- Cleaner git diffs between updates

**Usage**:
```bash
/sort-data
```

**What gets sorted**:
- `src/data/github.json` - 239 repositories (alphabetically by name)
- `src/data/npm.json` - 66 packages (alphabetically by name)
- Content files (posts, talks, timeline) remain chronologically sorted

---

### 🚀 Deployment Skills

#### `/deploy-site` - Deploy Website
Executes the complete deployment pipeline with validation and error handling.

**When to use**: Preparing for production deployment, weekly updates, major content releases.

**Features**:
- Full build pipeline orchestration
- Pre-deployment validation
- Error handling and rollback support
- Build output verification
- Post-deployment checks

**Pipeline**:
1. Data validation
2. Sync external data (GitHub, NPM)
3. Build Next.js static site
4. Generate sitemaps
5. Verify output integrity

**Usage**:
```bash
/deploy-site
```

---

### 🎨 Development Skills

#### `generate-metadata` (Background Skill)
Generates SEO metadata (OpenGraph, Twitter Card, JSON-LD schema) for pages.

**When to use**: Automatically loaded by Claude when creating new pages or updating metadata.

**Generates**:
- OpenGraph tags for social sharing
- Twitter Card metadata
- JSON-LD structured data (BlogPosting, PresentationDigitalDocument, Event)
- Canonical URLs
- Keywords and author info

**Features**:
- Automatic description truncation (160 chars for SEO)
- Schema.org validation ready
- Consistent branding (Tiago Danin, @TiagoDanin)
- Multi-language support (pt_BR)

**Note**: This skill is `user-invocable: false` - Claude loads it automatically when relevant.

---

## Skill Workflow Examples

### Adding a New Blog Post (End-to-End)

```bash
# 1. Create the post entry
/create-post
> Title: "My New Post About Flutter"
> URL: "https://medium.com/..."
> Date: "Feb 2, 2026"
> Description: "In this post, I explore..."

# 2. Validate the data
/validate-data
# Ensure no errors

# 3. Rebuild site with new content
yarn build

# 4. Deploy
/deploy-site
```

---

### Weekly Content Update

```bash
# 1. Sync latest project data
/sync-projects

# 2. Validate everything
/validate-data

# 3. Deploy updates
/deploy-site
```

---

### Adding a Conference Talk

```bash
# 1. Create talk entry
/create-talk
> Title: "Building AI Agents with Claude"
> Event: "DevFest Brazil 2026"
> Date: "Mar 20, 2026"
> YouTube: "https://youtube.com/..."
> Tags: AI, Claude, Mobile, Flutter

# 2. Validate
/validate-data

# 3. Build and check locally
yarn build && yarn start
# Visit localhost:3000/talk/building-ai-agents-with-claude

# 4. Deploy
/deploy-site
```

---

## Skill Architecture

All skills follow the [Agent Skills](https://agentskills.io) open standard and are compatible with Claude Code's extended features.

### Directory Structure

```
.claude/skills/
├── create-post/
│   └── SKILL.md
├── create-talk/
│   └── SKILL.md
├── create-timeline/
│   └── SKILL.md
├── validate-data/
│   └── SKILL.md
├── sync-projects/
│   └── SKILL.md
├── sort-data/
│   └── SKILL.md
├── deploy-site/
│   └── SKILL.md
├── generate-metadata/
│   └── SKILL.md
└── README.md (this file)
```

### Skill Properties

| Skill              | Invoked by User | Invoked by Claude | Context        |
|--------------------|-----------------|-------------------|----------------|
| create-post        | ✓               | ✓                 | Inline         |
| create-talk        | ✓               | ✓                 | Inline         |
| create-timeline    | ✓               | ✓                 | Inline         |
| validate-data      | ✓               | ✓                 | Inline         |
| sync-projects      | ✓               | ✗                 | Inline         |
| sort-data          | ✓               | ✗                 | Inline         |
| deploy-site        | ✓               | ✗                 | Inline         |
| generate-metadata  | ✗               | ✓                 | Background     |

**Inline**: Runs in the current conversation context
**Background**: Loaded automatically when relevant (not directly invocable by user)

---

## Integration with Build Process

### Current Build Pipeline

```bash
package.json scripts:
├── dev          → next dev (development server)
├── build        → next build (static export)
│   ├── prebuild → data:rss
│   └── postbuild → sitemap
├── start        → next start (production server)
├── lint         → next lint
├── data:github  → Fetch GitHub repos
├── data:npm     → Fetch NPM packages
├── data:rss     → Generate RSS feeds
├── sitemap      → Generate sitemaps
└── deploy       → Full pipeline (data + build + sitemap + build)
```

### Skills Integration Points

1. **Content Creation** → Modifies `src/data/*.json`
2. **Validation** → Reads all `src/data/*.json`
3. **Sync** → Runs `yarn data:*` scripts
4. **Deploy** → Orchestrates full `yarn deploy` pipeline

---

## Best Practices

### When to Run Skills

**Before Commits**:
```bash
/validate-data  # Catch errors early
```

**After Manual Edits**:
```bash
/validate-data  # Verify data integrity
```

**Weekly Maintenance**:
```bash
/sync-projects  # Refresh external data
/validate-data  # Check everything
/deploy-site    # Deploy updates
```

**New Content**:
```bash
/create-post    # or /create-talk or /create-timeline
/validate-data  # Verify
yarn dev        # Preview locally
/deploy-site    # Deploy
```

### Data Safety

All skills are designed to:
- ✓ Preserve existing data on errors
- ✓ Validate before modifying files
- ✓ Maintain JSON formatting (2-space indentation)
- ✓ Keep chronological ordering
- ✓ Prevent duplicate slugs
- ✓ Never corrupt data files

---

## Troubleshooting

### Skill Not Triggering

If Claude doesn't use a skill when expected:

1. Check the skill description matches your request keywords
2. Verify skill is in `.claude/skills/[skill-name]/SKILL.md`
3. Try invoking directly with `/skill-name`
4. Check for typos in skill name

### Validation Errors

If `/validate-data` reports errors:

1. Fix reported issues manually in JSON files
2. Re-run validation to confirm fixes
3. Common issues:
   - Duplicate slugs → rename one
   - Invalid date format → use "MMM DD, YYYY"
   - Missing required fields → add them
   - Wrong chronological order → reorder entries

### Build Failures

If `/deploy-site` fails:

1. Check console output for specific error
2. Run individual steps to isolate issue:
   - `yarn data:github`
   - `yarn data:npm`
   - `yarn build`
3. Validate data first: `/validate-data`
4. Check GitHub API rate limits (5000/hour)
5. Verify all dependencies installed: `yarn install`

### Sync Issues

If `/sync-projects` fails:

1. GitHub API: Check rate limits, authentication
2. NPM API: Usually more stable, check network
3. Existing data preserved on failure (not overwritten)
4. Can skip sync and use cached data: `yarn build`

---

## Future Enhancements

Potential skills to add:

1. **bulk-edit-content** - Find/replace across JSON files
2. **content-analytics** - Generate stats dashboard
3. **seo-audit** - Comprehensive SEO analysis
4. **link-checker** - Verify all external URLs
5. **image-optimizer** - Optimize images in `public/`
6. **schema-validator** - JSON Schema validation with auto-fix
7. **tag-manager** - Normalize and manage tags across content
8. **backup-restore** - Backup/restore data files

---

## Contributing

When creating new skills:

1. Create directory: `.claude/skills/[skill-name]/`
2. Add `SKILL.md` with frontmatter and instructions
3. Follow existing skill patterns
4. Document in this README
5. Test thoroughly before committing

### Skill Template

```yaml
---
name: skill-name
description: What this skill does and when to use it. Claude uses this to decide when to invoke.
disable-model-invocation: false  # true = user-only, false = Claude can invoke
allowed-tools: Read, Edit, Bash(*)
---

# Skill Title

Brief description.

## Process

1. Step 1
2. Step 2
3. Step 3

## Usage

Examples and tips.
```

---

## Resources

- **Claude Code Docs**: https://code.claude.com/docs/en/skills
- **Agent Skills Standard**: https://agentskills.io
- **Next.js Docs**: https://nextjs.org/docs
- **Project Docs**: See `CLAUDE.md` for project-specific guidelines

---

## Questions?

For issues or suggestions:
1. Check this README first
2. Review individual skill documentation in `SKILL.md` files
3. Consult `CLAUDE.md` for project architecture
4. Ask Claude Code directly - it has full context of all skills

---

**Last Updated**: 2026-02-02
**Skills Version**: 1.0.0
**Compatible with**: Claude Code (claude.ai/code)
