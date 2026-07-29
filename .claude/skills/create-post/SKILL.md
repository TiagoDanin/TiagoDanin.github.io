---
name: create-post
description: Create a new blog post entry interactively. Use when adding a new blog post, article, or LinkedIn post to the website.
disable-model-invocation: false
allowed-tools: Read, Edit, Bash(date)
---

# Create Blog Post

Create a new blog post entry in `src/data/posts.json` with proper formatting and validation.

## Process

1. **Gather Information** (if not provided by user):
   - Title (required)
   - Description (required - can be extracted from the article if URL is provided)
   - Original URL (required - LinkedIn, Medium, Dev.to, YouTube, etc.)
   - Publication date (optional - defaults to today)

2. **Generate Slug**:
   - Convert title to lowercase
   - Replace spaces with hyphens
   - Remove special characters except hyphens
   - Remove accents: á→a, é→e, í→i, ó→o, ú→u, ã→a, õ→o, ç→c
   - Example: "Criando um Agente no ChatGPT" → "criando-um-agente-no-chatgpt"

3. **Format Date**:
   - Convert to format: "MMM DD, YYYY" (e.g., "Jan 26, 2026")
   - Month abbreviations: Jan, Feb, Mar, Apr, May, Jun, Jul, Aug, Sep, Oct, Nov, Dec
   - If only "June 14, 2025" provided, convert to "Jun 14, 2025"

4. **Read Current Posts**:
   - Read `src/data/posts.json`
   - Identify correct position (chronological order, newest first)

5. **Validate**:
   - Ensure slug is unique (no duplicates)
   - Ensure all required fields are present
   - Verify date format is correct
   - Check description length (recommended 100-300 chars for SEO)

6. **Insert Entry**:
   - Add new post at the correct chronological position
   - Maintain JSON formatting (2-space indentation)
   - Preserve existing data integrity

7. **Confirm**:
   - Show the new entry to the user
   - Provide the file path and line number
   - Mention that RSS feeds will be regenerated on next build

## Entry Format

```json
{
  "date": "MMM DD, YYYY",
  "title": "Post Title",
  "description": "Brief description of the post content. Should be engaging and informative.",
  "slug": "post-title-slug",
  "originalUrl": "https://full-url-to-original-post"
}
```

## Tips

- If user provides a URL, try to fetch the page to extract title/description automatically
- For LinkedIn posts, the URL format is usually: `https://www.linkedin.com/pulse/slug-author-id/`
- For YouTube videos, extract title and use video description
- Keep descriptions between 100-300 characters for optimal SEO
- Always maintain chronological order (newest first)
- Preserve exact formatting of existing entries

## Arguments

If invoked with arguments, treat them as:
- `$0` = Title (optional)
- `$1` = URL (optional)
- `$2` = Date (optional)

Example: `/create-post "My New Post" "https://linkedin.com/..." "Feb 2, 2026"`
