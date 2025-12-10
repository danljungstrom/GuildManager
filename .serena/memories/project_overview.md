# GuildManager Project Overview

## Purpose
GuildManager is a full-stack web application for World of Warcraft guild management. It provides:
- A customizable public-facing website for guilds
- Admin dashboard for configuration and member management
- Guild roster with filtering, sorting, and CRUD operations
- Theme customization with multiple WoW-themed presets
- Discord OAuth authentication and role mapping
- Profession and raid tracking (in progress)

## Tech Stack

### Core Framework
- **Next.js 16** with App Router (React 19, TypeScript)
- **Firebase Firestore** for database
- **Discord OAuth** for authentication
- **Vercel** hosting (target deployment)

### Frontend
- **Tailwind CSS v3.4** with CSS custom properties for theming
- **shadcn/ui** components (Radix UI primitives)
- **Zustand** for client-state management
- **next-themes** for dark/light mode
- **lucide-react** for icons
- **react-hook-form** + **zod** for form validation

### Testing
- **Vitest** for integration tests
- **Playwright** for E2E tests

### Package Manager
- **pnpm** (v10.24.0) - required

## Target Users
- WoW guild leaders and officers
- Guild members who want to view roster, attendance, professions
- Supports Classic WoW, TBC, WotLK, Cata, and Retail expansions

## Current Feature Status

### Implemented
- Setup wizard with Discord auth
- Guild configuration system
- Theme presets and customization
- Roster management (add, edit, delete)
- Roster filtering, sorting, search
- Class/role distribution charts
- Admin settings page
- Sidebar navigation

### In Progress / Planned
- Raid planning system
- Profession tracking page
- Discord role-based permissions
- WarcraftLogs integration
