<objective>
Add theme-specific typography to the design system, making fonts a core part of each theme's identity alongside colors and icons.

This enhancement will:
- Integrate Google Fonts via next/font for optimal loading and performance
- Assign unique heading fonts to each of the 6 themes (Gold, Horde, Alliance, Shadow, Nature, Frost)
- Use a shared, high-quality body font across all themes for consistency
- Add font CSS variables to the theme system
- Update theme presets to include typography configurations
- Apply fonts throughout the application automatically based on selected theme

The goal is to strengthen each theme's visual identity through carefully curated typography that complements the theme's color palette and character.
</objective>

<context>
The project currently uses:
- Next.js 15 with App Router
- Google Fonts via next/font/google (currently: Geist and Geist Mono)
- 6 theme presets: Gold, Horde, Alliance, Shadow, Nature, Frost
- CSS custom properties for theming
- Theme presets in `lib/constants/theme-presets.ts`
- Live theme preview in setup wizard

Each theme has a distinct personality:
- **Gold**: Classic, elegant, legendary loot aesthetic
- **Horde**: Bold, aggressive, warrior-like
- **Alliance**: Noble, honorable, regal
- **Shadow**: Dark, mysterious, arcane
- **Nature**: Organic, earthy, druidic
- **Frost**: Cold, precise, crystalline

Reference CLAUDE.md for project conventions.
</context>

<files_to_examine>
@app/layout.tsx
@lib/constants/theme-presets.ts
@lib/types/guild-config.types.ts
@app/globals.css
@tailwind.config.ts
</files_to_examine>

<requirements>

## 1. Font Selection and Integration

### Shared Body Font
Choose ONE high-quality, readable body font for all themes:
- **Requirements:** Excellent readability, good for body text, supports multiple weights
- **Suggestions:** Inter, Open Sans, Roboto, Source Sans Pro, or similar
- Load via next/font/google in `app/layout.tsx`
- Should have weights: 400 (normal), 500 (medium), 600 (semibold), 700 (bold)

### Theme-Specific Heading Fonts
Select distinct heading fonts that match each theme's character:

**Gold Theme:**
- Character: Elegant, refined, classic
- Suggestions: Cinzel, Playfair Display, Cormorant, Libre Baskerville
- Should feel: Timeless, sophisticated, prestigious

**Horde Theme:**
- Character: Bold, aggressive, strong
- Suggestions: Teko, Saira Condensed, Oswald, Bebas Neue
- Should feel: Powerful, imposing, militant

**Alliance Theme:**
- Character: Noble, regal, honorable
- Suggestions: Crimson Text, EB Garamond, Merriweather, Lora
- Should feel: Dignified, traditional, authoritative

**Shadow Theme:**
- Character: Mysterious, arcane, gothic
- Suggestions: Creepster, Syne, Space Grotesk, Rubik
- Should feel: Dark, enigmatic, otherworldly

**Nature Theme:**
- Character: Organic, earthy, natural
- Suggestions: Quicksand, Comfortaa, Nunito, Varela Round
- Should feel: Warm, approachable, flowing

**Frost Theme:**
- Character: Clean, precise, cold
- Suggestions: Orbitron, Exo 2, Rajdhani, Michroma
- Should feel: Sharp, technical, crystalline

**Important:** Thoroughly consider multiple fonts for each theme and select the best match. Explain your reasoning for each choice.

## 2. Next.js Font Integration

**In `app/layout.tsx`:**

```typescript
import { Inter } from 'next/font/google'; // Example body font
import { Cinzel, Teko, Crimson_Text, /* etc */ } from 'next/font/google';

// Body font (shared across all themes)
const bodyFont = Inter({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-body',
  display: 'swap',
});

// Theme heading fonts
const goldHeading = Cinzel({
  subsets: ['latin'],
  weight: ['400', '600', '700'],
  variable: '--font-heading-gold',
  display: 'swap',
});

// ... similar for other theme fonts

export default function RootLayout({ children }) {
  return (
    <html className={cn(
      bodyFont.variable,
      goldHeading.variable,
      hordeHeading.variable,
      // ... all theme font variables
    )}>
      {/* ... */}
    </html>
  );
}
```

## 3. Type System Updates

**In `lib/types/guild-config.types.ts`:**

Add typography configuration to theme types:

