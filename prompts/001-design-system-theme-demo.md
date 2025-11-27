<objective>
Create a comprehensive design system and theme demo for the GuildManager application, transforming it from a guild-specific Material UI implementation into a fully customizable system using shadcn/ui and Tailwind CSS.

This design system will serve as the foundation for a multi-guild, multi-expansion WoW management tool where administrators can customize colors, branding, and theming through an admin interface.
</objective>

<context>
The existing codebase (in the seios-aner repo within the workspace) contains a WoW guild management webpage built with Material UI. It was designed for a specific guild but needs to be generalized for any guild and expansion.

**Current Tech Stack:**
- Next.js 15 with App Router (React 19, TypeScript)
- Material UI components (to be replaced)
- Firebase Firestore
- Tailwind CSS v4 with CSS custom properties
- shadcn/ui components (Radix UI primitives)

**Key Requirements:**
- Maximum reusability and customizability
- Admin-editable color themes (colors should be configurable at runtime)
- Modern UI that references the old design but feels more polished
- Use Firestore emulator for development (no live database yet)
- Step-by-step approach focusing on design system first

Before implementing, review the existing Material UI implementation for design patterns and component types, but build everything fresh using shadcn/ui and Tailwind.
</context>

<requirements>
1. **Theme System with Admin Customization:**
   - Implement CSS custom properties (CSS variables) for all theme colors
   - Create a guild configuration system that allows runtime color editing
   - Support dark/light mode variants
   - Ensure colors can be modified through admin interface without code changes
   - Consider WoW expansion theming (Classic, TBC, WotLK, etc.)

2. **Complete Component Library:**
   - Install and configure shadcn/ui components
   - Create theme demo page (`/theme-demo` or similar) showcasing all components
   - Include standard UI components: buttons, cards, forms, inputs, modals, tables, tabs, badges, etc.
   - Include WoW-specific components: class icons, role indicators, raid roster displays, attendance trackers, etc.

3. **Guild Configuration System:**
   - Create TypeScript types for guild config (name, server, expansion, theme colors, logo, etc.)
   - Implement config storage structure (prepare for Firestore but use mock data initially)
   - Make config easily editable and hot-reloadable

4. **Design System Documentation:**
   - Theme demo page should serve as living documentation
   - Show component variants, states (hover, active, disabled), and usage examples
   - Include color palette display with CSS variable names
   - Demonstrate responsive behavior

5. **Reusable Architecture:**
   - Create composable, atomic components
   - Use consistent prop patterns across components
   - Implement proper TypeScript types for all components
   - Follow shadcn/ui patterns for component structure
</requirements>

<implementation>

<research>
**Phase 1: Analyze Existing Implementation**
1. Examine the seios-aner repository to understand:
   - Current component structure and UI patterns
   - Guild-specific elements that need to be generalized
   - Color schemes and visual design language
   - WoW-specific features (classes, roles, raids, attunements, professions)
2. Identify which design elements to preserve and which to modernize

**Phase 2: Theme System Foundation**
1. Set up Tailwind CSS v4 with CSS custom properties
2. Create a color system using CSS variables:
   - Primary, secondary, accent colors
   - Background and surface colors
   - Text colors (primary, secondary, muted)
   - Semantic colors (success, warning, error, info)
   - WoW class colors (warrior, mage, priest, etc.)
3. Implement dark/light mode switching
4. Create guild config TypeScript types and mock data structure

**Phase 3: shadcn/ui Setup**
1. Initialize shadcn/ui in the project
2. Install core components (button, card, input, dialog, table, tabs, badge, etc.)
3. Customize component themes to use the CSS variable system
4. Ensure all components respect the dynamic color configuration

**Phase 4: Component Development**
Build components in this order:
1. Foundation: Typography, spacing, color utilities
2. Atoms: Button, Badge, Avatar, Icon
3. Molecules: Card, Input, Select, Checkbox, Radio
4. Organisms: Table, Form, Modal, Navigation
5. WoW-specific: ClassIcon, RoleIcon, RaidRoster, AttendanceTracker, etc.

**Phase 5: Theme Demo Page**
Create a comprehensive demo page (`/theme-demo`) that displays:
1. Color palette with live editing preview (simulate admin editing)
2. All component variants and states
3. Typography scale
4. Spacing system
5. WoW-specific components in action
6. Responsive behavior demonstrations
7. Dark/light mode toggle

</research>

<technical_approach>
**CSS Variable Naming Convention:**
```css
/* Use semantic naming that maps to guild config */
--color-primary: [from config];
--color-secondary: [from config];
--color-background: [from config];
--color-class-warrior: #C79C6E;
--color-class-mage: #69CCF0;
/* etc. */
```

**Guild Config Structure (TypeScript):**
```typescript
interface GuildConfig {
  name: string;
  server: string;
  region: 'US' | 'EU' | 'KR' | 'TW' | 'CN';
  expansion: 'classic' | 'tbc' | 'wotlk' | 'cata' | 'retail';
  theme: {
    colors: {
      primary: string;
      secondary: string;
      accent: string;
      // ... more colors
    };
    logo?: string;
    customCSS?: string;
  };
  // ... other guild settings
}
```

**Component Structure:**
- Follow shadcn/ui conventions (components/ui folder)
- Create separate folder for WoW-specific components (components/wow)
- Use Tailwind classes with CSS variable references
- Ensure all components are controlled/uncontrolled compatible
</technical_approach>

