---
name: create-talk
description: Create a new talk entry interactively. Use when adding a speaking engagement, presentation, or recorded talk to the website.
disable-model-invocation: false
allowed-tools: Read, Write, Glob
---

# Create Talk Entry

Create a new talk as a pair of MDX files in `contents/talks/` with i18n support (PT original + EN translation).

## Process

1. **Gather Information** (if not provided):
   - Title in Portuguese (required)
   - Title in English (required)
   - Description in Portuguese (required)
   - Description in English (required)
   - Event name (required - e.g., "DevOpsDays Belém 2025") - NOT translated
   - Date in YYYY-MM format (required)
   - YouTube URL (optional)
   - Tags (optional - suggest based on content)

2. **Generate Slug**:
   - Based on the Portuguese title
   - Convert to lowercase URL-friendly format
   - Remove accents and special characters
   - Verify uniqueness against existing MDX files in `contents/talks/`

3. **Suggest Tags**:
   - Based on title and description, suggest relevant tags
   - Available tags: "devops", "mobile", "firebase", "flutter", "code", "documentation", "react-native", "performance", "testing", "fastlane", "ios", "web", "ia", "javascript", "git", "wordpress", "linkedin", "career", "feature-flags", "mcp"
   - User can accept or modify

4. **Create MDX Files**:
   - Create `contents/talks/{slug}.pt.mdx` (Portuguese original)
   - Create `contents/talks/{slug}.mdx` (English translation)
   - Both files share: slug, event, date, youtubeUrl, tags
   - Language-specific: title, description, body content

5. **Confirm**:
   - Show both created files
   - Note that talk will appear on /talks and /talks/pt pages on next build

## MDX File Format

### Portuguese (`{slug}.pt.mdx`):
```mdx
---
title: "Titulo em Portugues"
date: "YYYY-MM"
description: "Descricao curta em portugues."
slug: "slug-baseado-no-titulo-pt"
event: "Nome do Evento (nao traduzir)"
lang: "pt"
youtubeUrl: ""
tags: ["tag1", "tag2"]
---

Conteudo completo da palestra em portugues.

## Video

<iframe width="560" height="315" src="https://www.youtube.com/embed/VIDEO_ID" title="Titulo" frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen></iframe>
```

### English (`{slug}.mdx`):
```mdx
---
title: "Title in English"
date: "YYYY-MM"
description: "Short description in English."
slug: "slug-baseado-no-titulo-pt"
event: "Nome do Evento (same as PT, not translated)"
lang: "en"
youtubeUrl: ""
tags: ["tag1", "tag2"]
---

Full talk content in English.

## Video

<iframe width="560" height="315" src="https://www.youtube.com/embed/VIDEO_ID" title="Title" frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen></iframe>
```

## Tips

- YouTube URL is optional - only add if recording exists
- YouTube embed section only added if youtubeUrl is provided
- Event name is NEVER translated - keep the original Portuguese name
- Slug is ALWAYS based on the Portuguese title
- Description should be concise (~160 chars) - full content goes in the body
- Tags must match the options defined in studio.config.ts

## Arguments

If invoked with arguments:
- `$0` = Title PT (optional)
- `$1` = Event name (optional)
- `$2` = Date YYYY-MM (optional)
- `$3` = YouTube URL (optional)

Example: `/create-talk "Minha Palestra" "DevFest 2026" "2026-03" "https://youtube.com/..."`
