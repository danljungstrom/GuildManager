<objective>
Improve the visual contrast and differentiation of theme presets (excluding gold) and add theme icon/logo functionality with SVG defaults and custom image upload support.

This enhancement will:
- Increase background/card contrast in non-gold themes to match gold's visual clarity
- Create custom SVG icons for each of the 6 theme presets
- Add logo/icon display functionality in the guild configuration
- Support custom logo uploads with optional frame/border for non-transparent images
- Ensure all themes have clear visual hierarchy and component separation

The goal is to make all themes as visually appealing and clear as the gold theme, while adding branding capabilities through theme-specific icons and custom logos.
</objective>

<context>
The current theme presets have been implemented with 6 options:
- **Gold** - Has good contrast, components are clearly differentiated
- **Horde, Alliance, Shadow, Nature, Frost** - Need improved contrast to match gold's clarity

The project uses:
- Tailwind CSS with CSS custom properties (HSL format)
- Theme presets stored in `lib/constants/theme-presets.ts`
- Dark mode support via `.dark` class
- shadcn/ui components for consistent styling

Reference CLAUDE.md for project conventions and color system architecture.
</context>

<files_to_examine>
@lib/constants/theme-presets.ts
@app/globals.css
@lib/types/guild-config.types.ts
@components/setup/SetupWizard.tsx
</files_to_examine>

<requirements>

## 1. Improve Theme Contrast (Non-Gold Themes Only)

**Goal:** Match the visual clarity and component differentiation of the gold theme.

**For each non-gold theme (horde, alliance, shadow, nature, frost):**

### Light Mode Adjustments
- **Card backgrounds** should have clear contrast against `--background`
- **Borders** should be visible but not harsh
- **Muted backgrounds** should be clearly distinguishable from card backgrounds
- **Secondary** colors should provide visual separation

### Dark Mode Adjustments
- Increase contrast between `--card`, `--background`, and `--muted`
- Ensure borders are visible in dark mode
- Maintain accessibility standards (WCAG AA minimum)

### Specific Guidelines
- **Background to Card:** Minimum 5% lightness difference in HSL
- **Card to Muted:** Clear visual distinction
- **Border visibility:** Should be noticeable but not dominate
- **Text contrast:** All foreground colors must pass WCAG AA against their backgrounds

**Do not modify the gold theme** - it already has good contrast and serves as the reference.

## 2. Create SVG Theme Icons

**Create 6 simple, distinctive SVG icons** (one per theme) that represent each theme's identity:

### Icon Design Requirements
- **Size:** 64x64px viewBox, scalable SVG
- **Style:** Simple, clean, recognizable at small sizes
- **Colors:** Use each theme's primary color in the SVG
- **Format:** Inline SVG strings (not external files)
- **Thematic:** Each icon should reflect its theme name

### Suggested Icon Concepts
- **Gold:** Crown, treasure chest, or coin
- **Horde:** Horde symbol/crest or axe
- **Alliance:** Alliance crest or shield
- **Shadow:** Skull, void symbol, or crescent moon
- **Nature:** Leaf, tree, or flower
- **Frost:** Snowflake, ice crystal, or frost pattern

### Implementation
Create a new file: `lib/constants/theme-icons.ts`

```typescript
export interface ThemeIcon {
  id: string;
  svg: string; // Inline SVG markup
  name: string;
}

export const THEME_ICONS: Record<string, ThemeIcon> = {
  gold: {
    id: 'gold',
    name: 'Gold',
    svg: `<svg viewBox="0 0 64 64" ...>...</svg>`
  },
  // ... other themes
}
```

## 3. Add Logo/Icon Support to Guild Configuration

### Update Type Definitions
**In `lib/types/guild-config.types.ts`:**

Add to `ThemeConfig` interface:
```typescript
interface ThemeConfig {
  colors: ThemeColors;
  darkMode?: boolean;
  logo?: string; // URL to custom logo image OR theme icon ID
  logoType?: 'theme-icon' | 'custom-image';
  logoFrame?: boolean; // Apply border frame if logo lacks transparency
  favicon?: string;
  customCSS?: string;
  borderRadius?: string;
}
```

### Logo Display Component

Create `components/ui/guild-logo.tsx`:

