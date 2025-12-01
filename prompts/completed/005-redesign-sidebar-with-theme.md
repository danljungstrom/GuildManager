<objective>
Redesign the sidebar to match the polished look from the shadcn sidebar demo with proper WoW theme integration. The sidebar should include:
1. Gradient header and footer sections (like the demo)
2. Proper theme colors applied throughout (gold/bronze primary)
3. Better visual indication of selected/active items
4. Light/dark mode toggle switch
5. Overall improved visual polish matching the shadcn demo aesthetic

This will create a more professional, cohesive sidebar that properly showcases the WoW theme.
</objective>

<context>
The current sidebar is functional but lacks the visual polish of the shadcn demo. It needs:
- Gradient backgrounds in header/footer for depth
- Proper application of WoW theme colors (--primary gold/bronze)
- Better active state styling with background highlights
- A theme toggle for light/dark mode switching
- Visual hierarchy and spacing improvements

Reference the shadcn sidebar demo for inspiration on:
- Gradient usage in header/footer
- Active item styling with backgrounds
- Overall spacing and visual hierarchy
- Theme switcher component placement

Examine these files:
@components/layout/AppSidebar.tsx - Main sidebar component
@components/layout/SidebarNav.tsx - Navigation items
@app/globals.css - Theme variables and sidebar styling
@lib/constants/theme-presets.ts - Available theme presets

The WoW theme uses:
- Primary: `hsl(41 40% 60%)` - Gold/bronze
- Background: Dark card backgrounds
- Active states should use primary color with subtle backgrounds
</context>

<requirements>
1. **Add Gradient Header:**
   - Create a gradient background in the SidebarHeader
   - Use subtle gradients that complement the WoW gold/bronze theme
   - Include guild logo, name, and server info
   - Consider using `bg-gradient-to-b` with theme colors

2. **Add Gradient Footer:**
   - Create a matching gradient in the SidebarFooter
   - Include the theme/mode toggle switch
   - Add user info or settings options if appropriate
   - Visual consistency with header gradient

3. **Apply Theme Colors to Sidebar:**
   - Ensure sidebar background uses theme variables
   - Navigation items should use --primary for active states
   - Hover states should show subtle primary color
   - Icons should inherit theme colors
   - Fix any remaining white/unstyled elements

4. **Improve Active Item Styling:**
   - Active items should have a background highlight (subtle primary color)
   - Active text should be bold or use primary color
   - Active indicator (border or background) should be clearly visible
   - Hover states should preview the active state styling

5. **Add Light/Dark Mode Toggle:**
   - Install/create a theme toggle component
   - Place it in the sidebar footer
   - Should toggle between light and dark modes
   - Persist user preference
   - Use sun/moon icons from lucide-react

6. **Visual Polish:**
   - Proper spacing and padding throughout
   - Smooth transitions on hover and active states
   - Consistent border-radius on interactive elements
   - Shadow/depth where appropriate (especially header/footer)
   - Match the overall feel of the shadcn demo

Why this matters:
- The sidebar is the primary navigation - it should be visually impressive
- Gradients and theme colors create depth and brand identity
- Clear active states improve navigation UX
- Theme toggle is a standard feature in modern apps
</requirements>

<implementation>
**Gradient Implementation:**
Use Tailwind gradient utilities:
```tsx
// Example header gradient
className="bg-gradient-to-b from-sidebar-accent/50 to-sidebar-background"
```

Consider using CSS variables for custom gradients:
```css
background: linear-gradient(to bottom,
  hsl(var(--sidebar-primary) / 0.1),
  hsl(var(--sidebar-background)));
```

**Theme Toggle Component:**
Options:
1. Use shadcn's dropdown-menu with theme options (light/dark/system)
2. Create a simple toggle button with sun/moon icons
3. Check if shadcn has a theme-toggle component available

Place in SidebarFooter with proper styling.

**Active State Styling:**
In SidebarNav.tsx, enhance the active styling:
```tsx
// Active item should have:
- Background: bg-sidebar-accent or bg-primary/10
- Text: text-sidebar-primary or text-primary
- Font weight: font-semibold
- Border/indicator: border-l-4 border-primary (optional left border)
```

**Sidebar Color Variables:**
Ensure globals.css has proper sidebar theme colors:
```css
--sidebar-primary: 41 40% 60%;  /* Gold/bronze */
--sidebar-accent: 41 40% 60% / 0.1;  /* Subtle primary background */
--sidebar-ring: 41 40% 60%;  /* Focus ring */
```

**Visual Hierarchy:**
- Header: Larger padding, gradient, prominent
- Navigation: Clear sections with spacing
- Footer: Gradient, controls, subtle border-top
</implementation>

<output>
Modify these files:
1. `components/layout/AppSidebar.tsx` - Add gradients to header/footer, restructure layout
2. `components/layout/SidebarNav.tsx` - Enhance active state styling
3. `app/globals.css` - Update sidebar CSS variables, add gradient utilities if needed
4. Create `components/theme-toggle.tsx` or `components/mode-toggle.tsx` - Theme switcher component
5. Update `app/layout.tsx` if needed for theme provider integration

Additional components to consider:
- Install shadcn dropdown-menu if not already available (for theme toggle)
- Ensure proper theme provider is in place for light/dark mode switching
</output>

<verification>
Before declaring complete, verify:
1. Sidebar header has a visually appealing gradient
2. Sidebar footer has a matching gradient style
3. Theme toggle is present in footer and works correctly
4. Active navigation items are clearly highlighted with background
5. Hover states show subtle primary color
6. All sidebar elements use theme colors (no plain white)
7. Gradients complement the gold/bronze WoW theme
8. Light and dark modes both look good
9. Visual polish matches or exceeds shadcn demo quality
10. Smooth transitions on all interactive elements
11. No TypeScript errors
12. Dev server runs without issues

Test theme toggle:
- Switch to light mode → sidebar should adapt
- Switch to dark mode → sidebar should adapt
- Preference should persist across page reloads
</verification>

<success_criteria>
- Sidebar has gradient header and footer matching demo aesthetic
- WoW theme colors (gold/bronze) properly applied throughout sidebar
- Active navigation items clearly highlighted with backgrounds
- Light/dark mode toggle functional in sidebar footer
- Overall visual polish equals or exceeds shadcn demo
- Smooth, polished animations and transitions
- Theme persists across page reloads
- All color contrast meets accessibility standards
- Professional, cohesive appearance that showcases WoW branding
</success_criteria>