```typescript
export interface ThemeTypography {
  headingFont: string; // CSS variable name, e.g., 'var(--font-heading-gold)'
  bodyFont: string;    // CSS variable name, e.g., 'var(--font-body)'
}

export interface ThemePreset {
  id: string;
  name: string;
  description: string;
  colors: {
    light: ThemeColors;
    dark: ThemeColors;
  };
  typography: ThemeTypography; // Add this field
}
```

## 4. Update Theme Presets

**In `lib/constants/theme-presets.ts`:**

Add typography configuration to each theme preset:

```typescript
export const THEME_PRESETS: Record<string, ThemePreset> = {
  gold: {
    // ... existing config
    typography: {
      headingFont: 'var(--font-heading-gold)',
      bodyFont: 'var(--font-body)',
    },
  },
  // ... similar for all themes
};
```

## 5. CSS Variables and Application

**In `app/globals.css`:**

Add font family CSS variables:

```css
@layer base {
  :root {
    /* Body font - shared across all themes */
    --font-body: /* fallback */;

    /* Theme-specific heading fonts */
    --font-heading-gold: /* fallback */;
    --font-heading-horde: /* fallback */;
    --font-heading-alliance: /* fallback */;
    --font-heading-shadow: /* fallback */;
    --font-heading-nature: /* fallback */;
    --font-heading-frost: /* fallback */;

    /* Active theme font (will be set dynamically) */
    --font-heading: var(--font-heading-gold); /* default */
  }

  body {
    font-family: var(--font-body), system-ui, sans-serif;
  }

  h1, h2, h3, h4, h5, h6 {
    font-family: var(--font-heading), var(--font-body), system-ui, sans-serif;
  }
}
```

## 6. Dynamic Font Application in Setup Wizard

**In `components/setup/SetupWizard.tsx`:**

Update the theme preview effect to also apply fonts:

```typescript
useEffect(() => {
  const selectedPreset = themePresets.find(p => p.id === selectedThemeId);
  if (!selectedPreset) return;

  // ... existing color application code

  // Apply typography
  const root = document.documentElement;
  root.style.setProperty('--font-heading', selectedPreset.typography.headingFont);
}, [selectedThemeId, themePresets]);
```

## 7. Guild Config Service Updates

**In `lib/services/guild-config.service.ts`:**

Ensure the typography configuration is saved when initializing guild config:

```typescript
theme: {
  colors: themePreset.colors.light,
  typography: themePreset.typography, // Add this
  darkMode: false,
  // ... existing fields
}
```

## 8. Global Font Application

Create a utility or hook to apply theme fonts globally based on guild config:

**Option A: CSS class approach**
Add theme-specific classes in `globals.css`:

```css
.theme-gold { --font-heading: var(--font-heading-gold); }
.theme-horde { --font-heading: var(--font-heading-horde); }
/* etc */
```

**Option B: Dynamic style approach**
Apply via inline styles in layout or a theme provider component.

Choose the approach that best fits the existing architecture.

</requirements>

<implementation_approach>

**Phase 1: Font Research and Selection**
1. Research Google Fonts that match each theme's character
2. Test font pairings for readability and aesthetic
3. Consider font weight availability and Latin subset support
4. Document reasoning for each font choice

**Phase 2: Next.js Integration**
1. Import selected fonts in `app/layout.tsx`
2. Configure font options (subsets, weights, display, variables)
3. Add CSS variable class names to html element
4. Test font loading performance

**Phase 3: Type System**
1. Add `ThemeTypography` interface
2. Update `ThemePreset` type
3. Update `ThemeConfig` type if needed
4. Ensure type safety throughout

**Phase 4: Theme Presets**
1. Add typography config to all 6 theme presets
2. Map font CSS variables correctly
3. Test theme switching

**Phase 5: CSS Variables**
1. Add font variables to `globals.css`
2. Apply fonts to body and headings
3. Ensure proper fallback fonts
4. Test in both light and dark modes

**Phase 6: Dynamic Application**
1. Update SetupWizard preview effect
2. Ensure fonts change with theme selection
3. Update guild config service
4. Test live preview

**Phase 7: Global Application**
1. Decide on CSS class vs dynamic style approach
2. Implement chosen method
3. Apply theme font throughout app
4. Test on all pages

**Phase 8: Verification**
1. Test all 6 themes with their fonts
2. Verify font loading performance
3. Check accessibility (readability, contrast)
4. Test on different browsers

</implementation_approach>

<constraints>

