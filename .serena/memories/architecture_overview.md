# GuildManager - Architecture Overview

## Directory Structure

```
├── app/                      # Next.js App Router pages
│   ├── globals.css          # Global styles + CSS variables
│   ├── layout.tsx           # Root layout with providers
│   ├── page.tsx             # Homepage
│   ├── admin/               # Admin pages
│   │   └── settings/        # Admin settings panel
│   ├── api/                 # API routes
│   │   ├── auth/           # Discord OAuth endpoints
│   │   │   ├── discord/    # OAuth flow handlers
│   │   │   ├── logout/     # Logout endpoint
│   │   │   └── me/         # Current user endpoint
│   │   └── upload/         # File upload handling
│   ├── roster/              # Guild roster pages
│   │   ├── page.tsx        # Main roster with CRUD
│   │   └── professions/    # Profession tracking
│   ├── settings/            # User settings page
│   ├── theme-demo/          # Design system showcase
│   ├── guild-info/          # Guild information page
│   └── raids/               # Raid planning (placeholder)
│
├── components/
│   ├── ui/                  # shadcn/ui base components
│   ├── wow/                 # WoW-specific components
│   │   ├── ClassIcon.tsx   # Class display
│   │   ├── RoleIcon.tsx    # Role display (Tank/DPS/Healer)
│   │   ├── SpecIcon.tsx    # Specialization display
│   │   ├── ProfessionIcon.tsx
│   │   └── AttendanceBadge.tsx
│   ├── roster/              # Roster management
│   │   ├── RosterTable.tsx # Main table with sorting
│   │   ├── RosterFilters.tsx
│   │   ├── RosterSearch.tsx
│   │   ├── RosterAdminForm.tsx
│   │   └── CharacterDetail.tsx
│   ├── layout/              # App layout components
│   │   ├── AppLayout.tsx
│   │   ├── AppSidebar.tsx
│   │   └── SidebarNav.tsx
│   ├── setup/               # Setup wizard
│   ├── logo/                # Logo customization
│   ├── settings/            # Settings components
│   └── user/                # User-related dialogs
│
├── lib/
│   ├── types/               # TypeScript type definitions
│   │   ├── guild-config.types.ts  # Guild config, theme types
│   │   ├── roster.types.ts        # Roster member types
│   │   ├── classes.types.ts       # WoW class types
│   │   ├── roles.types.ts         # Role types
│   │   └── professions.types.ts   # Profession types
│   ├── consts/              # WoW data constants
│   │   ├── classes.ts       # Class configs (colors, specs)
│   │   ├── roles.ts         # Role definitions
│   │   ├── professions.ts   # Profession data
│   │   └── expansions/      # Expansion-specific data
│   ├── constants/           # App constants
│   │   ├── theme-presets.ts # Theme presets
│   │   └── firestore-paths.ts
│   ├── contexts/            # React contexts
│   │   ├── GuildContext.tsx # Guild configuration
│   │   └── AdminContext.tsx # Auth state
│   ├── stores/              # Zustand stores
│   │   ├── roster-store.ts  # Roster state
│   │   └── theme-store.ts   # Theme state
│   ├── firebase/            # Firebase services
│   │   ├── config.ts        # Firebase init
│   │   ├── roster.ts        # Client roster CRUD
│   │   ├── roster.server.ts # Server roster operations
│   │   └── user-profiles.ts # User profile management
│   ├── services/            # Business logic
│   │   ├── guild-config.service.ts  # Client config service
│   │   └── guild-config.server.ts   # Server config service
│   ├── auth/                # Auth utilities
│   │   └── discord.ts       # Discord OAuth helpers
│   └── utils/               # Utility functions
│
├── public/
│   ├── icons/               # WoW icons
│   │   ├── classes/        # Class icons
│   │   ├── specs/          # Spec icons
│   │   ├── roles/          # Role icons
│   │   └── professions/    # Profession icons
│   └── logos/               # Expansion logos
│
├── e2e/                     # Playwright E2E tests
├── tests/                   # Vitest integration tests
├── docs/                    # Documentation
└── scripts/                 # Build scripts
```

## Data Flow

### Authentication Flow
1. User clicks Discord login
2. OAuth redirects to Discord
3. Callback validates and creates session
4. First setup user becomes Super Admin
5. Discord roles map to admin permissions

### State Management Pattern
- **Server State**: Firebase Firestore (guild config, roster)
- **Client State**: Zustand stores (filtering, sorting, UI state)
- **Context**: React Context for dependency injection (GuildContext, AdminContext)

### Theme System
- CSS variables defined in `globals.css`
- Theme presets in `lib/constants/theme-presets.ts`
- Runtime switching via CSS variable updates
- Dark/light mode via `next-themes` + `.dark` class

## Key Interfaces

### GuildConfig
Central configuration containing:
- `metadata`: Guild name, server, region, faction, expansion
- `theme`: Colors, logo, fonts, preset selection
- `discord`: Discord settings and role mappings
- `features`: Feature flags

### RosterMember
Member data including:
- Character info (name, class, spec, role, race)
- Guild info (rank, join date)
- Player association (playerName, claimedBy)
- Game progress (attunements, professions, attendance)
- Alt characters

## Firebase Collections
- `guilds/{guildId}` - Guild configuration
- `roster/{memberId}` - Roster members
- `userProfiles/{discordId}` - User profiles
- `characterRequests/{requestId}` - Character claim requests
