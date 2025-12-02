<objective>
Thoroughly analyze the roster management implementation from the old Seios-Aner project to understand its complete functionality, data structures, and features. This analysis will serve as the foundation for recreating the roster with full feature parity in the new GuildManager application.

The end goal is to document everything needed to recreate the roster with modern components while preserving all original functionality.
</objective>

<context>
The old Seios-Aner project contains a roster/table implementation located at:
`C:\Users\danlj\Code\seios-aner\src\components\table`

This is a World of Warcraft guild management system, and the roster likely displays:
- Character information (names, classes, specs, levels, gear scores)
- Raid attendance tracking and percentages
- Guild ranks/roles (Officer, Raider, Social, etc.)
- Professions and gear details

The new implementation will use:
- Next.js 15 with App Router
- shadcn/ui components (Radix UI primitives)
- TypeScript
- Tailwind CSS
- Existing WoW-specific components from `components/wow/`
</context>

<research>
Thoroughly explore the old roster implementation by examining all files in:
`C:\Users\danlj\Code\seios-aner\src\components\table`

For maximum efficiency, whenever you need to read multiple files, invoke all Read tools simultaneously rather than sequentially.

Investigate:
1. **Component structure**: What components make up the roster? How are they organized?
2. **Data model**: What data structures are used? What fields does each roster entry contain?
3. **Features and functionality**:
   - Filtering capabilities (by class, role, rank, etc.)
   - Sorting options (by which fields?)
   - Search functionality (what can users search for?)
   - Detailed character views (modals, expanded rows, separate pages?)
   - Admin editing features (add/edit/remove entries)
   - Any other interactive features
4. **UI/UX patterns**: Layout, visual hierarchy, responsive behavior
5. **State management**: How is data fetched, stored, and updated?
6. **Dependencies**: Any special libraries or utilities used

Also check related directories if referenced:
- Data fetching logic
- Type definitions
- Utility functions
- Mock/sample data

Consider multiple approaches to understanding the codebase - start with main entry points, then explore imported dependencies.
</research>

<output_format>
Create a comprehensive analysis document saved to: `./analysis/seios-aner-roster-analysis.md`

Structure the analysis as follows:

```markdown
# Seios-Aner Roster Analysis

## Executive Summary
[Brief overview of what the roster does and key findings]

## Component Architecture
[Component hierarchy, file structure, responsibilities]

## Data Model
```typescript
// Document all TypeScript interfaces/types found
```

## Features Inventory

### Filtering
- [List all filtering options with implementation details]

### Sorting
- [List all sorting capabilities]

### Search
- [Search functionality details]

### Character Detail Views
- [How detailed views work, what they display]

### Admin Features
- [Admin editing capabilities]

### Other Features
- [Any additional functionality]

## UI/UX Patterns
[Layout approach, responsive design, visual patterns]

## State Management
[How data flows, what triggers updates]

## Dependencies & Utilities
[External libraries, helper functions, custom hooks]

## Data Requirements
[What data fields are needed, sample data structure]

## Implementation Notes
[Important patterns, gotchas, things to preserve]

## Migration Considerations
[Specific challenges or considerations for recreating with shadcn/ui]
```
</output_format>

<verification>
Before completing, verify your analysis includes:
- Complete data model with all fields documented
- Every feature from the original roster catalogued
- Clear understanding of filtering, sorting, and search logic
- Admin functionality fully documented
- UI patterns and layout approach described
- Any dependencies or utilities identified
- Sample data structure extracted or documented
- Notes on what makes this implementation unique

If you find references to external files or utilities, follow those references to understand the complete picture.
</verification>

<success_criteria>
- Comprehensive analysis document created at `./analysis/seios-aner-roster-analysis.md`
- All roster features identified and documented
- Complete data model extracted
- Clear understanding of how filtering, sorting, and search work
- Admin capabilities fully understood
- Sufficient detail to recreate with 100% feature parity
- Implementation notes highlight important patterns to preserve
</success_criteria>
