<objective>
Implement a modern, interactive roster management system for the GuildManager application with full feature parity to the old Seios-Aner roster. This implementation should use shadcn/ui components and follow modern React/Next.js patterns while preserving all original functionality.

The end goal is a production-ready roster that guild members can use to view character information, track attendance, and filter/search roster data, with admin capabilities for managing entries.
</objective>

<context>
This builds on the analysis from prompt 001-analyze-seios-aner-roster.md.

Read the analysis document first:
`./analysis/seios-aner-roster-analysis.md`

Tech stack:
- Next.js 15 with App Router (React 19, TypeScript)
- shadcn/ui components (located in `components/ui/`)
- Existing WoW components (located in `components/wow/`): ClassIcon, RoleIcon, SpecIcon, ProfessionIcon, AttendanceBadge
- Tailwind CSS with CSS custom properties (defined in `app/globals.css`)
- Zustand for state management
- Firebase Firestore for data persistence

Refer to CLAUDE.md for:
- Design system conventions
- WoW-specific component usage
- CSS variable naming
- Project structure guidelines
</context>

<requirements>
Implement full feature parity with the old roster, including:

1. **Display all roster data**:
   - Character info (name, class, spec, level, gear score)
   - Raid attendance (status, percentages)
   - Guild ranks/roles
   - Professions and gear details

2. **Filtering**:
   - Filter by class, role, rank
   - Multiple filters can be active simultaneously
   - Clear/reset filter functionality

3. **Sorting**:
   - Sort by any relevant field (name, class, rank, attendance, etc.)
   - Ascending/descending toggle
   - Visual indicator of current sort

4. **Search**:
   - Search across character names and player names
   - Real-time search results
   - Clear search functionality

5. **Detailed Views**:
   - Click characters for detailed information
   - Modal or expandable view (match original UX pattern)
   - Display all available character data

6. **Admin Editing** (for authorized users):
   - Add new roster entries
   - Edit existing entries
   - Remove entries
   - Form validation

7. **Additional features** identified in the analysis
</requirements>

<implementation>

**Component Architecture**:
- Create in `app/roster/` directory (Next.js App Router page)
- Use composition: separate components for filters, table, detail view, admin forms
- Leverage existing WoW components from `components/wow/`
- Create custom components only when shadcn/ui doesn't have what you need

**State Management**:
- Use Zustand for client-side roster state
- Create store in `lib/stores/roster-store.ts`
- Handle filtering, sorting, search in the store

**Styling**:
- Use CSS variables from `app/globals.css` (never hard-code colors)
- Follow existing WoW color schemes (class colors, role colors)
- Make responsive by default (mobile, tablet, desktop)
- Use `cn()` utility for conditional classes

**Data Layer**:
- Create Firebase Firestore integration for roster data
- Define data model in `lib/types/roster.types.ts`
- Create CRUD operations in `lib/firebase/roster.ts`
- Use mock data initially for development/testing

**Components to create**:
1. `app/roster/page.tsx` - Main roster page
2. `components/roster/RosterTable.tsx` - Table display
3. `components/roster/RosterFilters.tsx` - Filtering UI
4. `components/roster/RosterSearch.tsx` - Search bar
5. `components/roster/CharacterDetail.tsx` - Detail modal/view
6. `components/roster/RosterAdminForm.tsx` - Add/edit form
7. `lib/stores/roster-store.ts` - Zustand store
8. `lib/types/roster.types.ts` - TypeScript types
9. `lib/firebase/roster.ts` - Firebase operations
10. `lib/mock/roster-data.ts` - Mock data for development

**What to avoid and WHY**:
- Don't create new base UI components - shadcn/ui provides these already, saving development time and ensuring consistency
- Don't hard-code colors - use CSS variables so guild admins can customize themes
- Don't skip TypeScript types - they prevent bugs and improve developer experience
- Don't make components too large - composition makes testing and maintenance easier
- Don't forget accessibility - use semantic HTML and ARIA labels for screen readers

**Pattern preferences**:
- Use Server Components where possible, Client Components only when needed (interactivity)
- Follow the existing pattern from `app/theme-demo/` for page structure
- Use shadcn Dialog for modals, Table for roster display, Badge for status indicators
- Implement optimistic updates for admin actions (better UX)
</implementation>

<output>
Create the following files with relative paths:

1. **Types**: `./lib/types/roster.types.ts`
   - TypeScript interfaces matching the data model from analysis

2. **Store**: `./lib/stores/roster-store.ts`
   - Zustand store for roster state, filtering, sorting, search

3. **Firebase**: `./lib/firebase/roster.ts`
   - CRUD operations for roster data

4. **Mock Data**: `./lib/mock/roster-data.ts`
   - Sample roster data for development

5. **Components**: `./components/roster/`
   - RosterTable.tsx
   - RosterFilters.tsx
   - RosterSearch.tsx
   - CharacterDetail.tsx
   - RosterAdminForm.tsx

6. **Page**: `./app/roster/page.tsx`
   - Main roster page integrating all components

Include comprehensive inline documentation explaining complex logic.
</output>

<verification>
Before declaring complete, verify:

1. **Feature completeness**:
   - All features from the analysis are implemented
   - Filtering works for all specified fields
   - Sorting works bidirectionally
   - Search filters results correctly
   - Detail views show all relevant data
   - Admin forms validate and save correctly

2. **Code quality**:
   - TypeScript types are complete and accurate
   - Components follow single responsibility principle
   - Proper error handling
   - Loading states for async operations

3. **Design consistency**:
   - Uses shadcn/ui components throughout
   - Follows existing WoW component patterns
   - Uses CSS variables (no hard-coded colors)
   - Responsive on all screen sizes

4. **Testing**:
   - Run the dev server to verify UI renders correctly
   - Test filtering, sorting, search with mock data
   - Verify admin forms work (validation, submission)
   - Check responsive behavior

5. **Documentation**:
   - Key functions have JSDoc comments
   - Complex logic is explained
   - Types are well-documented
</verification>

<success_criteria>
- All files created and properly structured
- Complete feature parity with original Seios-Aner roster
- Modern, interactive UI using shadcn/ui components
- Filtering, sorting, and search working correctly
- Character detail views functional
- Admin forms for adding/editing/removing entries
- Type-safe with comprehensive TypeScript types
- Responsive design following project conventions
- Uses existing WoW components where applicable
- Clean, maintainable code with proper separation of concerns
- Successfully runs in development without errors
</success_criteria>
