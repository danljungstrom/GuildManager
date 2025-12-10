# GuildManager - Suggested Commands

## Development Commands

### Start Development Server
```bash
pnpm dev
```
Starts Next.js dev server with Turbopack.

### Start with Clean Build
```bash
pnpm devsafe
```
Removes `.next` folder and starts fresh (use if cache issues).

### Start with Firebase Emulator
```bash
pnpm dev:emulator
```
Runs both Firebase emulator and dev server concurrently.

## Build Commands

### Production Build
```bash
pnpm build
```
Creates optimized production build.

### Start Production Server
```bash
pnpm start
```
Runs the production build.

## Code Quality

### Lint Code
```bash
pnpm lint
```
Runs ESLint with Next.js config.

## Testing

### Run All Tests
```bash
pnpm test
```
Runs both Vitest integration tests and Playwright E2E tests.

### Run Integration Tests Only
```bash
pnpm test:int
```
Runs Vitest tests (faster, unit/integration).

### Run E2E Tests Only
```bash
pnpm test:e2e
```
Runs Playwright browser tests.

## Firebase

### Start Firebase Emulator
```bash
pnpm emulator
```
Starts Firebase emulators standalone.

## Utility Scripts

### Build Icon Tags
```bash
pnpm build:icon-tags
```
Regenerates icon tag metadata from assets.

## Windows-Specific Notes

Since this project runs on Windows, use these alternatives for common Unix commands:
- `ls` → `dir` or use PowerShell `Get-ChildItem`
- `rm -rf` → `rmdir /s /q` or PowerShell `Remove-Item -Recurse -Force`
- `cat` → `type` or PowerShell `Get-Content`
- `grep` → `findstr` or PowerShell `Select-String`
- `find` → `dir /s` or PowerShell `Get-ChildItem -Recurse`

Git commands work the same on Windows.
