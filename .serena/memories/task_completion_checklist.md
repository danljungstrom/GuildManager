# GuildManager - Task Completion Checklist

When completing a task, run through this checklist:

## 1. Code Quality
- [ ] Run `pnpm lint` - fix any linting errors
- [ ] Ensure TypeScript types are correct (build should pass)
- [ ] No `any` types introduced

## 2. Testing
- [ ] Run `pnpm test:int` for integration tests
- [ ] Run `pnpm test:e2e` for E2E tests (if UI changes)
- [ ] Add tests for new functionality if appropriate

## 3. Build Verification
- [ ] Run `pnpm build` to ensure production build succeeds
- [ ] Check for build warnings

## 4. Style Consistency
- [ ] Use existing patterns and conventions
- [ ] Use CSS variables for colors (not hardcoded values)
- [ ] Follow component naming conventions

## 5. Type Safety
- [ ] Update types if data structures changed
- [ ] Ensure Zod schemas match TypeScript interfaces

## 6. Documentation (if applicable)
- [ ] Update CLAUDE.md if significant architectural changes
- [ ] Update component README if component behavior changed

## Quick Verification Command
```bash
pnpm lint && pnpm build && pnpm test
```

## Common Issues to Check
- Server/client component boundaries correct
- Firebase security rules updated if new collections
- Environment variables documented if new ones added
