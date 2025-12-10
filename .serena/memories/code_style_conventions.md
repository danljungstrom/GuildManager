# GuildManager - Code Style & Conventions

## TypeScript Conventions

### Strict Mode
- TypeScript strict mode is enabled
- All types should be explicit, avoid `any`
- Use `interface` for object shapes, `type` for unions/primitives

### Path Aliases
- Use `@/` for imports from project root
- Example: `import { Button } from '@/components/ui/button'`

### Naming Conventions
- **Components**: PascalCase (`RosterTable.tsx`)
- **Hooks**: camelCase with `use` prefix (`useKeyboardShortcuts.ts`)
- **Types**: PascalCase with descriptive suffixes (`RosterMember`, `ClassType`)
- **Constants**: SCREAMING_SNAKE_CASE (`CLASSES`, `GUILD_RANKS`)
- **Files**: kebab-case for utilities, PascalCase for components

## React Conventions

### Component Structure
- Functional components only
- Use arrow function syntax
- Props interface defined inline or in types file

### State Management
- Zustand stores in `lib/stores/`
- React Context in `lib/contexts/`
- Prefer Zustand for global state, Context for dependency injection

### Server vs Client Components
- Use `'use client'` directive only when needed
- Server Components by default in App Router
- Client components for interactivity, hooks, browser APIs

## CSS/Styling Conventions

### Tailwind CSS
- Use Tailwind utility classes
- Custom CSS variables in `app/globals.css`
- Use `cn()` utility for conditional class merging

### Theme Colors
- All colors use HSL format in CSS variables
- Never hardcode colors - use semantic variables
- Example: `bg-primary`, `text-muted-foreground`

### WoW-Specific Styling
- Class colors: `--class-warrior`, `--class-priest`, etc.
- Role colors: `--role-tank`, `--role-dps`, `--role-healer`
- Utility classes: `.class-warrior`, `.bg-class-warrior`

## Component Library

### shadcn/ui Components
- Located in `components/ui/`
- Don't modify core shadcn components
- Extend via composition or wrapper components

### WoW Components
- Located in `components/wow/`
- `ClassIcon`, `RoleIcon`, `SpecIcon`, `ProfessionIcon`, `AttendanceBadge`
- Use `variant`, `size`, `showText` props consistently

## File Organization

### Types
- Central type definitions in `lib/types/`
- Co-locate component-specific types with component

### Constants
- WoW data in `lib/consts/` (classes, roles, professions, expansions)
- Theme presets in `lib/constants/`
- Firestore paths in `lib/constants/firestore-paths.ts`

## ESLint Configuration
- Extends `next/core-web-vitals` and `next/typescript`
- No custom rules - follows Next.js defaults