**Do not:**
- Use more than 7 total Google Fonts (1 body + 6 headings) to keep bundle size reasonable
- Choose decorative/display fonts that sacrifice readability
- Use fonts that require multiple font files for basic weights (keep it lean)
- Modify the existing Geist/Geist Mono fonts (they're for code/UI)
- Change theme colors or other existing theme properties

**Do:**
- Prioritize web-safe fonts with good Google Fonts support
- Ensure all fonts have Latin subset and basic weights (400, 600, 700)
- Test font pairings for readability at different sizes
- Use `font-display: swap` for better loading performance
- Consider accessibility (font size, weight, contrast)
- Maintain consistency with existing project patterns

**Why these constraints matter:**
- Font loading impacts performance - fewer fonts = faster load times
- Readability is critical for a content-heavy guild management app
- Font-display: swap prevents FOIT (Flash of Invisible Text)
- Accessibility ensures the app is usable by all guild members
- Consistency makes the codebase maintainable

</constraints>

<output>

**Modified files:**
- `./app/layout.tsx` - Import and configure Google Fonts
- `./lib/types/guild-config.types.ts` - Add typography types
- `./lib/constants/theme-presets.ts` - Add typography to theme presets
- `./app/globals.css` - Add font CSS variables and application rules
- `./components/setup/SetupWizard.tsx` - Apply fonts in live preview
- `./lib/services/guild-config.service.ts` - Save typography in config

**Potentially modified:**
- `./tailwind.config.ts` - If font families need to be added to Tailwind theme

**No new files needed** - all changes integrate into existing architecture

</output>

<verification>

Before declaring complete, verify:

1. **Font Loading:**
   - All 7 fonts load correctly (inspect Network tab)
   - CSS variables are properly set in `:root`
   - Font files are optimized by next/font
   - No FOUT (Flash of Unstyled Text) occurs

2. **Visual Testing:**
   - Each theme displays its unique heading font
   - Body font is consistent across all themes
   - Fonts render correctly in both light and dark modes
   - Font weights work as expected (normal, semibold, bold)

3. **Theme Switching:**
   - Setup wizard preview changes fonts when theme is selected
   - Font changes are smooth and immediate
   - No layout shifts occur during font application

4. **Type Safety:**
   - TypeScript compiles without errors
   - All typography types are properly defined
   - No `any` types introduced

5. **Performance:**
   - Check Lighthouse score (should not significantly degrade)
   - Font loading is non-blocking
   - Page renders quickly with font-display: swap

6. **Accessibility:**
   - Text is readable at all sizes
   - Sufficient contrast with backgrounds
   - Fonts work well with screen readers
   - Line height and spacing are appropriate

7. **Cross-browser:**
   - Test in Chrome, Firefox, Safari
   - Verify fallback fonts work if Google Fonts fail to load

</verification>

<success_criteria>

This typography enhancement is successful when:

- All 6 themes have distinct, character-appropriate heading fonts
- One high-quality body font is shared across all themes
- Fonts load via next/font/google with optimal performance
- CSS variables enable dynamic font switching
- Setup wizard shows live font preview when themes are selected
- Typography is applied globally throughout the application
- All TypeScript types are correct and comprehensive
- Font loading does not negatively impact page performance
- Text maintains excellent readability and accessibility
- Code follows Next.js and project conventions
- Each theme's font choice strengthens its visual identity

</success_criteria>

<font_selection_guidance>

When selecting fonts, consider:

**Readability First:**
- Heading fonts should be distinctive but still readable
- Avoid overly decorative or hard-to-read fonts
- Test at multiple sizes (h1 through h6)

**Theme Alignment:**
- Font should reinforce the theme's character and mood
- Consider the WoW aesthetic (fantasy, medieval, modern, dark)
- Think about what guild members would expect for that theme

**Technical Requirements:**
- Must be available on Google Fonts
- Should have at least 3 weights (400, 600, 700)
- Latin subset is required
- Good hinting and rendering on screens

**Performance:**
- Prefer fonts with smaller file sizes
- Avoid fonts that require many weights or styles
- Use font-display: swap for better UX

**Examples of Good Pairings:**
- Gold: Cinzel (headings) + Inter (body) = Elegant and readable
- Horde: Teko (headings) + Inter (body) = Bold and modern
- Alliance: Crimson Text (headings) + Inter (body) = Noble and traditional

Take time to research and test fonts before finalizing selections. The right typography significantly impacts the theme's character and user experience.

</font_selection_guidance>