**Features:**
- Display theme icon SVG if `logoType === 'theme-icon'`
- Display custom image if `logoType === 'custom-image'`
- Apply optional frame/border for images without transparency
- Responsive sizing (small, medium, large variants)
- Fallback to theme icon if custom image fails to load

**Props:**
```typescript
interface GuildLogoProps {
  size?: 'sm' | 'md' | 'lg';
  showFrame?: boolean;
  className?: string;
}
```

### Update Setup Wizard

**In `components/setup/SetupWizard.tsx`:**
- Display theme icon in each preset card
- Show selected theme's icon in confirmation step
- Initialize guild config with theme icon as default logo

## 4. Custom Logo Upload (Future-Proofing)

While full upload functionality will be implemented later, prepare the structure:

### Admin Settings Placeholder

**In `app/admin/settings/page.tsx`:**
- Add a "Logo & Branding" section
- Show current logo (theme icon or custom)
- Add TODO comment for future upload functionality:
  ```typescript
  // TODO: Implement custom logo upload
  // - File input accepting PNG, JPG, SVG, WebP
  // - Image preview with frame toggle
  // - Upload to Firebase Storage
  // - Update guild config with logo URL
  // - Automatic transparency detection
  ```

### Logo Frame Styling

Create utility for logo frames in `lib/utils/logo-frame.ts`:
```typescript
export function getLogoFrameStyles(hasTransparency: boolean, themeColor: string) {
  if (hasTransparency) return {};
  return {
    border: `3px solid hsl(${themeColor})`,
    borderRadius: '8px',
    padding: '8px',
    backgroundColor: 'hsl(var(--background))',
  };
}
```

</requirements>

<implementation_approach>

**Phase 1: Analyze and Improve Contrast**
1. Review gold theme's HSL values (light and dark modes)
2. For each non-gold theme, adjust:
   - `--card` values to ensure clear separation from `--background`
   - `--muted` to be visibly different from `--card`
   - `--border` to be noticeable but subtle
   - `--secondary` for proper hierarchy
3. Test adjustments visually (can describe needed manual verification)

**Phase 2: Create Theme Icons**
1. Design 6 simple SVG icons (64x64 viewBox)
2. Use theme primary colors in the SVGs
3. Create `lib/constants/theme-icons.ts` with icon definitions
4. Export helper functions to get icons by theme ID

**Phase 3: Add Logo Components**
1. Update `ThemeConfig` type with logo fields
2. Create `components/ui/guild-logo.tsx` component
3. Create logo frame utility in `lib/utils/`
4. Test logo display with theme icons

**Phase 4: Integrate with Setup Wizard**
1. Import theme icons in SetupWizard
2. Display icon in each theme preset card
3. Show selected theme icon in confirmation
4. Pass theme icon as default logo to config initialization

**Phase 5: Admin Settings Structure**
1. Add logo section to admin settings
2. Display current logo
3. Add frame toggle for future use
4. Add comprehensive TODO for upload implementation

**Phase 6: Testing and Verification**
1. Check contrast improvements in all themes (light/dark)
2. Verify icons display correctly
3. Test logo component with different sizes
4. Ensure type safety throughout

</implementation_approach>

<constraints>

