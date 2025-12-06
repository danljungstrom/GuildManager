# Seios-Aner Roster Analysis

## Executive Summary

The Seios-Aner roster is a comprehensive, production-ready guild management system built with Next.js 13+ and Material UI. It provides a full-featured table interface for managing World of Warcraft guild members with robust CRUD operations, inline editing, expandable row details, and sophisticated sorting.

**Key Findings:**
- **Architecture:** Component-based design with clear separation of concerns (table, rows, cells, sections)
- **State Management:** Local React state with API integration via custom hooks and service layer
- **Admin Features:** Protected edit mode with inline editing, add/delete operations, and confirmation dialogs
- **Data Model:** Comprehensive member data including attunements, professions, extra roles, join dates, and notes
- **UX Patterns:** Collapsible rows, dual-mode display (view/edit), visual feedback with class-based colors

---

## Component Architecture

### File Structure
```
src/components/table/
├── RosterTable.tsx              # Main container with edit mode state
├── RosterTableWrapper.tsx       # Dynamic loading wrapper (SSR disabled)
├── RosterTableHeader.tsx        # Table header with settings cog
├── RosterTableBody.tsx          # Body with member rows + add row
├── RosterTableRow.tsx           # Individual member row (view/edit)
├── EditableCell.tsx             # Cell-level editing logic
├── IconText.tsx                 # Icon + text display component
├── tableConfig.ts               # Column definitions
├── tableUtils.tsx               # Cell rendering utilities
├── addMember/
│   ├── AddMemberDialog.tsx     # Multi-step dialog for adding members
│   └── AddMemberRow.tsx        # Inline add row (legacy/unused)
└── sections/
    ├── SectionHeader.tsx        # Colored section headers
    ├── staticSections/          # Read-only expanded sections
    │   ├── AttunementSection.tsx
    │   ├── ProfessionSection.tsx
    │   ├── ExtraRolesSection.tsx
    │   ├── NotesSection.tsx
    │   └── JoinDateSection.tsx
    └── editableSections/        # Editable expanded sections
        ├── EditableAttunementSection.tsx
        ├── EditableProfessionSection.tsx
        ├── EditableExtraRolesSection.tsx
        ├── EditableNotesSection.tsx
        └── EditableJoinDateSection.tsx
```

### Component Hierarchy
```
RosterTableWrapper (dynamic import, no SSR)
└── RosterTable (main container)
    ├── Paper (MUI wrapper with border/shadow)
    │   └── TableContainer
    │       └── Table
    │           ├── RosterTableHeader
    │           │   ├── Settings cog (admin only)
    │           │   ├── Avatar column header (empty)
    │           │   ├── Primary columns (Name, Rank, Class, Role, Spec)
    │           │   └── Actions column header (empty)
    │           └── RosterTableBody
    │               ├── RosterTableRow (per member, memoized)
    │               │   ├── Main row (expand, avatar, editable cells, actions)
    │               │   └── Expanded row (collapsible details)
    │               │       └── Sections (attunements, professions, etc.)
    │               ├── Add member row (edit mode only)
    │               └── AddMemberDialog (when adding)
    └── DeleteConfirmDialog (modal)
```

### Component Responsibilities

**RosterTable:**
- Manages global edit mode state
- Handles member CRUD operations via API service
- Controls which row is being edited (single edit at a time)
- Shows delete confirmation dialog
- Sorts members before rendering

**RosterTableRow:**
- Manages local row expansion state
- Handles local editing state (working copy vs original)
- Renders both collapsed and expanded views
- Switches between static and editable sections based on edit state
- Memoized for performance (only re-renders if props change)

**EditableCell:**
- Provides view/edit modes for individual cells
- Handles cascading updates (e.g., changing class resets spec/role)
- Smart dropdowns with icons for class/spec/role
- Validates relationships between class/spec/role

**Section Components:**
- Display detailed member information in expanded row
- Separate static (view) and editable versions
- Class-colored headers using `SectionHeader`
- Consistent styling with theme colors

---

## Data Model

### Core Type: GuildMember

