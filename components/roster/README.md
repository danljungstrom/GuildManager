# Roster Management System

A comprehensive, modern roster management system for GuildManager with full feature parity to the Seios-Aner roster implementation.

## Overview

This roster system provides a complete solution for managing guild members with advanced filtering, sorting, search capabilities, and admin tools for CRUD operations.

## Features

### Core Functionality

- **Full Roster Display**: View all guild members with comprehensive character information
- **Advanced Filtering**: Filter by class, role, rank, and attunements (multi-select)
- **Flexible Sorting**: Sort by name, rank, class, level, gear score, attendance (ascending/descending)
- **Real-time Search**: Search across character names and player names
- **Expandable Rows**: Click to expand rows for detailed member information
- **Detailed Modal View**: Click any row to open a full character detail modal

### Admin Features

- **Add Members**: Comprehensive multi-step form for adding new roster entries
- **Edit Members**: Update existing member information with validation
- **Delete Members**: Remove members with confirmation dialog
- **Edit Mode Toggle**: Settings icon to enter/exit admin mode
- **Form Validation**: Ensures data integrity with type-safe forms

### Data Model

Each roster member includes:

- **Identity**: Character name, player name
- **Core Attributes**: Rank, class, spec, off-spec, role, level
- **Gear Info**: Gear score (expandable for slot-specific ilvls)
- **Progression**: Attunements (MC, Onyxia, BWL, AQ20, AQ40, Naxx)
- **Professions**: Profession name + skill level (0-300)
- **Raid Tracking**: Attendance percentage, total/attended raids, last raid date
- **Guild Roles**: Extra roles (Raid Leader, Class Leader, Main Tank, Enchanter)
- **Metadata**: Join date, notes, alt characters

## Architecture

### Component Structure

```
components/roster/
├── RosterSearch.tsx          # Search bar component
├── RosterFilters.tsx         # Multi-filter dropdown menus
├── RosterTable.tsx           # Main table with sorting and expandable rows
├── CharacterDetail.tsx       # Detailed modal view for members
├── RosterAdminForm.tsx       # Multi-tab add/edit form
└── index.ts                  # Component exports
```

### State Management

**Zustand Store** (`lib/stores/roster-store.ts`):
- Members list (all + filtered)
- UI state (loading, error, edit mode, selected member)
- Filters (class, role, rank, attunements, search query)
- Sort configuration (field, direction)
- CRUD actions with automatic re-filtering

**Selector Hooks**:
- `useActiveFilterCount()` - Count of active filters
- `useRosterStats()` - Roster statistics (total, by class/role, avg attendance)
- `useIsMemberSelected()` - Check if specific member is selected

### Data Layer

**Firebase Operations** (`lib/firebase/roster.ts`):
- `getAllRosterMembers()` - Fetch all members
- `getRosterMemberById()` - Fetch single member
- `createRosterMember()` - Create new member
- `updateRosterMember()` - Update existing member (partial updates)
- `deleteRosterMember()` - Delete member
- `getRosterStatistics()` - Calculate statistics

**Mock Data** (`lib/mock/roster-data.ts`):
- 15 sample members with realistic data
- Used for development when Firebase is empty
- Automatic fallback in roster page

### Type System

**Core Types** (`lib/types/roster.types.ts`):
- `RosterMember` - Complete member record
- `CreateRosterMember` - Type for creating new members
- `RosterMemberUpdate` - Partial update type
- `RosterFilters` - Filter configuration
- `RosterSort` - Sort configuration
- `GuildRank` - Guild rank hierarchy
- `AttunementMap` - Attunement completion tracking
- `ProfessionEntry` - Profession with skill level

**Helper Functions**:
- `memberMatchesFilters()` - Filter matching logic
- `sortRosterMembers()` - Sorting implementation
- `initializeAttunements()` - Default attunement map
- `getRankDisplayName()` - Rank display formatting
- `getAttendanceColor()` - Attendance status coloring

## Usage

### Basic Display

```tsx
import { RosterTable } from '@/components/roster';

export default function RosterPage() {
  return <RosterTable />;
}
```

### Complete Implementation

See `app/roster/page.tsx` for the full implementation with:
- Data loading (Firebase + mock fallback)
- Statistics cards
- Search and filter controls
- Table display
- Modal dialogs
- Admin forms

