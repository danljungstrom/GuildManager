<objective>
Refactor the setup wizard implementation to fix critical issues identified in the evaluation and simplify the initial setup flow to focus only on essential configuration.

This refactoring will:
- Fix type mismatches and broken functionality
- Simplify the wizard to defer detailed guild configuration to a later stage
- Replace custom theme inputs with preset selection
- Improve state management and security
- Ensure production-ready code quality

The goal is a streamlined, bug-free initial setup that gets guilds up and running quickly, with advanced customization available post-setup.
</objective>

<context>
The current setup wizard has several critical issues that must be addressed:

**Critical Issues to Fix:**
1. Type mismatch: `secondaryColor` vs `accentColor` causing data to save incorrectly
2. Broken color picker: hex-to-HSL conversion logic doesn't work (SetupWizard.tsx:194-220)
3. Poor state management: uses `window.location.reload()` instead of proper React context refresh
4. Security vulnerability: no authentication on admin routes, Firestore rules allow public writes

**Design Changes:**
- Remove guild metadata fields (region, faction, expansion) from initial setup - these will be configured later in admin settings
- Replace custom color inputs with theme preset selection
- Add clear messaging that themes can be customized later
- Focus wizard on absolute minimum: guild name + theme preset

Reference CLAUDE.md for project conventions and existing architecture patterns.
</context>

<files_to_modify>
@components/setup/SetupWizard.tsx
@lib/types/guild-config.types.ts
@lib/contexts/GuildContext.tsx
@lib/services/guild-config.service.ts
@firestore.rules
@app/admin/settings/page.tsx
</files_to_modify>

<requirements>

## 1. Fix Type System Issues

**In lib/types/guild-config.types.ts:**
- Ensure consistent naming: use `accentColor` throughout (not `secondaryColor`)
- Verify all types match between `GuildConfig`, `GuildConfigInput`, and `ThemeConfig`
- Make guild metadata fields optional since they'll be configured later

## 2. Simplify Setup Wizard Flow

**In components/setup/SetupWizard.tsx:**

**Step 1: Guild Name Only**
- Single input field for guild name
- Clear, welcoming copy explaining this is a quick setup
- Note: "You can configure additional details like region, faction, and expansion later in admin settings"

**Step 2: Theme Preset Selection**
- Remove all individual color pickers and HSL inputs
- Create 4-6 predefined theme presets with descriptive names:
  - "Classic Gold" (current default gold/bronze theme)
  - "Horde Red" (red-based theme)
  - "Alliance Blue" (blue-based theme)
  - "Shadow Purple" (purple/dark theme)
  - "Nature Green" (green/earth tones)
  - "Frost Blue" (cool blue/white theme)
- Display presets as large, clickable cards showing color swatches
- Add note: "You can fully customize colors later in Theme Settings"
- Each preset should define all required theme colors (primary, accent, background, foreground, etc.)

**Step 3: Confirmation**
- Summary of selections
- "Complete Setup" button
- After completion, redirect to homepage (not admin settings)

## 3. Fix State Management

**Replace window.location.reload():**
- Remove all instances of `window.location.reload()`
- Use `refreshConfig()` from GuildContext instead
- Ensure context properly updates after configuration changes
- Add proper loading states during async operations

**In lib/contexts/GuildContext.tsx:**
- Verify `refreshConfig()` function properly re-fetches config from Firestore
- Ensure all consumers of context see updated values immediately
- Add error handling for failed refreshes

## 4. Implement Security Measures

**In firestore.rules:**
- Create rules that require authentication for writes to guild config
- Example structure:
  ```
  match /guilds/{guildId} {
    allow read: if true;  // Public read for guild info
    allow write: if request.auth != null;  // Require auth for writes
  }
  ```
- Add validation rules for required fields

**Note on authentication:**
- Document that Firebase Authentication should be implemented before production
- Add TODO comments in admin routes noting auth requirement
- For now, focus on Firestore rules to prevent public writes

## 5. Code Quality Improvements

**Remove broken color conversion logic:**
- Delete the non-functional hex-to-HSL conversion code (lines 194-220)
- Presets should directly provide HSL values
- No runtime color conversion needed

**Move magic strings to constants:**
- Create `lib/constants/firestore-paths.ts` for document paths
- Replace hardcoded `"guilds/default-guild"` with constant
- Make it easy to change config location in future

**Improve error handling:**
- Add try-catch blocks around Firebase operations
- Show user-friendly error messages
- Log detailed errors to console for debugging
- Handle case where Firebase is not configured (.env missing)

**Form validation:**
- Validate guild name is not empty
- Validate guild name length (e.g., 2-50 characters)
- Disable "Next" button until valid input provided
- Show validation errors inline

## 6. Create Theme Presets

**In lib/config/ or lib/constants/:**
- Create `theme-presets.ts` with predefined themes
- Each preset should be typed as `ThemeConfig`
- Include all required color properties in HSL format
- Use descriptive names and include a description field for each preset

Example structure:
```typescript
export const THEME_PRESETS: Record<string, ThemeConfig & { name: string; description: string }> = {
  classicGold: {
    name: "Classic Gold",
    description: "Warm gold and bronze tones",
    primaryColor: "45 70% 60%",
    accentColor: "30 80% 50%",
    // ... all other required colors
  },
  // ... other presets
}
```

