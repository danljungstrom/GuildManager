# GuildManager - Component API Reference

## WoW Components

### ClassIcon
Display WoW class icons with color coding.

```tsx
import { ClassIcon } from '@/components/wow/ClassIcon';

<ClassIcon 
  className="Warrior"      // ClassType - required
  variant="both"           // "icon" | "text" | "both" (default: "icon")
  showText={true}          // Only shows text when variant="both" AND showText=true
  size="md"                // "sm" | "md" | "lg" (default: "md")
/>
```

### RoleIcon
Display role indicators (Tank, DPS, Healer).

```tsx
import { RoleIcon } from '@/components/wow/RoleIcon';

<RoleIcon 
  role="Tank"              // "Tank" | "DPS" | "Healer" - required
  variant="both"           // "icon" | "text" | "both"
  showText={true}          // Display text label
  size="md"                // "sm" | "md" | "lg"
/>
```

### SpecIcon
Display specialization icons.

```tsx
import { SpecIcon } from '@/components/wow/SpecIcon';

<SpecIcon 
  className="Priest"       // ClassType - required
  spec="Holy"              // Spec name - required
  showText={true}          // Display spec name
  size="md"                // "sm" | "md" | "lg"
/>
```

### ProfessionIcon
Display profession icons with skill levels.

```tsx
import { ProfessionIcon } from '@/components/wow/ProfessionIcon';

<ProfessionIcon 
  profession="Blacksmithing"  // Profession name - required
  skill={300}                  // Skill level (optional)
  showText={true}              // Display profession name
/>
```

### AttendanceBadge
Display raid attendance status.

```tsx
import { AttendanceBadge } from '@/components/wow/AttendanceBadge';

<AttendanceBadge 
  status="present"         // "present" | "absent" | "late" | "excused"
  percentage={95}          // Optional percentage
  showPercentage={true}    // Display percentage
/>
```

## Roster Components

### RosterTable
Main roster display with sorting and expandable rows.

```tsx
import { RosterTable } from '@/components/roster';

<RosterTable 
  members={rosterMembers}      // RosterMember[]
  sort={sortConfig}            // RosterSort
  onSortChange={handleSort}    // (sort: RosterSort) => void
  onMemberClick={handleClick}  // (member: RosterMember) => void
  isAdmin={isAdmin}            // Show admin controls
/>
```

### RosterFilters
Class, role, rank, attunement filtering.

```tsx
import { RosterFilters } from '@/components/roster';

<RosterFilters 
  filters={filters}            // RosterFilters
  onFiltersChange={setFilters} // (filters: RosterFilters) => void
  expansion="classic"          // WoWExpansion - for attunements
/>
```

### RosterSearch
Search by character/player name.

```tsx
import { RosterSearch } from '@/components/roster';

<RosterSearch 
  value={searchQuery}
  onChange={setSearchQuery}
/>
```

### RosterAdminForm
Add/edit/delete roster members.

```tsx
import { RosterAdminForm } from '@/components/roster';

<RosterAdminForm 
  member={selectedMember}      // RosterMember | null (null = add mode)
  onSave={handleSave}          // (data: CreateRosterMember) => void
  onDelete={handleDelete}      // () => void
  onCancel={handleCancel}      // () => void
  expansion="classic"          // WoWExpansion
/>
```

## UI Components (shadcn/ui)

### Button
```tsx
import { Button } from '@/components/ui/button';

<Button 
  variant="default"     // "default" | "destructive" | "outline" | "secondary" | "ghost" | "link"
  size="default"        // "default" | "sm" | "lg" | "icon"
  disabled={false}
  onClick={handleClick}
>
  Click me
</Button>
```

### Card
```tsx
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';

<Card>
  <CardHeader>
    <CardTitle>Title</CardTitle>
    <CardDescription>Description</CardDescription>
  </CardHeader>
  <CardContent>Content here</CardContent>
  <CardFooter>Footer</CardFooter>
</Card>
```

### Dialog
```tsx
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';

<Dialog open={open} onOpenChange={setOpen}>
  <DialogTrigger asChild>
    <Button>Open</Button>
  </DialogTrigger>
  <DialogContent>
    <DialogHeader>
      <DialogTitle>Title</DialogTitle>
      <DialogDescription>Description</DialogDescription>
    </DialogHeader>
    {/* Content */}
  </DialogContent>
</Dialog>
```

### Select
```tsx
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';

<Select value={value} onValueChange={setValue}>
  <SelectTrigger>
    <SelectValue placeholder="Select..." />
  </SelectTrigger>
  <SelectContent>
    <SelectItem value="option1">Option 1</SelectItem>
    <SelectItem value="option2">Option 2</SelectItem>
  </SelectContent>
</Select>
```

## Layout Components

### AppLayout
Root layout wrapper with sidebar.

```tsx
import { AppLayout } from '@/components/layout/AppLayout';

<AppLayout guildConfig={config}>
  {children}
</AppLayout>
```

### SidebarNav
Navigation items configuration.

```tsx
// Items defined in SidebarNav.tsx
const NAV_ITEMS = [
  { title: 'Dashboard', href: '/', icon: Home },
  { title: 'Roster', href: '/roster', icon: Users, subitems: [...] },
  // ...
];
```

## Contexts

### GuildContext
```tsx
import { useGuildConfig } from '@/lib/contexts/GuildContext';

const { guildConfig, isLoading, updateConfig } = useGuildConfig();
```

### AdminContext
```tsx
import { useAdmin } from '@/lib/contexts/AdminContext';

const { isAdmin, user, logout, isLoading } = useAdmin();
```

## Zustand Stores

### useRosterStore
```tsx
import { useRosterStore } from '@/lib/stores/roster-store';

const { 
  members,
  filters, setFilters,
  sort, setSort,
  searchQuery, setSearchQuery,
  filteredMembers,
  setMembers,
} = useRosterStore();
```

### useThemeStore
```tsx
import { useThemeStore } from '@/lib/stores/theme-store';

const {
  preset,
  colors,
  setPreset,
  setColors,
} = useThemeStore();
```
