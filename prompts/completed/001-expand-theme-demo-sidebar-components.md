<objective>
Expand the theme-demo section with a persistent sidebar navigation, comprehensive component demo pages for Input, Switch, Badge, Button, Dropdown Menu, Tab Nav Links, and Breadcrumb components, plus a new Config category for theme configuration management.

This expansion will transform the theme-demo into a complete design system documentation site, making it easier for developers to explore components, understand variants, and customize the theme.
</objective>

<context>
Project: GuildManager - Next.js 15 app with shadcn/ui components and Tailwind CSS v4
Current state: Basic theme-demo exists at `/theme-demo` with an overview page showing sections
Goal: Create a comprehensive design system showcase with persistent navigation

Tech stack:
- Next.js 15 App Router
- shadcn/ui components (Radix UI primitives)
- Tailwind CSS v4 with CSS custom properties
- TypeScript

Read the CLAUDE.md file for project conventions and coding standards.
</context>

<requirements>
1. **Persistent Sidebar Navigation**
   - Create a layout component for `/theme-demo` that includes a persistent sidebar
   - Sidebar should display all sections: Tokens, Typography, Components (Input, Switch, Badge, Button, Dropdown Menu, Tab Nav Links, Breadcrumb), Config, and Reference
   - Highlight the active page in the sidebar navigation
   - Make sidebar responsive (collapsible on mobile, persistent on desktop)
   - Use lucide-react icons from the existing sections array

2. **Component Demo Pages**
   Create comprehensive demo pages for each component:
   - **Input** (`/theme-demo/components/input`)
   - **Switch** (`/theme-demo/components/switch`)
   - **Badge** (`/theme-demo/components/badge`)
   - **Button** (`/theme-demo/components/button`)
   - **Dropdown Menu** (`/theme-demo/components/dropdown-menu`)
   - **Tab Nav Links** (`/theme-demo/components/tab-nav-links`)
   - **Breadcrumb** (`/theme-demo/components/breadcrumb`)

   Each component page should include:
   - All available variants with labels
   - All available sizes (if applicable)
   - Different states: default, hover, disabled, loading (if applicable), error (if applicable)
   - Usage examples with inline code snippets showing the component code
   - Props documentation table
   - Accessibility notes

3. **Config Category Pages**
   Create a config section at `/theme-demo/config` with:
   - **Color Editor** (`/theme-demo/config/colors`): Interactive controls to edit CSS custom properties in real-time with live preview
   - **Theme Preview** (`/theme-demo/config/preview`): Show how theme changes affect all components simultaneously
   - **Presets** (`/theme-demo/config/presets`): Pre-built theme presets (default light, default dark, and 2-3 custom color schemes)

4. **Route Organization**
   - Update `/theme-demo/page.tsx` to work with the new sidebar layout
   - Create all necessary route files following Next.js 15 App Router conventions
   - Ensure proper file structure under `/app/theme-demo/`
</requirements>

<implementation>
**File Structure to Create:**
```
app/theme-demo/
├── layout.tsx                          # New persistent sidebar layout
├── page.tsx                            # Updated overview page
├── _components/
│   ├── sidebar.tsx                     # Sidebar navigation component
│   ├── component-demo-layout.tsx       # Reusable layout for component demos
│   └── code-block.tsx                  # Component to display code examples
├── components/
│   ├── input/
│   │   └── page.tsx
│   ├── switch/
│   │   └── page.tsx
│   ├── badge/
│   │   └── page.tsx
│   ├── button/
│   │   └── page.tsx
│   ├── dropdown-menu/
│   │   └── page.tsx
│   ├── tab-nav-links/
│   │   └── page.tsx
│   └── breadcrumb/
│       └── page.tsx
└── config/
    ├── colors/
    │   └── page.tsx
    ├── preview/
    │   └── page.tsx
    └── presets/
        └── page.tsx
```

**Design Patterns:**
- Use the existing `SectionHeader` component from `./_components/shared` for page headers
- Follow the existing theme-demo styling patterns (card-based layouts, proper spacing)
- Utilize CSS variables for all colors (no hard-coded values)
- Ensure all components are responsive and accessible
- For code examples, use proper syntax highlighting if possible, or clean formatting at minimum

**Component Showcase Guidelines:**
- Display variants in a grid layout for easy comparison
- Use descriptive labels for each variant/state
- Show realistic examples (e.g., buttons with actual text, badges with status labels)
- Include both light and dark mode examples where relevant
- For interactive components (Switch, Dropdown, etc.), ensure they're fully functional in the demo

