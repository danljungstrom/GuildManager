# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**GuildManager** is a full-stack web application built with Next.js 15. It provides a customizable guild management system for World of Warcraft guilds, combining a public-facing website, admin dashboard, and integrated configuration system.

**Tech Stack:**
- Next.js 15 with App Router (React 19, TypeScript)
- Firebase Firestore (database)
- Discord OAuth (authentication)
- Vercel Hosting
- Tailwind CSS v4 with CSS custom properties
- shadcn/ui components (Radix UI primitives)
- Zustand for client-side state management
- Testing: Vitest (integration) + Playwright (E2E)
- Package manager: pnpm

## Common Commands

### Development

```bash
# Start development server (default)
pnpm dev

# Start dev server with clean build (if encountering cache issues)
pnpm devsafe

# Build for production
pnpm build

# Start production server
pnpm start
```

### Code Quality

```bash
# Lint code
pnpm lint

# Run all tests (integration + E2E)
pnpm test

# Run integration tests only (Vitest)
pnpm test:int

# Run E2E tests only (Playwright)
pnpm test:e2e
```

## Architecture

### Authentication Flow
- Discord OAuth is **required** for the setup wizard
- First user to complete setup becomes the site owner with Super Admin access
- Discord roles can be mapped to admin permissions in settings

### Key Pages
- `/` - Homepage/Dashboard
- `/roster` - Guild roster with filtering, sorting, and member management
- `/roster/professions` - Profession tracking
- `/raids` - Raid planning (placeholder)
- `/guild-info` - Guild information
- `/admin/settings` - Admin configuration panel
- `/theme-demo` - Design system showcase

### State Management
- **Zustand stores** in `lib/stores/`:
  - `roster-store.ts` - Roster members, filtering, sorting
- **React Context** in `lib/contexts/`:
  - `GuildContext` - Guild configuration
  - `AdminContext` - Authentication state

## Design System

### Theme Architecture

GuildManager uses CSS custom properties for runtime theme customization. All colors are defined in HSL format in `app/globals.css`.

**Key Features:**
- Dark/light mode support via `.dark` class
- Multiple theme presets (Spartan, Horde, Alliance, Shadow, Frost, Nature, Arcane)
- WoW-specific color schemes (class colors, role colors)
- Semantic color system for consistent UI

### Color Variables

**Base Colors:**
- `--primary` - Main brand color (varies by theme preset)
- `--secondary` - Secondary elements
- `--accent` - Highlights and accents
- `--background` / `--foreground` - Page backgrounds and text
- `--muted` - Muted backgrounds and text
- `--border` / `--input` - Form elements and borders

**WoW Class Colors:**
- `--class-druid` through `--class-warrior` - Official WoW class colors
- Utility classes: `.class-druid`, `.bg-class-druid`, etc.

**WoW Role Colors:**
- `--role-tank`, `--role-dps`, `--role-healer`
- Utility classes: `.role-tank`, `.bg-role-tank`, etc.

### Component Library

#### Base Components (shadcn/ui)
Located in `components/ui/`:
- Button, Card, Badge, Avatar
- Input, Label, Checkbox, Radio, Switch, Slider
- Dialog, Tabs, Select, Separator
- Table, DropdownMenu, AlertDialog

#### WoW-Specific Components
Located in `components/wow/`:

**ClassIcon** - Display WoW class icons with color coding
```tsx
<ClassIcon className="Warrior" variant="both" showText size="md" />
```
- `variant`: "icon" | "text" | "both"
- `showText`: Only shows text when variant="both" AND showText=true

**RoleIcon** - Display role indicators (Tank, DPS, Healer)
```tsx
<RoleIcon role="Tank" variant="both" showText size="md" />
```

**SpecIcon** - Display specialization icons
```tsx
<SpecIcon className="Priest" spec="Holy" showText size="md" />
```

**ProfessionIcon** - Display profession icons with skill levels
```tsx
<ProfessionIcon profession="Blacksmithing" skill={300} showText />
```

**AttendanceBadge** - Display raid attendance status
```tsx
<AttendanceBadge status="present" percentage={95} showPercentage />
```

