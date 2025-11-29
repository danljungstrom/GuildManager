<objective>
Fix the missing expand button in the collapsed sidebar. When the sidebar is collapsed to icon-only mode, there should be a visible button to expand it back to full width. Currently, users cannot expand the sidebar once it's collapsed.
</objective>

<context>
The shadcn sidebar was recently implemented and works correctly for collapsing, but lacks a way to expand it again when collapsed. The sidebar needs an expand trigger that appears when in collapsed state.

Examine these files:
@components/layout/AppSidebar.tsx
@app/layout.tsx

The shadcn sidebar component includes `SidebarTrigger` which should handle both collapse and expand states, but it may not be visible or positioned correctly in the collapsed state.
</context>

<requirements>
1. Add a visible expand button when sidebar is collapsed
2. The button should be easily accessible and obvious to users
3. Options to consider:
   - Add a SidebarTrigger at the top of the collapsed sidebar
   - Add a floating button that appears when collapsed
   - Ensure the existing header trigger works in both states
4. Button should maintain WoW theme styling
5. Should work on both desktop and mobile
</requirements>

<implementation>
The shadcn sidebar typically handles this with `SidebarTrigger` components. Check if:
- The SidebarTrigger in AppSidebar header is visible when collapsed
- The trigger needs to be styled or positioned differently
- An additional trigger is needed in the main content area

Common patterns:
- Add a trigger in the sidebar header that's always visible
- Add a trigger in the page header (already exists in layout.tsx for mobile)
- Use the desktop trigger for both collapse and expand

Ensure the trigger button is:
- Visible in both expanded and collapsed states
- Properly styled with the WoW theme
- Has appropriate icons (e.g., PanelLeft, PanelLeftClose, Menu icons from lucide-react)
</implementation>

<output>
Modify these files:
1. `components/layout/AppSidebar.tsx` - Ensure SidebarTrigger in header is visible when collapsed
2. `app/layout.tsx` - Consider adding a trigger in the main content area if needed

The solution should be minimal and leverage shadcn's built-in patterns.
</output>

<verification>
Before declaring complete, verify:
1. Sidebar can be collapsed via the trigger button
2. When collapsed, there is a clear, visible button to expand it
3. Expand button works correctly (expands the sidebar)
4. Button styling matches the WoW theme
5. Works on both desktop and mobile
6. No TypeScript errors
7. Dev server runs without issues
8. User can toggle between collapsed and expanded states repeatedly
</verification>

<success_criteria>
- Visible expand button when sidebar is collapsed
- Button correctly expands the sidebar
- Styling consistent with WoW theme
- Works seamlessly in both desktop and mobile modes
- No regression in existing functionality
</success_criteria>