</requirements>

<implementation_approach>

**Phase 1: Type System Fixes**
1. Update `guild-config.types.ts` to fix naming inconsistencies
2. Make metadata fields optional
3. Add theme preset types

**Phase 2: Create Theme Presets**
1. Create new file for theme presets with 6 predefined themes
2. Ensure all HSL values are valid and tested
3. Export preset data for use in wizard

**Phase 3: Refactor Setup Wizard**
1. Simplify to 3 steps (guild name, theme preset, confirmation)
2. Remove all guild metadata inputs
3. Remove color pickers and replace with preset selection cards
4. Update form state management to match new simpler structure
5. Replace `window.location.reload()` with `refreshConfig()`
6. Add proper validation and error handling

**Phase 4: Update Context & Service**
1. Verify `refreshConfig()` works correctly in GuildContext
2. Ensure service layer handles optional metadata fields
3. Update any default values to match new structure

**Phase 5: Security & Rules**
1. Create/update `firestore.rules` with authentication requirements
2. Add TODO comments in admin routes about auth
3. Add error handling for unauthorized writes

**Phase 6: Clean Up**
1. Remove unused imports and code
2. Add constants for magic strings
3. Verify TypeScript compiles without errors
4. Test the full wizard flow

</implementation_approach>

<constraints>

**Do not:**
- Remove the admin settings page (that's where full customization happens later)
- Change the overall architecture (contexts, services, Firebase setup)
- Add new dependencies unless absolutely necessary
- Implement full Firebase Authentication (note it as TODO for now)
- Modify the existing WoW components or design system

**Do:**
- Keep the code clean and maintainable
- Follow existing project patterns from CLAUDE.md
- Use TypeScript strictly (no `any` types)
- Maintain consistency with shadcn/ui component usage
- Write self-documenting code with clear variable names
- Add comments only where logic isn't self-evident

**Why these constraints matter:**
- We want to fix issues, not rebuild from scratch
- Authentication is a large feature that deserves its own implementation
- The admin settings page provides advanced customization post-setup
- Keeping dependencies minimal reduces maintenance burden
- Consistency with existing patterns makes the codebase easier to maintain

</constraints>

<output>

**Modified files:**
- `./components/setup/SetupWizard.tsx` - Simplified 3-step wizard with preset selection
- `./lib/types/guild-config.types.ts` - Fixed type inconsistencies, optional metadata
- `./lib/contexts/GuildContext.tsx` - Ensure refreshConfig works properly
- `./lib/services/guild-config.service.ts` - Handle optional fields correctly
- `./firestore.rules` - Security rules requiring authentication for writes

**New files:**
- `./lib/constants/theme-presets.ts` - Predefined theme configurations
- `./lib/constants/firestore-paths.ts` - Centralized Firestore path constants

**Updated if exists:**
- `./app/admin/settings/page.tsx` - Add TODO comments about authentication requirement

</output>

<verification>

Before declaring complete, verify:

1. **TypeScript compilation succeeds** with no errors
2. **Test the wizard flow:**
   - Navigate to root page when no config exists
   - Complete Step 1 with guild name validation
   - Select a theme preset in Step 2
   - Confirm and complete setup
   - Verify config is saved to Firestore correctly
   - Verify page refreshes/updates to show configured guild
3. **Verify state management:**
   - No `window.location.reload()` calls remain
   - Context updates properly after setup completion
4. **Check type consistency:**
   - All references use `accentColor` (not `secondaryColor`)
   - Types match across all files
5. **Security rules:**
   - Firestore rules file exists and requires auth for writes
6. **Code quality:**
   - No hardcoded paths (use constants)
   - No broken color conversion code
   - Proper error handling in all async operations

If you cannot test with a live Firebase instance, note what manual testing is needed.

</verification>

<success_criteria>

This refactoring is successful when:

- All critical issues from the evaluation are resolved
- Setup wizard has exactly 3 steps: name, theme preset, confirmation
- No guild metadata fields in initial setup
- 6 theme presets are available with preview
- All TypeScript types are consistent and correct
- State management uses React context refresh, not page reload
- Firestore security rules prevent unauthorized writes
- Code is clean, well-organized, and follows project conventions
- The wizard provides a smooth, quick setup experience
- Users are informed that advanced customization comes later

</success_criteria>

<testing_notes>

**Manual testing checklist:**

1. Start with no existing guild config in Firestore
2. Navigate to homepage - should show setup wizard
3. Step 1: Try invalid inputs (empty, too long) - should show validation
4. Step 1: Enter valid guild name - should allow progression
5. Step 2: Preview each theme preset - colors should display correctly
6. Step 2: Select a preset - should show as selected
7. Step 3: Review summary - should show correct name and theme
8. Step 3: Complete setup - should save to Firestore and update UI
9. Refresh page - should show configured guild (not wizard)
10. Check Firestore - config should have correct structure with accentColor (not secondaryColor)

**Security testing:**
- Attempt write to Firestore without auth - should fail with current rules

</testing_notes>
