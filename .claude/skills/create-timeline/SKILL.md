---
name: create-timeline
description: Create a new timeline event. Use when adding career milestones, achievements, certifications, or significant events to the professional timeline.
disable-model-invocation: false
allowed-tools: Read, Edit
---

# Create Timeline Event

Create a new timeline event entry in `src/data/timeline.json` with proper formatting.

## Process

1. **Gather Information**:
   - Title (required - concise event title)
   - Description (required - detailed event description)
   - Date (required - can be month/year or full date)
   - Tags (optional - categorization)

2. **Format Date**:
   - Timeline supports multiple formats:
     - Full date: "2024-11-15" (ISO format)
     - Month/Year: "Nov 2023", "2023", "November 2023"
   - Ask user if they want full date or just month/year
   - Convert to appropriate format

3. **Suggest Tags**:
   - Common timeline tags: "Career", "Education", "Project", "Achievement", "Certification", "Open Source", "Speaking", "Publication", "Award"
   - Technology tags: "Flutter", "React", "AI", "Mobile", "Web"
   - Suggest 2-4 relevant tags based on content

4. **Generate Slug**:
   - Convert title to URL-friendly slug
   - Same rules as posts and talks

5. **Validate**:
   - Ensure slug is unique
   - Verify date format
   - Check all required fields
   - Validate tags array

6. **Insert Entry**:
   - Add in reverse chronological order (newest first)
   - Maintain JSON formatting
   - Preserve existing data

7. **Confirm**:
   - Show new entry
   - Confirm addition to timeline page
   - Note RSS feed regeneration on next build

## Entry Format

```json
{
  "date": "2024-11-15",
  "title": "Event Title",
  "description": "Detailed description of the timeline event, its significance, and impact.",
  "tags": ["Tag1", "Tag2"],
  "slug": "event-title-slug"
}
```

## Date Format Examples

- ISO Date: "2024-11-15"
- Month/Year: "Nov 2023"
- Year only: "2023"
- Full month: "November 2023"

## Common Timeline Event Types

1. **Career Events**: New job, promotion, role change
2. **Education**: Degree completion, certification earned
3. **Projects**: Major project launch, milestone reached
4. **Achievements**: Award received, recognition gained
5. **Publications**: Book published, article featured
6. **Speaking**: Conference talk, workshop delivered
7. **Open Source**: Major contribution, project created

## Tips

- Keep titles concise (under 60 chars)
- Descriptions can be more detailed (150-400 chars)
- Use tags consistently with existing timeline events
- Chronological order matters - newest events first
- Date format should match event granularity (full date for specific events, month/year for general ones)

## Arguments

If invoked with arguments:
- `$0` = Title (optional)
- `$1` = Date (optional)
- `$2` = Description (optional)

Example: `/create-timeline "Joined New Company" "2026-02-01" "Started as Senior Engineer at Tech Corp"`