```typescript
interface GuildMember {
  // Identity
  id?: string;                           // Firestore document ID
  name: string;                          // Character name

  // Core attributes
  rank: GuildRank;                       // Guild rank (GM, Officer, Core, Trial, Social)
  class: ClassType;                      // WoW class (Warrior, Priest, etc.)
  role?: RoleType;                       // Raid role (Tank, DPS, Healer)
  spec?: SpecType;                       // Specialization (Arms, Holy, etc.)
  offSpec?: SpecType;                    // Secondary spec (optional)

  // Metadata
  joinDate?: string;                     // ISO date string
  firstRaid?: string;                    // ISO date string (not used in UI)
  discordId?: string;                    // Discord user ID (not used in UI)

  // Progression & skills
  attunements: { [key: string]: boolean }; // e.g., { "mc": true, "onyxia": false }
  professions: {                         // Array of profession entries
    profession: Profession;              // Profession name
    skill: number;                       // Skill level (100-300)
  }[];

  // Additional info
  extraRoles?: ExtraRoleType[];          // Guild roles (Raid Leader, Class Leader, etc.)
  notes?: string;                        // Freeform notes
}
```

### Supporting Types

```typescript
// Guild ranks (defined in RANKS const)
type GuildRank = 'GM' | 'Officer' | 'Core' | 'Trial' | 'Social';

// Raid roles
type RoleType = 'Tank' | 'DPS' | 'Healer';

// Extra guild roles
type ExtraRoleType = 'Raid Leader' | 'Class Leader' | 'Main Tank' | 'Enchanter';

// Attunements structure
interface Attunement {
  name: string;           // Key (e.g., "mc")
  displayName: string;    // Display label (e.g., "MC")
  released: boolean;      // Is currently obtainable
  color: string;          // Color code for UI
}

// Available attunements (Classic WoW)
const ATTUNEMENTS = [
  { name: 'mc', displayName: 'MC', released: true, color: '#FF6600' },
  { name: 'onyxia', displayName: 'Onyxia', released: true, color: '#A335EE' },
  { name: 'bwl', displayName: 'Blackwing Lair', released: false, color: '#C41F3B' },
  { name: 'uldum', displayName: 'Uldum', released: false, color: '#FFD700' },
  { name: 'naxx', displayName: 'Naxxramas', released: false, color: '#00FFBA' },
];
```

### Table Configuration

```typescript
enum RosterColumnId {
  Name = 'name',
  Rank = 'rank',
  Class = 'class',
  Role = 'role',
  Spec = 'spec',
  Actions = 'actions',
}

interface Column {
  id: RosterColumnId;
  label: string;
  minWidth?: number;
  align?: 'right' | 'center' | 'left';
  format?: (value: string | number | Date) => string;
}

// Primary columns (rendered in main row)
const primaryColumns: Column[] = [
  { id: 'name', label: 'Name', minWidth: 120, align: 'left' },
  { id: 'rank', label: 'Rank', minWidth: 100, align: 'left' },
  { id: 'class', label: 'Class', minWidth: 100, align: 'left' },
  { id: 'role', label: 'Role', minWidth: 100, align: 'left' },
  { id: 'spec', label: 'Spec', minWidth: 110, align: 'left' },
];

// Actions column (always present, no label)
const actionsColumn: Column = {
  id: 'actions',
  label: '',
  minWidth: 80,
  align: 'center',
};
```

---

## Features Inventory

### Sorting

**Implementation:** `lib/utils/memberSorting.ts`

**Sorting Hierarchy:**
1. **Class** (alphabetical)
2. **Rank** (GM → Officer → Core → Trial → Social)
3. **Join Date** (earlier dates first)
4. **Name** (alphabetical, tiebreaker)

**Function:**
```typescript
function sortMembers(members: GuildMember[]): GuildMember[] {
  return [...members].sort((a, b) => {
    // 1. Sort by class (alphabetical)
    const classComparison = a.class.localeCompare(b.class);
    if (classComparison !== 0) return classComparison;

    // 2. Sort by rank hierarchy
    const rankIndexA = RANKS.indexOf(a.rank);
    const rankIndexB = RANKS.indexOf(b.rank);
    if (rankIndexA !== rankIndexB) return rankIndexA - rankIndexB;

    // 3. Sort by join date (earlier first)
    const dateA = new Date(a.joinDate || Date.now());
    const dateB = new Date(b.joinDate || Date.now());
    const dateComparison = dateA.getTime() - dateB.getTime();
    if (dateComparison !== 0) return dateComparison;

    // 4. Sort by name (alphabetical)
    return a.name.localeCompare(b.name);
  });
}
```

