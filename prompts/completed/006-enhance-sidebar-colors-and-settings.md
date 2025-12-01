<objective>
Enhance the sidebar visual design and add settings sections:
1. Apply primary theme color (gold/bronze) to guild icon, name, server info, and navigation category text
2. Change active navigation items to white text for better contrast
3. Add "User Settings" section to the navigation (for future character management)
4. Add "Admin Settings" section to the navigation (for guild admin controls)

This will make the sidebar more visually cohesive with the WoW theme and prepare the UI for future authentication and user management features.
</objective>

<context>
The sidebar needs more visual consistency with the WoW theme:
- Guild icon and name should use primary color (gold/bronze) to stand out
- Server info text should also use primary color
- Navigation category labels should use primary color by default
- Active items should use white text (instead of primary) for better contrast against the primary-colored background
- Need to add settings sections for future user authentication and admin features

The settings sections should be:
- **User Settings**: For logged-in users to manage their characters, preferences, etc.
- **Admin Settings**: For guild admins to configure the guild, manage members, etc.

These won't be fully functional yet, but the UI structure should be in place.

Examine these files:
@components/layout/AppSidebar.tsx - Guild header with icon/name
@components/layout/SidebarNav.tsx - Navigation items and categories
@app/globals.css - Theme color definitions
</context>

<requirements>
1. **Color Guild Header Elements:**
   - Guild icon: Apply primary color tint/filter
   - Guild name text: Use `text-primary` class
   - Server info text: Use `text-primary/80` or similar for subtle primary

2. **Color Navigation Category Labels:**
   - Default state: `text-primary` (gold/bronze)
   - Makes the sidebar feel more alive and branded
   - Helps visually organize sections

3. **Fix Active Navigation Text Color:**
   - Change active items from `text-primary` to `text-white`
   - Reason: White text provides better contrast on the primary-colored background
   - Keep the primary background color (`bg-primary/10` or similar)
   - Keep the left border indicator (`border-l-2 border-primary`)

4. **Add User Settings Section:**
   - Add a new navigation item: "User Settings"
   - Icon: User, UserCircle, or Settings from lucide-react
   - Route: `/settings/user` or `/user-settings`
   - Should appear after the main navigation sections
   - Will be used for: character management, preferences, notifications

5. **Add Admin Settings Section:**
   - Add a new navigation item: "Admin Settings" or "Admin"
   - Icon: Shield, Settings, Crown, or Wrench from lucide-react
   - Route: `/settings/admin` or `/admin`
   - Should appear at the bottom of the navigation (before footer)
   - Will be used for: guild configuration, member management, permissions
   - Consider adding a visual separator above it to distinguish admin features

6. **Create Placeholder Pages:**
   - Create basic placeholder pages for the new routes
   - Should indicate these features are coming soon
   - Match the styling of existing pages (primary colored headers, etc.)

Why these changes matter:
- Primary color on static elements reinforces the WoW brand
- White text on active items improves readability
- Settings sections prepare the UI for user authentication
- Clear separation of user vs admin features
- Makes the sidebar feel more complete and production-ready
</requirements>

<implementation>
**Guild Header Colors:**
In `components/layout/AppSidebar.tsx`:
```tsx
// Guild name
<span className="text-primary font-bold">Guild Name</span>

// Server info
<span className="text-primary/80 text-xs">Server Info</span>

// Guild icon (if SVG, apply fill color; if image, consider filter or colored border)
```

**Navigation Category Labels:**
In `components/layout/SidebarNav.tsx`:
- Add category/section labels above navigation groups
- Style with `text-primary text-xs uppercase tracking-wider`

**Active State Text Color:**
In `components/layout/SidebarNav.tsx`:
```tsx
// Change from:
className={cn("text-primary", ...)}

// To:
className={cn(isActive ? "text-white" : "text-sidebar-foreground", ...)}
```

**New Navigation Structure:**
```tsx
// Main Navigation
- Dashboard
- Roster (with subsections)
- Raids
- Guild Info

// User Section
- User Settings

// Admin Section (with separator)
- Admin Settings
```

**Settings Routes:**
- `/user-settings` or `/settings/user`
- `/admin` or `/settings/admin`

Create placeholder pages with:
- Primary colored headers
- "Coming Soon" message
- Brief description of what the section will contain
</implementation>

<output>
Modify/create these files:
1. `components/layout/AppSidebar.tsx` - Apply primary color to guild name and server info
2. `components/layout/SidebarNav.tsx` - Update navigation structure, add settings items, fix active text color
3. `app/user-settings/page.tsx` (NEW) - User settings placeholder page
4. `app/admin/page.tsx` (NEW) - Admin settings placeholder page
5. `app/globals.css` - Add any additional styling for settings sections if needed

Ensure proper visual hierarchy and separation between main navigation and settings sections.
</output>

<verification>
Before declaring complete, verify:
1. Guild icon and name use primary color (gold/bronze)
2. Server info uses primary color (slightly transparent)
3. Navigation category labels use primary color
4. Active navigation items have WHITE text (not primary)
5. Active items still have primary background and border
6. "User Settings" appears in navigation with appropriate icon
7. "Admin Settings" appears in navigation with appropriate icon
8. Visual separator above Admin Settings (optional but recommended)
9. Placeholder pages exist for both settings routes
10. Clicking settings items navigates to the placeholder pages
11. Navigation structure feels organized and complete
12. No TypeScript errors
13. Dev server runs without issues

Test navigation flow:
- All existing routes still work
- Settings routes are accessible
- Active states work correctly with white text
- Sidebar looks more "alive" with primary colored elements
</verification>

<success_criteria>
- Guild header elements (icon, name, server) use primary theme color
- Navigation category labels use primary color for branding
- Active navigation items use white text for better contrast
- User Settings section added to navigation
- Admin Settings section added to navigation with visual separation
- Placeholder pages created for both settings routes
- Overall sidebar feels more cohesive and branded with WoW theme
- Clear distinction between main navigation, user features, and admin features
- UI prepared for future authentication and settings implementation
</success_criteria>
