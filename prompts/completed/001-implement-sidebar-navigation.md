<objective>
Implement a responsive sidebar navigation system for GuildManager that supports desktop and mobile layouts. This will serve as the primary navigation for the application, replacing the previous header-based approach.

The navigation should feel modern and polished, similar to tools like Discord, Notion, or Linear, while maintaining the WoW-themed design system established in the project.
</objective>

<context>
This is a Next.js 15 app with App Router, using the design system detailed in CLAUDE.md. The app uses:
- Tailwind CSS v4 with CSS custom properties
- shadcn/ui components (Radix UI)
- Zustand for state management
- WoW-specific theming with class colors, role colors, etc.

The navigation must support:
- Desktop: Persistent sidebar on the left
- Mobile: Collapsible hamburger menu
- Active route highlighting
- Expandable/collapsible sections (for Roster subsections)

Target sections for initial implementation:
1. Dashboard/Home - Overview with stats and activity
2. Roster - With subsections: All Members, By Class/Role, Professions
3. Raids - Raid management features
4. Guild Info - About, rules, etc.

Refer to CLAUDE.md for project conventions, tech stack, and design system guidelines.
</context>

<requirements>
1. Create a reusable Sidebar component that:
   - Displays the guild icon/name at the top
   - Shows navigation items with icons from lucide-react
   - Highlights the active route
   - Supports nested/expandable sections (e.g., Roster subsections)
   - Is collapsible on desktop (optional toggle)
   - Transforms to a hamburger menu on mobile

2. Responsive behavior:
   - Desktop (≥768px): Sidebar visible by default, can be toggled
   - Mobile (<768px): Hidden by default, shows via hamburger menu overlay

3. State management:
   - Use Zustand to manage sidebar open/closed state
   - Persist user preference in localStorage
   - Support keyboard navigation (Escape to close on mobile)

4. Styling:
   - Use CSS variables from globals.css for colors
   - Match the established WoW theme aesthetic
   - Smooth transitions for expand/collapse
   - Active state uses --primary color
   - Hover states for interactive elements

5. Integration:
   - Update app/layout.tsx to include the sidebar
   - Ensure proper spacing for main content area
   - Works with existing theme-demo pages
   - Create placeholder pages for Dashboard, Roster, Raids, Guild Info
</requirements>

<implementation>
**Component Structure:**
Create these files:
- `components/layout/Sidebar.tsx` - Main sidebar component
- `components/layout/SidebarNav.tsx` - Navigation items logic
- `components/layout/MobileNav.tsx` - Mobile hamburger menu
- `lib/stores/sidebar-store.ts` - Zustand store for sidebar state

**Navigation Items Configuration:**
Define navigation structure as a config object with:
- Label, href, icon
- Optional children for nested items (like Roster subsections)
- Use lucide-react icons: Home, Users, Sword, Info, etc.

**Accessibility:**
- Proper ARIA labels for navigation
- Keyboard navigation support
- Focus management when opening/closing
- Screen reader friendly

**Mobile Overlay:**
- Use Radix Dialog or Sheet pattern from shadcn/ui
- Backdrop click to close
- Slide-in animation from left
- Prevent body scroll when open

**Why these patterns matter:**
- Zustand state ensures sidebar preference persists across navigation
- Mobile overlay pattern is standard UX for responsive dashboards
- Config-based navigation makes it easy to add/remove sections later
- Component separation keeps code maintainable as complexity grows
</implementation>

<output>
Create/modify these files:

1. `components/layout/Sidebar.tsx` - Desktop sidebar component
2. `components/layout/MobileNav.tsx` - Mobile navigation component
3. `components/layout/SidebarNav.tsx` - Shared navigation items/logic
4. `lib/stores/sidebar-store.ts` - Zustand store for sidebar state
5. Update `app/layout.tsx` - Integrate sidebar into root layout
6. Create placeholder pages:
   - `app/dashboard/page.tsx`
   - `app/roster/page.tsx`
   - `app/roster/by-class/page.tsx`
   - `app/roster/professions/page.tsx`
   - `app/raids/page.tsx`
   - `app/guild-info/page.tsx`

Each placeholder page should have basic structure with a heading and description, styled with the design system.
</output>

<verification>
Before declaring complete, verify:

1. Sidebar renders correctly on desktop with all navigation items
2. Mobile hamburger menu opens/closes smoothly
3. Active route is highlighted correctly
4. Roster section expands/collapses to show subsections
5. Sidebar state persists after navigation (Zustand working)
6. All placeholder pages are accessible via navigation
7. Responsive breakpoints work as expected (test at 768px)
8. Theme colors from CSS variables are applied correctly
9. Keyboard navigation works (Tab, Enter, Escape)
10. No console errors or TypeScript issues

Test navigation flow: Dashboard → Roster → Roster/By Class → Raids → Guild Info
</verification>

<success_criteria>
- Sidebar component is fully functional on desktop and mobile
- Navigation state managed by Zustand and persisted
- All target sections are accessible and correctly highlighted when active
- Responsive behavior matches modern dashboard UX patterns
- Code follows project conventions from CLAUDE.md
- TypeScript types are properly defined
- Components use design system colors and styling
- Placeholder pages created for all main sections
</success_criteria>
