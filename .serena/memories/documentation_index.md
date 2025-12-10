# GuildManager - Documentation Index

## Quick Navigation

### For Developers
| Document | Description | Location |
|----------|-------------|----------|
| Project Overview | Purpose, tech stack, features | Memory: `project_overview.md` |
| Architecture | Directory structure, data flow | Memory: `architecture_overview.md` |
| Code Style | Conventions, patterns, naming | Memory: `code_style_conventions.md` |
| Commands | Development, build, test commands | Memory: `suggested_commands.md` |
| Task Checklist | Post-task verification steps | Memory: `task_completion_checklist.md` |
| CLAUDE.md | AI assistant instructions | `CLAUDE.md` |

### For Deployment
| Document | Description | Location |
|----------|-------------|----------|
| Quick Start | 10-minute setup guide | `docs/QUICKSTART.md` |
| Setup Guide | Detailed walkthrough | `docs/SETUP_GUIDE.md` |
| Deployment Checklist | Pre/post deploy checklist | `docs/DEPLOYMENT_CHECKLIST.md` |
| Environment Variables | Required configuration | `docs/SETUP_GUIDE.md` |

### Domain Knowledge
| Document | Description | Location |
|----------|-------------|----------|
| WoW Data Reference | Classes, roles, expansions | Memory: `wow_data_reference.md` |
| Roster README | Roster components usage | `components/roster/README.md` |

## Environment Variables

### Firebase (Required)
```
NEXT_PUBLIC_FIREBASE_API_KEY
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN
NEXT_PUBLIC_FIREBASE_PROJECT_ID
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID
NEXT_PUBLIC_FIREBASE_APP_ID
```

### Discord OAuth (Required for Auth)
```
NEXT_PUBLIC_DISCORD_CLIENT_ID
DISCORD_CLIENT_SECRET
DISCORD_GUILD_ID
```

## Key File References

### Entry Points
- `app/layout.tsx` - Root layout with providers
- `app/page.tsx` - Homepage
- `app/globals.css` - Global styles and CSS variables

### Core Business Logic
- `lib/services/guild-config.service.ts` - Client config operations
- `lib/services/guild-config.server.ts` - Server config operations
- `lib/firebase/roster.ts` - Client roster CRUD
- `lib/firebase/roster.server.ts` - Server roster operations

### State Management
- `lib/stores/roster-store.ts` - Roster state (Zustand)
- `lib/stores/theme-store.ts` - Theme state (Zustand)
- `lib/contexts/GuildContext.tsx` - Guild config context
- `lib/contexts/AdminContext.tsx` - Auth context

### Type Definitions
- `lib/types/guild-config.types.ts` - Core configuration types
- `lib/types/roster.types.ts` - Roster member types
- `lib/types/classes.types.ts` - WoW class types
- `lib/types/roles.types.ts` - Role types
- `lib/types/professions.types.ts` - Profession types

### API Routes
- `app/api/auth/discord/` - Discord OAuth flow
- `app/api/auth/me/` - Current user info
- `app/api/auth/logout/` - Logout endpoint
- `app/api/upload/` - File upload handling

### Test Files
- `e2e/homepage.spec.ts` - Homepage E2E tests
- `e2e/roster.spec.ts` - Roster E2E tests
- `e2e/theme.spec.ts` - Theme E2E tests

## Component Quick Reference

### WoW Components (`components/wow/`)
- `ClassIcon` - Display WoW class with icon/text
- `RoleIcon` - Display Tank/DPS/Healer with icon
- `SpecIcon` - Display specialization with icon
- `ProfessionIcon` - Display profession with skill level
- `AttendanceBadge` - Display attendance status

### Roster Components (`components/roster/`)
- `RosterTable` - Main roster display with sorting
- `RosterFilters` - Class, role, rank filtering
- `RosterSearch` - Character/player search
- `RosterAdminForm` - Add/edit/delete members
- `CharacterDetail` - Detailed character modal

### UI Components (`components/ui/`)
- All shadcn/ui components (Button, Card, Dialog, etc.)
- Custom: `guild-logo`, `loading-spinner`, `tab-nav-links`

## Cross-References

### Theme System
- CSS Variables → `app/globals.css`
- Presets → `lib/constants/theme-presets.ts`
- Icons → `lib/constants/theme-icons.ts`
- Store → `lib/stores/theme-store.ts`
- Demo → `app/theme-demo/`

### Authentication Flow
- Discord OAuth → `lib/auth/discord.ts`
- API Routes → `app/api/auth/`
- Context → `lib/contexts/AdminContext.tsx`
- Gate Component → `components/auth/DiscordGate.tsx`

### Roster System
- Types → `lib/types/roster.types.ts`
- Firebase Client → `lib/firebase/roster.ts`
- Firebase Server → `lib/firebase/roster.server.ts`
- Store → `lib/stores/roster-store.ts`
- Components → `components/roster/`
- Page → `app/roster/page.tsx`