**Do not:**
- Modify the gold theme colors (it's the reference standard)
- Implement actual file upload functionality (just prepare the structure)
- Use external icon libraries (create custom SVGs)
- Change the overall theme structure or architecture
- Add new dependencies

**Do:**
- Ensure all color changes maintain WCAG AA accessibility
- Keep SVG icons simple and recognizable
- Make logo component reusable across the app
- Follow existing project patterns from CLAUDE.md
- Use TypeScript strictly (no `any` types)
- Test both light and dark modes

**Why these constraints matter:**
- Gold theme already works well and serves as our target
- File upload needs proper backend integration (separate feature)
- Custom SVGs keep bundle size small and maintain brand consistency
- Accessibility ensures the app is usable by everyone
- Existing patterns maintain codebase consistency

</constraints>

<output>

**Modified files:**
- `./lib/constants/theme-presets.ts` - Improved contrast for non-gold themes
- `./lib/types/guild-config.types.ts` - Added logo/icon fields to ThemeConfig
- `./components/setup/SetupWizard.tsx` - Display theme icons in preset cards
- `./app/admin/settings/page.tsx` - Added logo section with TODO for upload

**New files:**
- `./lib/constants/theme-icons.ts` - SVG icon definitions for all 6 themes
- `./components/ui/guild-logo.tsx` - Logo display component with frame support
- `./lib/utils/logo-frame.ts` - Logo frame styling utilities

</output>

<verification>

Before declaring complete, verify:

1. **Visual Contrast Check:**
   - Compare each non-gold theme side-by-side with gold
   - Ensure card backgrounds are clearly distinct from page backgrounds
   - Check borders are visible in both light and dark modes
   - Verify text remains readable (use browser dev tools contrast checker)

2. **Icon Quality:**
   - All 6 SVG icons render correctly
   - Icons are recognizable at 24px, 32px, and 64px sizes
   - SVG code is valid and properly formatted
   - Icons use appropriate theme colors

3. **Component Integration:**
   - GuildLogo component displays theme icons correctly
   - Frame toggle works when enabled
   - Size variants (sm, md, lg) render appropriately
   - Setup wizard shows icons in theme preset cards

4. **Type Safety:**
   - TypeScript compiles without errors
   - All new types are properly defined
   - No `any` types introduced

5. **Accessibility:**
   - Use a contrast checker on the updated themes
   - Verify WCAG AA compliance for all text/background combinations
   - Test in both light and dark modes

If you cannot test with a live preview, note what manual verification is needed.

</verification>

<success_criteria>

This enhancement is successful when:

- All non-gold themes have improved contrast matching gold's clarity
- Card, background, muted, and border colors are clearly distinguishable
- 6 unique, high-quality SVG icons exist for all theme presets
- GuildLogo component displays both theme icons and custom images
- Logo frame functionality is implemented for non-transparent images
- Setup wizard displays theme icons in preset selection
- Admin settings has logo section with clear TODOs for upload
- All TypeScript types are correct and comprehensive
- Both light and dark modes maintain good contrast
- WCAG AA accessibility standards are met
- Code follows project conventions and is well-documented

</success_criteria>

<examples>

**Example contrast improvement for Horde theme:**

Before (poor contrast):
```typescript
light: {
  background: '0 0% 100%',
  card: '0 0% 100%',        // Same as background - bad!
  muted: '0 0% 96%',        // Too similar to card
  border: '0 0% 90%',       // Barely visible
}
```

After (improved contrast):
```typescript
light: {
  background: '0 0% 98%',   // Slightly darker background
  card: '0 0% 100%',        // White cards pop against background
  muted: '0 5% 94%',        // More saturated, clearer distinction
  border: '0 15% 85%',      // More visible, warm tone
}
```

**Example SVG icon (Gold - Crown):**
```typescript
gold: {
  id: 'gold',
  name: 'Gold',
  svg: `<svg viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg">
    <path d="M8 40h48l-8-24-8 8-8-16-8 16-8-8z" fill="hsl(41 40% 60%)" />
    <rect x="8" y="40" width="48" height="12" rx="2" fill="hsl(41 50% 50%)" />
    <circle cx="16" cy="46" r="2" fill="hsl(41 70% 70%)" />
    <circle cx="32" cy="46" r="2" fill="hsl(41 70% 70%)" />
    <circle cx="48" cy="46" r="2" fill="hsl(41 70% 70%)" />
  </svg>`
}
```

</examples>

<testing_notes>

**Manual testing checklist:**

1. **Theme Contrast:**
   - View setup wizard in each theme (horde, alliance, shadow, nature, frost)
   - Toggle between light and dark modes
   - Verify cards stand out from backgrounds
   - Check border visibility
   - Compare to gold theme's clarity

2. **Theme Icons:**
   - Navigate to setup wizard Step 2
   - Verify each theme card shows its icon
   - Icons should be visible and recognizable
   - Icons should use theme colors appropriately

3. **Logo Component:**
   - Import and render GuildLogo in a test page
   - Try all size variants (sm, md, lg)
   - Toggle frame on/off
   - Verify fallback behavior

4. **Accessibility:**
   - Use browser dev tools or a contrast checker
   - Test all text on backgrounds in each theme
   - Ensure minimum 4.5:1 contrast ratio for normal text
   - Test with screen reader if possible

</testing_notes>
