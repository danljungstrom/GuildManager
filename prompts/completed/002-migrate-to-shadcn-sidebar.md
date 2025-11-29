<objective>
Migrate the current custom sidebar implementation to use the official shadcn/ui Sidebar component. This will provide better UX patterns, proper layout handling, and fix the current issues where:
1. The collapse button is misplaced (should be at the top, not bottom)
2. Main content doesn't adapt to sidebar state (content goes under sidebar when expanded)

The migration should maintain all existing functionality while leveraging shadcn's battle-tested patterns.
</objective>

<context>
The current sidebar implementation uses custom components that have layout issues:
- Collapse button is at the bottom instead of top
- Main content area doesn't respond to sidebar open/closed state
- Content gets overlapped by the sidebar when it's expanded

shadcn/ui now provides an official Sidebar component with:
- Proper layout management using CSS Grid
- Built-in collapse/expand with correct button placement
- Responsive mobile/desktop patterns
- Better accessibility and keyboard navigation
- Automatic content area adjustment

Examine these existing files:
@components/layout/Sidebar.tsx
@components/layout/MobileNav.tsx
@components/layout/SidebarNav.tsx
@lib/stores/sidebar-store.ts
@app/layout.tsx

Refer to CLAUDE.md for project conventions and design system guidelines.
</context>

<requirements>
1. Install and configure the official shadcn/ui Sidebar component:
   - Run: `npx shadcn@latest add sidebar`
   - This will install the Sidebar primitives and utilities

2. Replace the custom sidebar implementation with shadcn Sidebar:
   - Use `SidebarProvider`, `Sidebar`, `SidebarContent`, `SidebarHeader`, `SidebarFooter`, etc.
   - Maintain the same navigation structure (Dashboard, Roster with subsections, Raids, Guild Info)
   - Keep the guild icon/name in the header
   - Place collapse/expand trigger at the top of the sidebar (in header area)

3. Fix layout issues:
   - Main content area must properly adapt to sidebar state
   - Use `SidebarProvider` to wrap the layout and manage spacing
   - Content should push/pull when sidebar expands/collapses (not overlap)
   - Proper responsive behavior on mobile (<768px)

4. Maintain existing functionality:
   - Zustand store can be kept or replaced with shadcn's built-in state (your choice)
   - All navigation items and icons stay the same
   - Active route highlighting
   - Expandable Roster section with subsections
   - Mobile hamburger menu
   - Keyboard navigation support

5. Styling:
   - Use CSS variables from globals.css for colors
   - Match the WoW theme aesthetic
   - Active state uses --primary color
   - Smooth transitions for expand/collapse

6. Accessibility:
   - Maintain ARIA labels
   - Keyboard navigation (Tab, Enter, Escape)
   - Focus management
   - Screen reader friendly
</requirements>

<implementation>
**Installation:**
First, install the shadcn sidebar component which will create the necessary primitives.

**Component Structure:**
The shadcn Sidebar uses a provider pattern:
```tsx
<SidebarProvider>
  <Sidebar>
    <SidebarHeader>
      {/* Guild logo, name, collapse trigger */}
    </SidebarHeader>
    <SidebarContent>
      {/* Navigation items */}
    </SidebarContent>
    <SidebarFooter>
      {/* Optional footer content */}
    </SidebarFooter>
  </Sidebar>
  <main>
    {/* Page content - automatically adjusts */}
  </main>
</SidebarProvider>
```

**Why shadcn Sidebar is better:**
- Handles layout spacing automatically using CSS Grid/Flexbox
- Built-in state management for open/closed (can sync with Zustand if needed)
- Collapse trigger placement is designed to be in the header
- Mobile responsiveness is built-in with proper breakpoints
- Prevents content overlap by design
- Well-tested patterns from the shadcn ecosystem

**Navigation Migration:**
- Reuse the existing `navigationItems` config from SidebarNav.tsx
- Map items to shadcn's `SidebarMenu`, `SidebarMenuItem` components
- Use `SidebarMenuButton` for navigation items
- Collapsible sections use `SidebarMenuSub` for Roster subsections

**Mobile Pattern:**
- shadcn Sidebar includes mobile sheet/drawer out of the box
- Replace the custom MobileNav.tsx with shadcn's mobile patterns
- Uses the same `SidebarProvider` for consistent state

**State Management Decision:**
You can either:
- Use shadcn's built-in `useSidebar()` hook (simpler)
- Keep your Zustand store and sync it with shadcn's state (if you need global state elsewhere)
Choose whichever makes more sense for your architecture.
</implementation>

<output>
Install and modify these files:

1. Run installation: `npx shadcn@latest add sidebar`
2. Update `app/layout.tsx` - Wrap with SidebarProvider, integrate shadcn Sidebar
3. Update or replace `components/layout/Sidebar.tsx` - Use shadcn primitives
4. Update or replace `components/layout/SidebarNav.tsx` - Adapt navigation to use SidebarMenu components
5. Update or remove `components/layout/MobileNav.tsx` - Use shadcn's mobile patterns or remove if no longer needed
6. Update or remove `lib/stores/sidebar-store.ts` - Keep if syncing with shadcn, or remove if using built-in state
7. Update `app/globals.css` - Add any necessary CSS variable overrides for shadcn Sidebar styling

Ensure all existing placeholder pages still work and are accessible.
</output>

<verification>
Before declaring complete, verify:

1. Sidebar renders correctly with shadcn components
2. Collapse/expand trigger is at the TOP of the sidebar (in header area)
3. Main content area properly adjusts when sidebar expands/collapses (NO overlap)
4. Active route highlighting works
5. Roster section expands/collapses correctly showing subsections
6. Mobile responsiveness works (hamburger menu, drawer/sheet)
7. All placeholder pages accessible and properly spaced
8. Keyboard navigation works (Tab, Enter, Escape)
9. No TypeScript errors
10. No console errors
11. Build succeeds (`pnpm build`)
12. Dev server runs without issues

Test the layout flow:
- Open sidebar → content should shift/shrink
- Close sidebar → content should expand to fill space
- Resize browser to mobile → hamburger menu appears
- Navigate between pages → active highlighting updates
</verification>

<success_criteria>
- shadcn/ui Sidebar component installed and integrated
- Collapse button correctly positioned at the top of the sidebar
- Main content area properly responds to sidebar state (no overlap)
- All navigation functionality preserved (active states, expandable sections, routing)
- Mobile responsiveness works correctly
- Code follows project conventions from CLAUDE.md
- TypeScript types properly defined
- No build or runtime errors
- Better UX than previous custom implementation
</success_criteria>