**Notes:**
- Sorting is automatic (no user controls)
- Always applied before rendering
- Unknown ranks are pushed to the end

### Filtering

**Status:** NOT IMPLEMENTED

The current implementation does not include any filtering features. All members are always visible.

**Considerations for future implementation:**
- Filter by class (multi-select)
- Filter by role (Tank/DPS/Healer)
- Filter by rank (GM, Officer, Core, etc.)
- Filter by attunement status
- Search by name

### Search

**Status:** NOT IMPLEMENTED

No search functionality exists in the current implementation.

**Considerations for future implementation:**
- Search by character name
- Search in notes field
- Fuzzy matching support

### Character Detail Views

**Implementation:** Expandable rows with collapsible details sections

**Expand/Collapse Mechanism:**
- Click chevron arrow in first column
- Arrow icon changes: down (collapsed) ↔ up (expanded)
- Expand state is per-row (independent)
- Auto-expands when entering edit mode for that row

**Expanded Sections (5 total):**

1. **Attunements** (width: 140px)
   - Shows all available attunements with completion status
   - View mode: Check (green) or X (red) icons
   - Edit mode: Toggle switches in bordered container

2. **Professions** (width: 150px in view, 260px in edit)
   - Shows profession name + skill level (with icon)
   - View mode: Simple list with icons
   - Edit mode: Add/remove professions with dropdowns for name and skill level

3. **Extra Roles** (width: 120px in view, 100-140px in edit)
   - Shows additional guild roles (Raid Leader, etc.)
   - View mode: Simple list
   - Edit mode: Clickable pills to add/remove roles

4. **Join Date** (width: 120px)
   - Formatted as "Month Day, Year" (e.g., "January 15, 2024")
   - View mode: Formatted date string
   - Edit mode: Date picker input

5. **Notes** (width: 200px in view, 140px+ in edit)
   - Freeform text field
   - View mode: Plain text or "-" if empty
   - Edit mode: Multi-line text area (3 rows)

**Section Layout:**
- Horizontal flex layout with wrapping
- All sections visible simultaneously
- Class-colored section headers with text shadow
- Consistent spacing and alignment

### Admin Features

**Edit Mode Toggle:**
- Settings cog icon in top-left corner (admin only)
- Toggles entire table between view/edit modes
- Icon color changes when active (gold when in edit mode)

**Edit Member (Inline Editing):**
1. Click edit icon (pencil) in actions column
2. Row automatically expands
3. Editable cells become input fields/dropdowns
4. Expanded sections show editable components
5. Save (checkmark) or Cancel (X) in actions column
6. Only one member can be edited at a time

**Editable Fields:**
- **Main row:** Name, Rank, Class, Role, Spec
- **Expanded sections:** Attunements, Professions, Extra Roles, Join Date, Notes

**Field Validation & Cascading Updates:**
- Changing class → resets spec and role
- Changing spec → updates available roles
- Auto-selects role if only one option available
- Class/spec/role relationships enforced via `getAvailableRolesForClass()`

**Add Member:**
1. In edit mode, "Add new member" row appears at bottom
2. Click to open multi-step dialog:
   - **Step 1:** Basic info (Name, Rank, Class, Spec, Role) - REQUIRED
   - **Step 2:** Details (Attunements, Professions, Extra Roles, Join Date, Notes) - OPTIONAL
3. Stepper UI shows progress
4. Validation prevents advancing with incomplete required fields
5. Creates member via API on completion

**Delete Member:**
1. Click delete icon (trash) in actions column
2. Confirmation dialog appears with member name
3. "Cancel" or "Delete" buttons
4. Loading state during deletion
5. Automatically refreshes roster on success

**Admin Detection:**
- `useAuth` hook provides `isAdmin` boolean
- Edit mode controls only visible when `isAdmin === true`
- All mutations require admin authentication at API layer

### Other Features

**Visual Feedback:**
- **Class colors:** Each row has subtle background tint based on class
- **Class borders:** Bottom border of each row matches class color (darker shade)
- **Hover effects:** Rows slightly change background on hover
- **Icon animations:** New members have pulsing expand icon (unused in current flow)
- **Loading states:** Delete dialog shows loading spinner
- **Error handling:** Error messages displayed in alerts

