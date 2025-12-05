# GitHub Copilot Instructions

This file provides guidance to GitHub Copilot when working with code in this repository.

## Project Overview

**GuildManager** is a full-stack web application built with Next.js 15. This monorepo combines a public-facing website, admin dashboard, and integrated headless CMS for content management. It provides a customizable guild management system for a World of Warcraft guild.

**Tech Stack:**
- Next.js 15 with App Router (React 19, TypeScript)
- Firebase Firestore
- Vercel Hosting
- Lexical rich text editor
- Tailwind CSS v4 with CSS custom properties
- shadcn/ui components (Radix UI primitives)
- Zustand for client-side state management
- Testing: Vitest (integration) + Playwright (E2E)
- Package manager: pnpm

## Common Commands

### Development
- `pnpm dev` - Start development server
- `pnpm devsafe` - Start dev server with clean build (for cache issues)
- `pnpm build` - Build for production
- `pnpm start` - Start production server

### Code Quality
- `pnpm lint` - Lint code
- `pnpm test` - Run all tests (integration + E2E)
- `pnpm test:int` - Run integration tests only (Vitest)
- `pnpm test:e2e` - Run E2E tests only (Playwright)

## Design System

### Theme Architecture

GuildManager uses a comprehensive CSS custom properties system that enables runtime theme customization. All colors are defined in HSL format in `app/globals.css`.

**Key Features:**
- Dark/light mode support via `.dark` class
- Runtime color editing for guild customization
- WoW-specific color schemes (class colors, role colors)
- Semantic color system for consistent UI

### Color Variables

**Base Colors:**
- `--primary` - Main brand color (gold/bronze by default)
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

## Component Library

### Base Components (shadcn/ui)
Located in `components/ui/`: Button, Card, Badge, Avatar, Input, Label, Checkbox, Radio, Switch, Slider, Dialog, Tabs, Select, Separator

### WoW-Specific Components
Located in `components/wow/`:

**ClassIcon** - Display WoW class icons with color coding
```tsx
<ClassIcon className="Warrior" variant="both" showText size="md" />
```

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

## Type System

**Guild Configuration:**
- `GuildConfig` - Complete guild configuration
- `GuildMetadata` - Guild info (name, server, region, faction, expansion)
- `ThemeConfig` - Theme colors and styling preferences

**WoW Types:**
- `ClassType` - Type-safe WoW classes
- `RoleType` - Tank, DPS, Healer
- `Profession` - All WoW professions
- `WoWExpansion` - classic, tbc, wotlk, cata, retail

## File Structure

```
├── app/                    # Next.js app directory
│   ├── globals.css        # Global styles with CSS variables
│   ├── layout.tsx         # Root layout
│   ├── page.tsx          # Homepage
│   ├── theme-demo/       # Design system showcase
│   └── roster/           # Guild roster (placeholder)
├── components/
│   ├── ui/               # shadcn/ui components
│   ├── wow/              # WoW-specific components
│   └── theme-demo/       # Theme demo components
├── lib/
│   ├── types/            # TypeScript type definitions
│   ├── consts/           # Constants (classes, roles, professions)
│   ├── config/           # Configuration files
│   ├── mock/             # Mock data for development
│   └── utils.ts          # Utility functions
└── public/
    └── icons/            # Icon assets (classes, specs, roles, professions)
```

## Development Guidelines

### Adding New Components
1. Use shadcn/ui for base UI elements
2. Create custom components in `components/wow/` for WoW-specific features
3. Use CSS variables for all colors (no hard-coded values)
4. Ensure TypeScript types are defined
5. Make components responsive by default

### Theme Customization
1. All theme colors are in `app/globals.css`
2. Colors use HSL format for CSS variables
3. Guild config (future) will allow admin-editable themes
4. Use `cn()` utility for conditional classes

### WoW Data
- Class/spec data: `lib/consts/classes.ts`
- Role data: `lib/consts/roles.ts`
- Profession data: `lib/consts/professions.ts`
- Add new expansions in `lib/types/guild-config.types.ts`

## Code Style Preferences

- Use TypeScript strict mode
- Prefer functional components with hooks
- Use `cn()` from `lib/utils` for merging Tailwind classes
- Follow Next.js App Router conventions
- Keep components small and focused
- Co-locate related files when appropriate
