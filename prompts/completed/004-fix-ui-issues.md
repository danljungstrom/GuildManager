<objective>
Fix three UI issues in the application:
1. Profession icons have a small line on top - need to zoom the image slightly to crop out the unwanted border
2. "All Members" tab in roster navigation always shows as active, even when other tabs are selected
3. Theme colors not applied - headers and icons are white instead of using the WoW theme colors (primary gold/bronze)

These issues affect the visual polish and usability of the application.
</objective>

<context>
The application uses a WoW-themed design system with CSS custom properties defined in globals.css. The primary color should be gold/bronze (--primary), but currently many elements appear white/unstyled.

Examine these files:
@components/wow/ProfessionIcon.tsx - Profession icon component with border issue
@components/layout/SidebarNav.tsx - Navigation with incorrect active state highlighting
@app/roster/page.tsx - Roster page that should use theme colors
@app/roster/by-class/page.tsx - By class page
@app/roster/professions/page.tsx - Professions page
@app/globals.css - Theme color definitions

The theme colors should be consistently applied throughout the UI, especially on:
- Page headers and titles
- Icons (guild logo, navigation icons)
- Active states in navigation
- Text content
</context>

<requirements>
1. **Fix Profession Icons:**
   - Add CSS to slightly zoom/scale the profession icon images
   - This will crop out the small line visible at the top of each icon
   - Use object-fit or transform scale to achieve this
   - Maintain the icon's aspect ratio and centering

2. **Fix Active Tab Highlighting:**
   - The roster navigation has three tabs: "All Members", "By Class/Role", "Professions"
   - Currently "All Members" always shows as active (highlighted)
   - Fix the active state detection to correctly highlight the current route
   - Routes are: /roster, /roster/by-class, /roster/professions
   - Use Next.js `usePathname()` to detect the active route correctly

3. **Apply Theme Colors:**
   - Headers should use theme colors, not plain white
   - Guild logo/icons should be styled with theme colors where appropriate
   - Text should use proper foreground colors from the theme
   - Review and apply CSS variables like:
     - `--primary` for gold/bronze accents
     - `--foreground` for main text
     - `--muted-foreground` for secondary text
     - `--accent` for highlights
   - Ensure proper contrast in both light and dark modes

Why these fixes matter:
- Professional icons with visible artifacts look unpolished
- Incorrect active states confuse navigation UX
- White/unstyled elements break the WoW theme immersion
</requirements>

<implementation>
**Profession Icons Fix:**
In `components/wow/ProfessionIcon.tsx`:
- Add CSS transform or object-fit properties to zoom the image slightly (e.g., scale(1.1) or object-fit: cover with negative positioning)
- Ensure the parent container has overflow: hidden to crop the excess
- Test that all profession icons look good without the top line

**Active Tab Fix:**
In `components/layout/SidebarNav.tsx`:
- The roster item has children (subsections)
- Currently, the active check likely always matches the parent "/roster"
- Fix the logic to:
  - Highlight "All Members" only when pathname === "/roster"
  - Highlight "By Class/Role" when pathname === "/roster/by-class"
  - Highlight "Professions" when pathname === "/roster/professions"
- Use exact path matching for the child items

**Theme Colors Fix:**
Review these files and apply theme colors:
- Page headers should use `className="text-foreground"` or similar
- Consider using `text-primary` for accent text
- Guild logo in sidebar might need color styling (if it's an SVG, apply fill color)
- Navigation icons should inherit theme colors
- Check if Tailwind classes like `text-white` are overriding theme colors

Common issues:
- Hardcoded `text-white` classes override theme colors
- Missing theme color classes on key elements
- SVG icons may need explicit fill/stroke colors from CSS variables
</implementation>

<output>
Modify these files:
1. `components/wow/ProfessionIcon.tsx` - Add zoom/scale to crop top line
2. `components/layout/SidebarNav.tsx` - Fix active state logic for roster subitems
3. `components/layout/AppSidebar.tsx` - Apply theme colors to header/logo if needed
4. `app/roster/page.tsx` - Apply theme colors to headers and content
5. `app/roster/by-class/page.tsx` - Apply theme colors
6. `app/roster/professions/page.tsx` - Apply theme colors
7. Any other files where white/unstyled elements appear

Ensure all changes maintain accessibility (proper contrast ratios).
</output>

<verification>
Before declaring complete, verify:
1. Profession icons no longer show the top line artifact
2. All profession icons still look centered and properly sized
3. "All Members" tab only highlights when on /roster
4. "By Class/Role" tab highlights when on /roster/by-class
5. "Professions" tab highlights when on /roster/professions
6. Page headers use theme colors (gold/bronze primary)
7. Guild logo in sidebar uses appropriate theme styling
8. Navigation icons are properly themed
9. Text content uses foreground colors from theme
10. Good contrast in both light and dark modes
11. No TypeScript errors
12. Dev server runs without issues

Test navigation:
- Navigate to /roster → "All Members" should be active
- Navigate to /roster/by-class → "By Class/Role" should be active
- Navigate to /roster/professions → "Professions" should be active
</verification>

<success_criteria>
- Profession icons display cleanly without top line artifacts
- Roster navigation correctly highlights the active tab
- Theme colors (gold/bronze primary) are applied throughout the UI
- Headers, icons, and text use proper theme styling
- All elements maintain good contrast and accessibility
- Visual polish matches the WoW theme aesthetic
- No regression in existing functionality
</success_criteria>