**Performance Optimizations:**
- Row memoization: `React.memo` on `RosterTableRow` prevents unnecessary re-renders
- Memoized class colors calculated once per row
- Dynamic imports for SSR bypass (prevents hydration issues)

**Responsive Design:**
- `TableContainer` with horizontal scroll on small screens
- Minimum table width: 650px
- Fixed column widths for consistency
- Expandable sections wrap on narrow viewports

**No SSR:**
- `RosterTableWrapper` uses `next/dynamic` with `ssr: false`
- Prevents hydration mismatches with Material UI
- Shows "Loading roster..." placeholder during client-side load

---

## UI/UX Patterns

### Layout Approach

**Table Structure:**
- Fixed layout with defined column widths
- Horizontal scrolling on overflow
- Gold border (#bfa76a) with shadow
- Rounded corners (borderRadius: 3)
- Dark background (#232323 via MUI theme)

**Row Structure:**
- Main row: 42px height, compact display
- Expanded row: Variable height based on content
- First column: 48px for expand icon
- Second column: 40px for class icon (avatar)
- Actions column: 80px for edit/delete buttons

**Color Palette:**
- Primary gold: `#bfa76a` (borders, headers, icons)
- Background: `#232323` (dark)
- Class colors: Per WoW class (e.g., Warrior: `#C79C6E`)
- Success green: `#4ca851ff` (attunements)
- Error red: `#c43d3dff` (attunements), `#f44336` (delete)

### Visual Hierarchy

**Header:**
- Bold text, gold color
- Settings cog left-aligned
- Column labels aligned with content

**Main Row:**
- Class icon (28px, circular, bordered)
- Bold class name in class color
- Role with small icon (20px)
- Spec with small icon (20px, circular)
- Subtle class-colored background

**Expanded Sections:**
- Horizontal layout, flexbox with wrapping
- Section headers: Bold, class-colored, with black text shadow
- Consistent spacing between sections (gap: 3)
- Bordered containers in edit mode

**Icons:**
- Class icons: 25-28px, circular, 2px black border
- Spec icons: 16-20px, circular, 1px border
- Role icons: 16-20px
- Action icons: 16px (edit, delete, save, cancel)
- Attunement status icons: Small (MUI default)

### Responsive Behavior

**Minimum Width:** 650px for table

**Overflow Handling:**
- TableContainer scrolls horizontally
- Expanded sections wrap vertically
- Paper wrapper maintains full width

**Section Widths:**
- Static (view mode): Fixed widths per section
- Editable (edit mode): Flexible widths with min/max constraints
- All sections use `flexShrink: 0` to prevent squishing

**Mobile Considerations:**
- Table likely requires horizontal scroll on mobile
- No mobile-specific layouts implemented
- Expandable rows help reduce vertical space

### Interaction Patterns

**Row Expansion:**
- Click chevron icon to toggle
- Icon rotates (down → up)
- Smooth collapse animation (Material UI default)
- Independent state per row

**Inline Editing:**
- Click edit icon → row expands + fields become editable
- All changes local until save/cancel
- Save applies partial updates (only changed fields)
- Cancel restores original values

**Add Member Flow:**
- Click "Add new member" row → opens dialog
- Multi-step wizard (2 steps)
- Progress indicator (stepper)
- Required fields block advancement
- Can go back to step 1 from step 2

**Delete Confirmation:**
- Modal dialog with member name
- Distinct "Cancel" and "Delete" buttons
- Loading state prevents duplicate clicks

**Hover States:**
- Rows: Background brightens slightly
- Icons: Change to gold color on hover
- Add member row: Background changes on hover

---

## State Management

### Global State (RosterTable)

**Managed by `RosterTable` component:**
- `isEditMode: boolean` - Whether table is in edit mode
- `editingMemberId: string | null` - ID of currently edited member
- `isAddingMember: boolean` - Whether add dialog is open
- `deleteDialog: { open, member, loading }` - Delete confirmation state
- `members: GuildMember[]` - Sorted list of all members (from parent)

**State Flow:**
```
Parent (HomePage)
  ↓ (members prop)
RosterTable
  ↓ (sorted members)
RosterTableBody
  ↓ (per member)
RosterTableRow (local state for expansion + editing)
```

### Local State (RosterTableRow)

**Managed by each row:**
- `open: boolean` - Expanded/collapsed state
- `localMember: GuildMember` - Working copy for editing
- `originalMember: GuildMember` - Original values (for cancel)
- `wasEditing: boolean` - Tracks edit mode transitions

**Edit Flow:**
1. Parent sets `isEditing={true}` for this row
2. Row stores `originalMember = member`
3. Row creates `localMember = member` (working copy)
4. Row auto-expands (`open = true`)
5. User edits fields → updates `localMember`
6. On save → sends `localMember` changes to parent
7. On cancel → restores `localMember = originalMember`

### Data Fetching

**Hook:** `useGuildMembers()` (custom hook, not in analyzed files)

**Expected Interface:**
```typescript
interface UseGuildMembersReturn {
  members: GuildMember[];
  loading: boolean;
  error: string | null;
  fetchMembers: () => Promise<void>;
  deleteMember: (id: string) => Promise<void>;
}
```

**API Service Layer:** `GuildMembersApiService`

**Methods:**
- `getAllMembers()` - GET /api/guild-members
- `getMemberById(id)` - GET /api/guild-members/:id
- `createMember(member)` - POST /api/guild-members
- `updateMember(id, updates)` - PUT /api/guild-members/:id
- `deleteMember(id)` - DELETE /api/guild-members/:id

**Update Triggers:**
- Add member → calls `onMembersChange()` → refetches all members
- Update member → calls `onMembersChange()` → refetches all members
- Delete member → calls `onDeleteMember(id)` OR API directly → refetches

**Optimistic Updates:** NOT IMPLEMENTED
- All changes require server confirmation before UI updates
- Loading states shown during operations

---

## Dependencies & Utilities

### External Libraries

**Material UI (MUI):**
- `@mui/material` - All table, input, dialog components
- `@mui/icons-material` - All icons (Settings, Edit, Delete, Add, etc.)

**Next.js:**
- `next/dynamic` - Dynamic imports for SSR bypass
- `next/image` - Image optimization for class/spec icons

**React:**
- Hooks: `useState`, `useEffect`, `useMemo`, `React.memo`
- No external state management (Redux, Zustand, etc.)

### Custom Utilities

**Sorting:**
- `lib/utils/memberSorting.ts` - `sortMembers()`, `getClassOrder()`, `getRankOrder()`

**Formatting:**
- `lib/utils/formattingUtils.ts` - `getDarkerClassColor()` (referenced, not shown)

**Validation:**
- `lib/consts/classes.ts` - `isValidClass()`, `getClassSpecializations()`
- `lib/consts/roles.ts` - `isValidRole()`, `getAvailableRolesForClass()`

**Configuration:**
- `lib/consts/classes.ts` - `CLASS_CONFIGS`, `CLASSES`
- `lib/consts/roles.ts` - `ROLE_CONFIGS`, `ROLES`, `EXTRA_ROLES`
- `lib/consts/professions.ts` - `PROFESSION_CONFIGS`, `PROFESSIONS`, `PROFESSION_SKILL_LEVELS`
- `lib/consts/attunements.ts` - `ATTUNEMENTS`, `getAvailableAttunements()`
- `lib/consts/guild.ts` - `RANKS`

**Styles:**
- `lib/styles/tableStyles.ts` - `STYLES` object (referenced, not shown)
- Contains reusable style objects for rows, cells, text, etc.

### Helper Components

**IconText:**
- Renders icon + text side-by-side
- Used throughout for class/role/spec displays
- Props: `iconSrc`, `text`, `iconSize`, `iconProps`, `textStyle`

**SectionHeader:**
- Styled typography component for section titles
- Auto-applies class color with black text shadow
- Props: `classType`, `children`

**DeleteConfirmDialog:**
- Reusable confirmation modal (referenced, not shown)
- Props: `open`, `onClose`, `onConfirm`, `memberName`, `loading`

---

## Data Requirements

### Minimum Required Fields (for creation)

**Step 1 (Basic Info):**
- `name` (string) - Required
- `rank` (GuildRank) - Required, defaults to first rank
- `class` (ClassType) - Required, defaults to first class
- `spec` (SpecType) - Required, must be valid for class
- `role` (RoleType) - Required, must be valid for class/spec

**Step 2 (Details):**
- All optional, defaults provided:
  - `attunements` - Defaults to all false
  - `professions` - Defaults to empty array
  - `extraRoles` - Defaults to empty array
  - `joinDate` - Defaults to today's date
  - `notes` - Defaults to empty string

### Field Constraints

**Name:**
- Type: string
- Validation: Must not be empty
- Max length: Not enforced in UI

**Rank:**
- Type: One of `['GM', 'Officer', 'Core', 'Trial', 'Social']`
- Validation: Must be from RANKS const

**Class:**
- Type: ClassType (see `lib/consts/classes.ts`)
- Validation: Must be from CLASSES const
- Examples: Warrior, Priest, Mage, Rogue, etc.

**Spec:**
- Type: SpecType (depends on class)
- Validation: Must be valid for selected class
- Examples: Arms, Holy, Fire, Assassination, etc.

**Role:**
- Type: One of `['Tank', 'DPS', 'Healer']`
- Validation: Must be valid for selected class/spec
- Auto-selected if class/spec only has one role

**Professions:**
- Type: Array of `{ profession: Profession, skill: number }`
- Max: Not enforced (unlimited)
- Skill levels: From `PROFESSION_SKILL_LEVELS` (100, 150, 200, 225, 250, 275, 300)

**Attunements:**
- Type: Object `{ [attunementName: string]: boolean }`
- Keys: From ATTUNEMENTS const (mc, onyxia, bwl, uldum, naxx)
- All default to false

**Extra Roles:**
- Type: Array of ExtraRoleType
- Values: From EXTRA_ROLES const (Raid Leader, Class Leader, Main Tank, Enchanter)

**Join Date:**
- Type: ISO date string (YYYY-MM-DD)
- Defaults to current date

**Notes:**
- Type: string (freeform)
- No validation

### Sample Data Structure

```typescript
const sampleMember: GuildMember = {
  id: "abc123xyz",
  name: "Thrallson",
  rank: "Core",
  class: "Warrior",
  spec: "Arms",
  offSpec: "Protection",
  role: "DPS",
  joinDate: "2024-01-15",
  professions: [
    { profession: "Blacksmithing", skill: 300 },
    { profession: "Mining", skill: 275 }
  ],
  attunements: {
    mc: true,
    onyxia: true,
    bwl: false,
    uldum: false,
    naxx: false
  },
  extraRoles: ["Class Leader"],
  notes: "Reliable raider, strong DPS output"
};
```

---

## Implementation Notes

### Important Patterns to Preserve

**1. Memoization for Performance:**
```typescript
export const RosterTableRow = React.memo(RosterTableRowComponent, (prevProps, nextProps) => {
  return (
    prevProps.member === nextProps.member &&
    prevProps.isEditMode === nextProps.isEditMode &&
    prevProps.isEditing === nextProps.isEditing &&
    prevProps.isNewlyAdded === nextProps.isNewlyAdded &&
    prevProps.autoExpand === nextProps.autoExpand
  );
});
```
This prevents re-rendering unchanged rows when other rows update.

**2. Partial Updates on Save:**
```typescript
const handleSave = () => {
  const updates: Partial<GuildMember> = {};
  Object.keys(localMember).forEach((key) => {
    const typedKey = key as keyof GuildMember;
    if (JSON.stringify(localMember[typedKey]) !== JSON.stringify(originalMember[typedKey])) {
      updates[typedKey] = localMember[typedKey];
    }
  });
  onSave(member, updates);
};
```
Only sends changed fields to reduce payload and avoid overwriting concurrent changes.

**3. Cascading Field Updates:**
When class changes, spec and role must reset:
```typescript
if (field === 'class') {
  updated.role = undefined;
  updated.spec = '';
  if (isValidClass(value)) {
    const classRoles = getAvailableRolesForClass(value as ClassType);
    if (classRoles.length === 1) {
      updated.role = classRoles[0]; // Auto-select if only one option
    }
  }
}
```

**4. Single Edit Mode:**
Only one member can be edited at a time, enforced by `editingMemberId` state.

**5. Auto-Expand on Edit:**
When a row enters edit mode, it automatically expands to show all sections.

**6. SSR Disabled:**
Material UI table is wrapped in `next/dynamic` with `ssr: false` to prevent hydration issues.

**7. Class-Colored Styling:**
Each row and section header uses the member's class color for visual cohesion:
```typescript
const classColor = member.class && CLASS_CONFIGS[member.class]?.color
  ? CLASS_CONFIGS[member.class].color
  : undefined;

const classBorderColor = member.class
  ? getDarkerClassColor(member.class)
  : '#333';
```

**8. Icon-Enhanced Dropdowns:**
All class/spec/role selects show icons alongside text for better UX.

**9. Validation Before API Calls:**
Add member dialog validates required fields before enabling "Next" or "Create" buttons.

**10. Optimistic UI for Expansion:**
Row expansion is instant (no API call), providing snappy UX.

### Common Gotchas

**Problem:** Changing class doesn't update role dropdown options.
**Solution:** Cascading updates in `handleFieldChange` ensure role options refresh.

**Problem:** Multiple rows editing at once causes conflicts.
**Solution:** `editingMemberId` enforces single-edit mode.

**Problem:** Material UI hydration mismatches in SSR.
**Solution:** Use `next/dynamic` with `ssr: false` for table component.

**Problem:** Large re-renders when one member updates.
**Solution:** Memoize `RosterTableRow` with custom comparison function.

**Problem:** Profession/extra role arrays get corrupted during editing.
**Solution:** Always create new arrays with spread operator, never mutate directly.

**Problem:** Date inputs not working on all browsers.
**Solution:** Use `type="date"` input with `InputLabelProps={{ shrink: true }}`.

### Testing Considerations

**Unit Tests:**
- `sortMembers()` - Test all sorting tiers (class, rank, date, name)
- `EditableCell` - Test cascading updates for class/spec/role
- `AddMemberDialog` - Test multi-step validation logic

**Integration Tests:**
- Full CRUD cycle (create, read, update, delete)
- Edit mode toggle behavior
- Row expansion/collapse
- Inline editing save/cancel

**E2E Tests:**
- Admin login → enable edit mode → edit member → save
- Admin add new member through dialog
- Admin delete member with confirmation
- Non-admin cannot access edit features

### Migration Challenges

**From Material UI to shadcn/ui:**

1. **Table Structure:**
   - MUI uses `Table`, `TableHead`, `TableBody`, `TableRow`, `TableCell`
   - shadcn/ui uses `Table`, `TableHeader`, `TableRow`, `TableHead`, `TableBody`, `TableCell`
   - Similar but different component names/structure

2. **Collapsible Rows:**
   - MUI has `Collapse` component built-in
   - shadcn/ui uses Radix Collapsible primitive
   - Need to adapt expansion animation

3. **Dialogs:**
   - MUI `Dialog`, `DialogTitle`, `DialogContent`, `DialogActions`
   - shadcn/ui `Dialog`, `DialogTrigger`, `DialogContent`, `DialogHeader`, `DialogTitle`, `DialogDescription`, `DialogFooter`
   - Structure is similar but naming differs

4. **Form Controls:**
   - MUI `TextField`, `Select`, `MenuItem`, `FormControl`
   - shadcn/ui `Input`, `Select`, `SelectTrigger`, `SelectContent`, `SelectItem`
   - Need to refactor all form components

5. **Icons:**
   - MUI icons are React components from `@mui/icons-material`
   - shadcn/ui typically uses `lucide-react` icons
   - Similar icons available, just different packages

6. **Stepper:**
   - MUI has built-in `Stepper`, `Step`, `StepLabel` components
   - shadcn/ui doesn't have a stepper component (need custom or third-party)
   - Could use custom implementation or find alternative library

7. **Styling:**
   - MUI uses `sx` prop for inline styles
   - shadcn/ui uses Tailwind CSS classes and `cn()` utility
   - All styles need conversion to Tailwind

8. **Theme:**
   - MUI uses theme provider with `createTheme()`
   - shadcn/ui uses CSS variables for theming
   - GuildManager already has CSS variable theme system

**Major Advantages of Migration:**

1. **Existing WoW Components:**
   - GuildManager already has `ClassIcon`, `RoleIcon`, `SpecIcon` components
   - Can reuse these instead of custom MUI icon displays

2. **Theme System:**
   - GuildManager's CSS variable system already matches shadcn/ui approach
   - Class colors already defined in `globals.css`

3. **Type Safety:**
   - Both implementations use TypeScript
   - Existing type definitions can be reused

4. **Performance:**
   - Memoization patterns can be preserved
   - Radix primitives are performant

**Migration Strategy:**

1. Start with `EditableCell` - convert to shadcn/ui Select/Input
2. Migrate section components (static first, then editable)
3. Convert `RosterTableRow` - adapt Collapse to Collapsible
4. Rebuild `AddMemberDialog` with shadcn/ui Dialog
5. Convert table structure (MUI Table → shadcn Table)
6. Replace all icon components with WoW-specific or Lucide icons
7. Convert all MUI styling (`sx`) to Tailwind classes
8. Build custom stepper or find alternative for add dialog

---

## Preservation Checklist

When recreating the roster, ensure the following are maintained:

### Core Functionality
- [ ] Automatic sorting (class → rank → join date → name)
- [ ] Expandable rows with collapse animation
- [ ] Admin-only edit mode toggle
- [ ] Single-row editing (only one member at a time)
- [ ] Inline editing with save/cancel
- [ ] Multi-step add member dialog
- [ ] Delete confirmation dialog
- [ ] Partial updates (only changed fields sent to API)
- [ ] Cascading field updates (class → spec/role)

### Data Integrity
- [ ] All GuildMember fields supported
- [ ] Attunements as boolean flags
- [ ] Professions as array of {profession, skill} objects
- [ ] Extra roles as string array
- [ ] Join date as ISO string
- [ ] Notes as freeform text

### UX Patterns
- [ ] Class-colored row backgrounds (subtle tint)
- [ ] Class-colored row borders (darker shade)
- [ ] Class-colored section headers
- [ ] Icon + text displays for class/spec/role
- [ ] Hover states on rows and icons
- [ ] Auto-expand on edit
- [ ] Visual feedback for actions (loading states)

### Performance
- [ ] Memoized row components
- [ ] Only re-render changed rows
- [ ] Efficient sorting (memoized)
- [ ] No unnecessary API calls

### Admin Features
- [ ] Settings cog visibility (admin only)
- [ ] Edit mode badge/indicator
- [ ] Edit/delete/save/cancel icons
- [ ] Add member row in edit mode
- [ ] Confirmation before destructive actions

### Expandable Sections
- [ ] 5 sections: Attunements, Professions, Extra Roles, Join Date, Notes
- [ ] Static versions (view mode)
- [ ] Editable versions (edit mode)
- [ ] Consistent section header styling
- [ ] Proper flex layout with wrapping

### Field Validation
- [ ] Required fields enforced in add dialog
- [ ] Class/spec/role relationships validated
- [ ] Auto-select role when only one option
- [ ] Date input validation
- [ ] Profession skill level constraints

---

## Conclusion

The Seios-Aner roster is a mature, feature-complete implementation with excellent UX patterns and solid architecture. The key to successful migration is:

1. **Preserve the data model exactly** - GuildMember interface should remain unchanged
2. **Maintain the component hierarchy** - Table → Body → Row → Sections
3. **Keep the edit flow** - Single-edit mode with save/cancel
4. **Adapt the UI library** - Replace MUI with shadcn/ui while keeping functionality
5. **Leverage existing GuildManager components** - Use ClassIcon, RoleIcon, etc. instead of custom displays
6. **Maintain performance patterns** - Memoization and partial updates are critical

The migration will be straightforward because:
- GuildManager's theme system (CSS variables) aligns with shadcn/ui
- Existing WoW components can replace most custom MUI displays
- TypeScript types are already well-defined
- The component architecture is clean and modular

The main work will be:
1. Converting MUI components to shadcn/ui equivalents
2. Translating MUI `sx` styles to Tailwind classes
3. Building or finding a stepper component for the add dialog
4. Adapting the Collapse animation to Radix Collapsible

With this analysis, you have complete documentation of every feature, pattern, and data structure needed to recreate the roster with 100% feature parity in GuildManager.
