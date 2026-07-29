---
name: deploy-site
description: Deploy the website with full build pipeline (data sync, build, sitemap generation). Use when preparing for production deployment.
disable-model-invocation: true
allowed-tools: Bash(yarn *)
---

# Deploy Website

Execute the complete deployment pipeline: data synchronization, build, and sitemap generation with validation and error handling.

## Full Deployment Pipeline

The complete deployment process follows this order:

```bash
1. yarn data:github    # Fetch GitHub repos
2. yarn data:npm       # Fetch NPM packages
3. yarn data:rss       # Generate RSS feeds
4. yarn build          # Build Next.js static site
5. yarn sitemap        # Generate sitemaps
```

**Current Issue**: The `yarn deploy` script runs `yarn build` twice due to hooks:
- `prebuild` hook runs `data:rss`
- Main build runs
- `postbuild` hook runs `sitemap`
- Then `deploy` runs `build` again

## Optimized Deployment Process

Run the pipeline efficiently without double-building:

```bash
# 1. Sync all external data
yarn data:github && yarn data:npm

# 2. Build (automatically runs data:rss via prebuild and sitemap via postbuild)
yarn build

# Build output is in dist/ directory, ready for deployment
```

## Pre-Deployment Validation

Before deploying, validate:

1. **Data Integrity** (run `/validate-data` first)
   - All JSON files valid
   - No duplicate slugs
   - Dates formatted correctly

2. **Build Success**
   - No TypeScript errors (if strict mode enabled)
   - No broken imports
   - All dynamic routes generated

3. **Output Verification**
   - `dist/` directory created
   - All pages exported
   - Assets copied correctly
   - RSS feeds generated (in `public/rss/`)
   - Sitemaps generated (in `public/`)

4. **File Sizes**
   - Check `dist/` size is reasonable
   - Warn if significantly larger than previous build
   - Check for accidentally committed large files

## Deployment Steps with Error Handling

```bash
# Step 1: Validate data before build
echo "🔍 Validating data files..."
# (Run validation checks)

# Step 2: Sync external data
echo "📦 Syncing project data..."
if ! yarn data:github; then
  echo "❌ GitHub sync failed. Using cached data."
fi

if ! yarn data:npm; then
  echo "❌ NPM sync failed. Using cached data."
fi

# Step 3: Build site
echo "🏗️  Building site..."
if ! yarn build; then
  echo "❌ Build failed! Check errors above."
  exit 1
fi

# Step 4: Verify output
echo "✅ Build complete!"
echo "📊 Output size: $(du -sh dist/)"
echo "📄 Pages: $(find dist -name '*.html' | wc -l)"
echo "📡 RSS feeds: $(find public/rss -name '*.xml' | wc -l)"
echo "🗺️  Sitemaps: $(find public -name 'sitemap*.xml' | wc -l)"

# Step 5: Ready for deployment
echo "🚀 Ready to deploy! Output in dist/"
```

## GitHub Pages Deployment

After building, deploy to GitHub Pages:

```bash
# Commit build output (if using separate gh-pages branch)
git add dist/
git commit -m "Deploy: $(date '+%Y-%m-%d %H:%M:%S')"

# Or use gh-pages package
npx gh-pages -d dist
```

## Post-Deployment Checks

After deploying, verify:

1. **Live Site**
   - Visit https://tiagodanin.com
   - Check homepage loads
   - Test navigation (posts, talks, timeline)
   - Verify RSS feeds accessible

2. **Dynamic Routes**
   - Random post: `/post/[slug]`
   - Random talk: `/talk/[slug]`
   - Random timeline: `/timeline/[slug]`

3. **SEO & Metadata**
   - OpenGraph tags present (check with https://opengraph.dev/)
   - Twitter Card validates
   - RSS feeds valid XML
   - Sitemap accessible at /sitemap.xml

4. **Performance**
   - Lighthouse score > 90
   - First Contentful Paint < 2s
   - No console errors

## Rollback Process

If deployment has issues:

```bash
# Revert to previous commit
git revert HEAD

# Or restore from backup
git checkout HEAD~1 dist/

# Rebuild and redeploy
yarn build
```

## Environment-Specific Deploys

**Development**:
```bash
yarn dev  # Hot reload, no build
```

**Staging** (test build locally):
```bash
yarn build && yarn start
# Visit http://localhost:3000
```

**Production**:
```bash
yarn deploy  # Full pipeline
# Or optimized:
yarn data:github && yarn data:npm && yarn build
```

## Common Issues & Solutions

**Issue**: Build fails with "Module not found"
- Solution: Run `yarn install` to ensure dependencies are current

**Issue**: GitHub API rate limit exceeded
- Solution: Wait 1 hour or use cached data (build will use existing github.json)

**Issue**: Sitemap generation fails
- Solution: Check github.json is valid, manually run `yarn sitemap`

**Issue**: RSS feeds missing entries
- Solution: Run `yarn data:rss` separately to regenerate

**Issue**: Build output size exploded
- Solution: Check for large files in `public/` or accidentally committed binaries

## Automation

Can be triggered:
- Manually: `/deploy-site`
- Git hook: On `git push` to main
- CI/CD: GitHub Actions workflow
- Cron: Weekly data refresh

## CI/CD Integration (Future)

Example GitHub Actions workflow:

```yaml
name: Deploy
on:
  push:
    branches: [main]
  schedule:
    - cron: '0 0 * * 0'  # Weekly

jobs:
  build-deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: 18
      - run: yarn install
      - run: yarn data:github
        env:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
      - run: yarn data:npm
      - run: yarn build
      - uses: peaceiris/actions-gh-pages@v3
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
          publish_dir: ./dist
```

## Usage

**Full deployment**:
```
/deploy-site
```

**Quick rebuild** (skip data sync):
```
yarn build
```

**Dry run** (build without deploying):
```
yarn build && yarn start
# Test at localhost:3000
```