### Using the Store

```tsx
import { useRosterStore } from '@/lib/stores/roster-store';

function MyComponent() {
  const members = useRosterStore((state) => state.filteredMembers);
  const setSearchQuery = useRosterStore((state) => state.setSearchQuery);

  return <input onChange={(e) => setSearchQuery(e.target.value)} />;
}
```

### Admin Operations

```tsx
import { createRosterMember, updateRosterMember } from '@/lib/firebase/roster';

// Create member
const newMember = await createRosterMember({
  name: 'Thrall',
  rank: 'Core',
  class: 'Shaman',
  spec: 'Restoration',
  role: 'Healer',
  attunements: initializeAttunements(),
  professions: [],
});

// Update member
await updateRosterMember(memberId, {
  rank: 'Officer',
  notes: 'Promoted to officer',
});
```

## Styling

### WoW Component Integration

The roster system uses existing WoW components:

- `<ClassIcon>` - Display class icons and names with colors
- `<RoleIcon>` - Display raid role icons
- `<SpecIcon>` - Display specialization icons
- `<ProfessionIcon>` - Display profession icons with skill
- `<AttendanceBadge>` - Display attendance status with colors

### CSS Variables

All colors use CSS variables from `app/globals.css`:

- `--primary` - Primary brand color
- `--muted` - Muted backgrounds
- `--border` - Borders and separators
- Class colors: `--class-warrior`, `--class-priest`, etc.
- Role colors: `--role-tank`, `--role-dps`, `--role-healer`

### Utility Classes

```css
.class-warrior { color: var(--class-warrior); }
.bg-class-warrior { background-color: var(--class-warrior); }
.role-tank { color: var(--role-tank); }
```

## Responsive Design

- **Mobile**: Horizontal scroll for table, vertical stacking for filters
- **Tablet**: 2-column grids for statistics
- **Desktop**: Full layout with side-by-side filters

## Performance Optimizations

1. **Memoized Filtering**: Filters only recompute when members or filters change
2. **Efficient Sorting**: In-place sorting with memoization
3. **Optimistic UI**: Instant expansion/collapse of rows
4. **Partial Updates**: Only changed fields sent to Firebase
5. **Component Lazy Loading**: Modal dialogs load on demand

## Testing Considerations

### Manual Testing Checklist

- [ ] All filters work independently and combined
- [ ] Sorting works for all fields in both directions
- [ ] Search filters results correctly
- [ ] Row expansion shows all details
- [ ] Character detail modal displays correctly
- [ ] Add member form validates required fields
- [ ] Edit member form pre-fills with existing data
- [ ] Delete member shows confirmation
- [ ] Statistics update when data changes
- [ ] Responsive on mobile, tablet, desktop

### Test Data

Use `getMockRosterMembers()` for consistent test data:

```tsx
import { getMockRosterMembers } from '@/lib/mock/roster-data';

const testMembers = await getMockRosterMembers();
```

## Future Enhancements

Potential improvements for future iterations:

1. **Real-time Updates**: Firebase listeners for live roster updates
2. **Bulk Operations**: Multi-select and bulk edit/delete
3. **Export/Import**: CSV/JSON import/export functionality
4. **Advanced Stats**: Charts and graphs for roster composition
5. **Attendance Tracking**: Integrated raid attendance logging
6. **Audit Log**: Track changes to roster over time
7. **Character Linking**: Link to Warcraft Logs or WoW Armory
8. **Role Optimization**: Suggest optimal raid comp based on roster

## Troubleshooting

### No members showing

- Check Firebase connection in browser console
- Verify mock data is loading (should see console message)
- Check network tab for API errors

### Filters not working

- Clear all filters and try again
- Check browser console for errors
- Verify store state with React DevTools

### Admin form not saving

- Check Firebase rules allow writes
- Verify all required fields are filled
- Check browser console for validation errors

## Dependencies

### Core Dependencies
- Next.js 15 (App Router)
- React 19
- Zustand (state management)
- Firebase (Firestore)

### UI Components
- shadcn/ui (base components)
- Tailwind CSS v4
- Radix UI primitives
- lucide-react (icons)

### WoW Components
- ClassIcon, RoleIcon, SpecIcon
- ProfessionIcon, AttendanceBadge

## License

Part of the GuildManager project.
