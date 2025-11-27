# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**GuildManager** is a full-stack web application built with Next.js 15. This monorepo combines a public-facing website, admin dashboard, and integrated headless CMS for content management.
It provides a customizeable guild management system for a World of Warcraft guild.

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