**Config Section Guidelines:**
- Color editor should allow editing HSL values for each CSS variable
- Use controlled inputs with real-time preview
- Theme preview should show a condensed view of multiple components updating live
- Presets should be one-click apply with immediate visual feedback
- Consider using Zustand for managing theme state if needed for the config section

**WHY these patterns matter:**
- Persistent sidebar: Users need to quickly navigate between component examples without returning to the overview
- Comprehensive examples: Developers need to see all variants to understand what's available and how to use them
- Interactive config: Theme customization is a key feature of GuildManager, so the demo should showcase this capability
- Code examples: Developers need to copy-paste working code, not guess at the API
</implementation>

<output>
Create/modify the following files:

1. **Layout and Navigation:**
   - `./app/theme-demo/layout.tsx` - Persistent sidebar layout wrapper
   - `./app/theme-demo/_components/sidebar.tsx` - Sidebar navigation component
   - `./app/theme-demo/_components/component-demo-layout.tsx` - Reusable component demo wrapper
   - `./app/theme-demo/_components/code-block.tsx` - Code example display component

2. **Component Demo Pages:**
   - `./app/theme-demo/components/input/page.tsx`
   - `./app/theme-demo/components/switch/page.tsx`
   - `./app/theme-demo/components/badge/page.tsx`
   - `./app/theme-demo/components/button/page.tsx`
   - `./app/theme-demo/components/dropdown-menu/page.tsx`
   - `./app/theme-demo/components/tab-nav-links/page.tsx`
   - `./app/theme-demo/components/breadcrumb/page.tsx`

3. **Config Pages:**
   - `./app/theme-demo/config/colors/page.tsx`
   - `./app/theme-demo/config/preview/page.tsx`
   - `./app/theme-demo/config/presets/page.tsx`

4. **Update Overview:**
   - `./app/theme-demo/page.tsx` - Update to work with new sidebar layout (if needed)
</output>

<verification>
Before declaring complete, verify your work:

1. **Navigation:**
   - Start dev server and navigate to `/theme-demo`
   - Verify sidebar appears and is persistent across all pages
   - Click through all sidebar links and confirm navigation works
   - Test responsive behavior (collapse sidebar on mobile)
   - Confirm active state highlighting works correctly

2. **Component Pages:**
   - Visit each component demo page
   - Verify all variants are displayed correctly
   - Confirm code examples are readable and accurate
   - Test interactive components (switches toggle, dropdowns open, etc.)
   - Check that all examples render in both light and dark mode

3. **Config Section:**
   - Test color editor: Change a CSS variable and verify live preview works
   - Try theme presets: Click each preset and confirm theme changes
   - Check theme preview: Verify components update in real-time

4. **Build:**
   - Run `pnpm build` to ensure no TypeScript errors
   - Confirm all routes build successfully

5. **Accessibility:**
   - Verify sidebar navigation is keyboard accessible
   - Check that interactive demos are keyboard navigable
   - Ensure proper heading hierarchy on all pages
</verification>

<success_criteria>
- Persistent sidebar navigation appears on all `/theme-demo/*` pages with proper active state
- All 7 component demo pages are comprehensive with variants, states, and code examples
- Config section has 3 functional pages: colors, preview, and presets
- All pages follow existing theme-demo design patterns and use CSS variables
- Navigation is responsive and works on mobile and desktop
- No TypeScript errors, build succeeds
- All interactive elements work correctly (switches, dropdowns, color editor, etc.)
</success_criteria>

<research>
Before implementing, examine these files:
- `./app/theme-demo/page.tsx` - Understand current overview structure and sections array
- `./app/theme-demo/_components/shared.tsx` - Review SectionHeader component
- `./app/globals.css` - Review all CSS custom properties for color editor
- `./components/ui/button.tsx` - Example of a shadcn/ui component to document
- `./components/ui/input.tsx` - Check available props and variants
- `./lib/types/guild-config.types.ts` - Review ThemeConfig type for theme structure
</research>

<guidance>
For maximum efficiency, whenever you need to perform multiple independent operations (like creating separate component demo pages), invoke all relevant tools simultaneously rather than sequentially.

After reading the existing files, carefully plan the implementation to ensure consistency with the existing codebase patterns.

Go beyond the basics to create a fully-featured design system showcase that developers will find genuinely useful. Include thoughtful examples, clear documentation, and delightful interactions.
</guidance>