#### Roster Components
Located in `components/roster/`:
- `RosterTable` - Main roster display with sorting, expandable rows
- `RosterFilters` - Class, role, rank, attunement filtering
- `RosterSearch` - Search by character/player name
- `RosterAdminForm` - Add/edit/delete roster members
- `CharacterDetail` - Detailed character view modal

#### Layout Components
Located in `components/layout/`:
- `SidebarNav` - Main navigation with collapsible submenus
- `AppSidebar` - Sidebar container with guild branding

### Type System

**Guild Configuration:**
- `GuildConfig` - Complete guild configuration
- `GuildMetadata` - Guild info (name, server, region, faction, expansion)
- `ThemeConfig` - Theme colors and styling preferences

**WoW Types:**
- `ClassType` - Type-safe WoW classes
- `RoleType` - Tank, DPS, Healer
- `Profession` - All WoW professions
- `WoWExpansion` - classic, tbc, wotlk, cata, retail

**Roster Types:**
- `RosterMember` - Complete member data
- `CreateRosterMember` - For creating new members
- `GuildRank` - Guild Master, Officer, Core, Trial, Social, Alt

### File Structure

```
├── app/                    # Next.js app directory
│   ├── globals.css        # Global styles with CSS variables
│   ├── layout.tsx         # Root layout
│   ├── page.tsx          # Homepage
│   ├── roster/           # Guild roster pages
│   │   ├── page.tsx      # Main roster with CRUD
│   │   └── professions/  # Profession tracking
│   ├── admin/
│   │   └── settings/     # Admin settings page
│   └── api/
│       └── auth/         # Discord OAuth endpoints
├── components/
│   ├── ui/               # shadcn/ui components
│   ├── wow/              # WoW-specific components
│   ├── roster/           # Roster management components
│   ├── layout/           # Layout components (sidebar, nav)
│   └── setup/            # Setup wizard components
├── lib/
│   ├── types/            # TypeScript type definitions
│   ├── consts/           # Constants (classes, roles, professions)
│   ├── constants/        # Theme presets
│   ├── contexts/         # React contexts
│   ├── stores/           # Zustand stores
│   ├── firebase/         # Firebase services
│   ├── auth/             # Discord auth helpers
│   ├── services/         # Business logic services
│   └── utils.ts          # Utility functions
└── public/
    ├── icons/            # Icon assets (classes, specs, roles, professions)
    └── logos/            # Expansion logos
```

### Development Guidelines

**Adding New Components:**
1. Use shadcn/ui for base UI elements
2. Create custom components in `components/wow/` for WoW-specific features
3. Use CSS variables for all colors (no hard-coded values)
4. Ensure TypeScript types are defined
5. Make components responsive by default

**Theme Customization:**
1. All theme colors are in `app/globals.css`
2. Theme presets are in `lib/constants/theme-presets.ts`
3. Colors use HSL format for CSS variables
4. Use `cn()` utility for conditional classes

**WoW Data:**
- Class/spec data: `lib/consts/classes.ts`
- Role data: `lib/consts/roles.ts`
- Profession data: `lib/consts/professions.ts`
- Expansion data: `lib/consts/expansions.ts`

**Firebase Integration:**
- Roster CRUD: `lib/firebase/roster.ts`
- Guild config: `lib/services/guild-config.service.ts`

### Environment Variables

Required for deployment:
```
# Firebase
NEXT_PUBLIC_FIREBASE_API_KEY=
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=
NEXT_PUBLIC_FIREBASE_PROJECT_ID=
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
NEXT_PUBLIC_FIREBASE_APP_ID=

# Discord OAuth
NEXT_PUBLIC_DISCORD_CLIENT_ID=
DISCORD_CLIENT_SECRET=
DISCORD_GUILD_ID=
```

### Current Feature Status

**Implemented:**
- Setup wizard with Discord auth
- Guild configuration system
- Theme presets and customization
- Roster management (add, edit, delete members)
- Roster filtering (class, role, rank, attunements)
- Roster sorting and search
- Class/role distribution charts
- Admin settings page
- Sidebar navigation with collapsible menus

**In Progress / Planned:**
- Raid planning system
- Profession tracking page
- Discord role-based permissions
- WarcraftLogs integration