<constraints>
**DO:**
- Reference the existing Material UI implementation for design inspiration
- Build everything fresh with shadcn/ui and Tailwind
- Use CSS custom properties for all themeable values
- Create mock guild config data for development
- Make the theme demo page comprehensive and interactive
- Use TypeScript strictly for all components and configs
- Follow Next.js 15 and React 19 best practices
- Prepare for Firestore integration (structure data accordingly) but use local/mock data

**DO NOT:**
- Copy Material UI components directly (rebuild with shadcn/ui)
- Hard-code colors or guild-specific values
- Skip TypeScript types
- Implement live Firestore connection yet (use emulator/mock data)
- Over-engineer - start with core functionality, iterate later

**WHY these constraints:**
- CSS variables enable runtime theme editing without rebuilds
- Fresh implementation ensures modern patterns and avoids Material UI dependencies
- Mock data allows rapid development without database complexity
- TypeScript prevents runtime errors and improves developer experience
- Strict separation of concerns makes the system truly multi-guild capable
</constraints>

</implementation>

<output>
Create the following file structure:

**Configuration & Types:**
- `./src/lib/types/guild-config.types.ts` - Guild configuration TypeScript interfaces
- `./src/lib/config/theme.config.ts` - Theme system configuration and CSS variable mappings
- `./src/lib/mock/mockGuildConfig.ts` - Mock guild configuration data for development

**Theme System:**
- `./src/styles/theme-variables.css` - CSS custom properties for theming
- `./src/app/globals.css` - Update to integrate theme variables with Tailwind

**shadcn/ui Components:**
- `./components/ui/*` - Install and customize shadcn/ui components (button, card, input, etc.)

**WoW-Specific Components:**
- `./src/components/wow/ClassIcon.tsx` - WoW class icon component
- `./src/components/wow/RoleIcon.tsx` - Role indicator (tank, healer, DPS)
- `./src/components/wow/SpecIcon.tsx` - Specialization icons
- `./src/components/wow/AttendanceBadge.tsx` - Raid attendance status
- `./src/components/wow/ProfessionIcon.tsx` - Profession icons
- (Add more as needed based on existing implementation)

**Theme Demo Page:**
- `./src/app/theme-demo/page.tsx` - Comprehensive component showcase
- `./src/components/theme-demo/ColorPalette.tsx` - Color system display
- `./src/components/theme-demo/ComponentShowcase.tsx` - Component variants display
- `./src/components/theme-demo/ThemeControls.tsx` - Live theme editing controls (simulates admin tool)

**Documentation:**
- Update `./CLAUDE.md` with design system conventions and component usage guidelines
</output>

<verification>
Before declaring complete, verify:

1. **Theme System:**
   - [ ] CSS variables are defined for all colors
   - [ ] Guild config type includes all necessary theme properties
   - [ ] Mock guild config populates all required fields
   - [ ] Colors can be dynamically changed (demonstrate in theme demo)

2. **Component Library:**
   - [ ] All standard shadcn/ui components are installed and customized
   - [ ] WoW-specific components are created with proper TypeScript types
   - [ ] Components use CSS variables for theming (not hard-coded colors)
   - [ ] Dark/light mode works across all components

3. **Theme Demo Page:**
   - [ ] Accessible at `/theme-demo` route
   - [ ] Displays complete color palette with variable names
   - [ ] Shows all component variants and states
   - [ ] Includes live theme editing controls
   - [ ] Demonstrates WoW-specific components
   - [ ] Responsive on mobile, tablet, and desktop

4. **Code Quality:**
   - [ ] All files have proper TypeScript types (no `any`)
   - [ ] Components follow consistent prop patterns
   - [ ] Code is well-organized and modular
   - [ ] CLAUDE.md is updated with design system guidelines

5. **Development Setup:**
   - [ ] `pnpm dev` runs successfully
   - [ ] No TypeScript errors
   - [ ] No console errors or warnings
   - [ ] Theme demo page loads and is interactive
</verification>

<success_criteria>
This phase is successful when:

1. A complete, customizable design system is implemented using shadcn/ui and Tailwind CSS
2. Theme demo page showcases all components with live editing capabilities
3. CSS variable system allows runtime color changes (preparing for admin tool)
4. Guild config structure is defined and can be easily extended
5. All components are reusable, well-typed, and follow consistent patterns
6. The UI feels modern while referencing the existing Material UI design
7. Codebase is ready for the next phase: building actual guild management features

The theme demo should be impressive enough to demonstrate to stakeholders and serve as the foundation for all future development.
</success_criteria>

<additional_context>
**For maximum efficiency:**
- When examining the existing codebase (seios-aner repo), use parallel tool calls to read multiple relevant files simultaneously
- When creating multiple component files, consider which can be scaffolded in parallel
- After reviewing the existing implementation, reflect on the design patterns before proceeding with implementation

**Go beyond the basics:**
- Include thoughtful transitions and animations where appropriate
- Consider accessibility (ARIA labels, keyboard navigation)
- Add helpful developer documentation in component files
- Make the theme demo interactive and delightful to use
- Consider edge cases (long guild names, missing data, etc.)

This is an ambitious foundation phase - thoroughness here will save significant time later. Take time to analyze the existing implementation deeply, consider multiple approaches for the theme system, and create a design system that truly enables easy customization for any guild.
</additional_context>