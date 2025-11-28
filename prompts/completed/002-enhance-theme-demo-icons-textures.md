<objective>
Enhance the GuildManager theme demo with complete visual fidelity by implementing background textures from the original design, all WoW icon assets, comprehensive class/profession displays, and functional runtime theme switching using CSS variable manipulation.

This builds on Phase 1 to create a fully functional, visually polished design system demo that accurately represents the final product and demonstrates admin theme customization capabilities.
</objective>

<context>
Phase 1 established the foundation with shadcn/ui components, WoW-specific components, and a CSS variable-based theme system. However, several critical elements are missing:

1. **No background textures** - The original seios-aner page had distinctive background textures that gave the site character
2. **Missing icon assets** - All WoW components show text fallbacks instead of actual icons
3. **Incomplete demo coverage** - Not all classes and professions are displayed in the theme demo
4. **Non-functional theme switching** - Theme controls exist but don't actually update the live page

**Current State:**
- CSS variables are defined in `app/globals.css`
- WoW components exist with fallback support: ClassIcon, RoleIcon, SpecIcon, ProfessionIcon
- Theme demo page at `/theme-demo` with ThemeControls component
- Mock guild configs exist with different theme presets (Horde, TBC, WotLK)

**Tech Stack:**
- Next.js 15 with App Router (React 19, TypeScript)
- Tailwind CSS v3 with CSS custom properties
- shadcn/ui components
- All 9 WoW classes, all professions defined in constants

**Reference Material:**
The seios-aner repository in the workspace contains the original Material UI implementation with background textures and icon assets to reference.
</context>

<requirements>

1. **Background Texture Implementation:**
   - Extract background texture/pattern from the seios-aner repository
   - Implement as CSS background in the theme system
   - Make texture subtle and non-intrusive (shouldn't interfere with readability)
   - Apply to appropriate sections (consider main background, card backgrounds, or both)
   - Ensure texture works in both dark and light modes

2. **Icon Asset Implementation:**
   - Extract or source all WoW icon assets from seios-aner repo:
     - All 9 class icons (Warrior, Mage, Priest, Rogue, Hunter, Warlock, Paladin, Druid, Shaman)
     - All specialization icons for each class
     - All profession icons (primary and secondary)
     - All role icons (Tank, DPS, Healer)
   - Save icons to `public/icons/` with organized subdirectories
   - Update WoW components to use actual icons instead of fallbacks
   - Optimize icons for web (appropriate sizes, Next.js Image component)

3. **Complete Theme Demo Display:**
   - Update ComponentShowcase to display ALL 9 classes with ClassIcon
   - Display ALL professions (both primary and secondary) with ProfessionIcon
   - Show multiple examples of each component type with different states
   - Organize displays in logical groups (classes by armor type, professions by category)
   - Include all role types and extra roles

4. **Functional Theme Switching:**
   - Implement CSS variable manipulation in ThemeControls component
   - When user selects a preset theme (Horde, TBC, WotLK), update all CSS variables live
   - Use `document.documentElement.style.setProperty()` for runtime updates
   - Add color pickers for individual color customization (optional enhancement)
   - Ensure all components on the page respond immediately to theme changes
   - Persist selected theme to localStorage for demo continuity

5. **Visual Polish:**
   - Ensure smooth transitions when switching themes
   - Add loading states if needed for icon assets
   - Verify all icons are properly sized and aligned
   - Check accessibility (alt text for icons, color contrast)
   - Test responsive behavior on mobile/tablet/desktop

</requirements>

<implementation>

<phase_1_research>
**Examine seios-aner Repository:**
1. Use parallel tool calls to read multiple files from seios-aner repo simultaneously
2. Locate background texture assets (check CSS files, public/assets, styles directories)
3. Find icon directories and catalog available icons
4. Note file formats, sizes, and naming conventions
5. Identify any CSS patterns or techniques used for textures

Example files to examine:
- `@seios-aner/public/*` - Look for texture images
- `@seios-aner/public/icons/*` or similar - Icon assets
- `@seios-aner/src/styles/*` - Background implementation
- `@seios-aner/src/components/*` - How icons were used
</phase_1_research>

<phase_2_background_textures>
**Extract and Implement Background Textures:**
1. Copy texture image files from seios-aner to `public/textures/` in GuildManager
2. Update `app/globals.css` to include background texture styling:
   - Add CSS variables for texture paths
   - Implement background-image with appropriate blend modes
   - Ensure texture opacity/visibility works in dark and light modes
   - Consider using `background-attachment: fixed` for parallax effect
3. Test texture appearance across different screen sizes
4. Adjust texture opacity or blend mode if it affects readability
</phase_2_background_textures>

<phase_3_icon_implementation>
**Extract and Organize Icon Assets:**
1. Copy all icon assets from seios-aner to organized structure:
   ```
   public/icons/
   ├── classes/
   │   ├── warrior.png
   │   ├── mage.png
   │   └── ... (all 9 classes)
   ├── specs/
   │   ├── warrior-arms.png
   │   ├── warrior-fury.png
   │   ├── warrior-protection.png
   │   └── ... (all specs)
   ├── professions/
   │   ├── blacksmithing.png
   │   ├── alchemy.png
   │   └── ... (all professions)
   └── roles/
       ├── tank.png
       ├── dps.png
       └── healer.png
   ```
2. Update WoW components to reference actual icon paths:
   - Modify `components/wow/ClassIcon.tsx` to use Next.js Image with proper paths
   - Update `components/wow/SpecIcon.tsx` for spec icons
   - Update `components/wow/ProfessionIcon.tsx` for profession icons
   - Update `components/wow/RoleIcon.tsx` for role icons
3. Keep fallback mechanism but ensure icons load properly
4. Add proper alt text for accessibility
</phase_3_icon_implementation>

<phase_4_complete_demo_display>
**Expand ComponentShowcase:**
1. Update `components/theme-demo/ComponentShowcase.tsx`:
   - Create a "Classes" section displaying all 9 classes
   - Create a "Professions" section displaying all professions
   - Group classes by armor type (Cloth, Leather, Mail, Plate)
   - Group professions by category (Crafting, Gathering, Secondary)
   - Show multiple states for each component (different sizes, with/without text)
2. Use grid layout for organized display
3. Add section headers and descriptions
4. Ensure responsive layout on smaller screens
</phase_4_complete_demo_display>

<phase_5_theme_switching>
**Implement Functional Theme Controls:**
1. Update `components/theme-demo/ThemeControls.tsx`:
   - Import all theme presets from `lib/mock/mockGuildConfig.ts`
   - Implement function to apply theme colors to CSS variables:
   ```typescript
   const applyTheme = (colors: ThemeColors) => {
     const root = document.documentElement;
     Object.entries(colors).forEach(([key, value]) => {
       root.style.setProperty(`--${key}`, value);
     });
   };
   ```
2. Add event handlers for preset theme buttons (Horde, TBC, WotLK)
3. Implement localStorage persistence:
   - Save selected theme preset to localStorage
   - Load saved theme on page mount
4. Add smooth CSS transitions for color changes in `app/globals.css`
5. Optional: Add color picker inputs for individual color customization
6. Add visual feedback showing which theme is currently active
</phase_5_theme_switching>

</implementation>

<constraints>

**DO:**
- Extract assets from seios-aner repo in the workspace
- Organize icons in logical directory structure
- Use Next.js Image component for all icons (optimization)
- Keep fallback text rendering in case icons fail to load
- Test theme switching with all preset themes
- Ensure background textures don't hurt readability
- Use semantic CSS variable names that match the theme config types
- Add proper TypeScript types for theme manipulation functions
- Test in both dark and light modes

**DO NOT:**
- Hard-code icon paths - use constants or derive from class/profession names
- Skip accessibility (alt text, ARIA labels)
- Make textures too prominent or distracting
- Break existing functionality
- Skip error handling for missing icons
- Forget to test responsive behavior

**WHY these constraints:**
- Next.js Image optimization improves performance and user experience
- Fallbacks ensure graceful degradation if assets are missing
- Accessibility is critical for an inclusive product
- Background textures should enhance, not distract from content
- Proper organization makes the system maintainable and scalable
- Theme switching demonstrates the core value proposition of customizability
</constraints>

<output>

**Assets to Create/Copy:**
- `public/textures/` - Background texture images from seios-aner
- `public/icons/classes/` - All 9 class icons
- `public/icons/specs/` - All specialization icons
- `public/icons/professions/` - All profession icons
- `public/icons/roles/` - Tank, DPS, Healer icons

**Files to Update:**
- `app/globals.css` - Add background texture styling and CSS transitions
- `components/wow/ClassIcon.tsx` - Use actual icon assets
- `components/wow/SpecIcon.tsx` - Use actual icon assets
- `components/wow/ProfessionIcon.tsx` - Use actual icon assets
- `components/wow/RoleIcon.tsx` - Use actual icon assets
- `components/theme-demo/ComponentShowcase.tsx` - Display all classes and professions
- `components/theme-demo/ThemeControls.tsx` - Implement functional theme switching
- `lib/utils.ts` - Add theme manipulation utility functions (if needed)

**Optional Enhancements:**
- `components/theme-demo/ColorPicker.tsx` - Individual color customization UI
- `hooks/useTheme.ts` - Custom hook for theme management (if pattern emerges)

</output>

<verification>

Before declaring complete, verify:

**Background Textures:**
- [ ] Texture files extracted from seios-aner and saved to `public/textures/`
- [ ] Background texture applied in CSS with appropriate blend mode
- [ ] Texture visible but not distracting in light mode
- [ ] Texture visible but not distracting in dark mode
- [ ] No readability issues caused by texture

**Icon Assets:**
- [ ] All 9 class icons present in `public/icons/classes/`
- [ ] All specialization icons present in `public/icons/specs/`
- [ ] All profession icons present in `public/icons/professions/`
- [ ] All role icons present in `public/icons/roles/`
- [ ] Icons display properly in all WoW components
- [ ] Fallback text still works if icon path is invalid
- [ ] Icons have proper alt text for accessibility

**Theme Demo Completeness:**
- [ ] All 9 classes displayed in ComponentShowcase
- [ ] All professions displayed (primary and secondary)
- [ ] Classes organized logically (by armor type or alphabetically)
- [ ] Professions organized by category
- [ ] Multiple component variants shown (sizes, with/without text)
- [ ] Responsive layout works on mobile/tablet/desktop

**Theme Switching:**
- [ ] Clicking Horde preset updates all colors immediately
- [ ] Clicking TBC preset updates all colors immediately
- [ ] Clicking WotLK preset updates all colors immediately
- [ ] Selected theme persists in localStorage
- [ ] Page loads with last selected theme
- [ ] Color transitions are smooth (not jarring)
- [ ] All components respond to theme changes
- [ ] Visual indicator shows which theme is active

**Code Quality:**
- [ ] No TypeScript errors
- [ ] No console errors or warnings
- [ ] Icons optimized (reasonable file sizes)
- [ ] Proper error handling for missing assets
- [ ] Code is well-organized and maintainable

**Testing:**
- [ ] `pnpm dev` runs successfully
- [ ] `/theme-demo` page loads without errors
- [ ] Theme switching works in both light and dark modes
- [ ] All icons render properly
- [ ] Background texture displays correctly
- [ ] Page is responsive across screen sizes

</verification>

<success_criteria>

This enhancement is successful when:

1. **Visual Fidelity**: The theme demo captures the look and feel of the original seios-aner page with background textures
2. **Complete Icon Coverage**: All WoW icons (classes, specs, professions, roles) display properly
3. **Comprehensive Display**: Every class and profession is showcased in the demo
4. **Functional Theme Switching**: Users can switch between preset themes and see immediate visual updates
5. **Production Ready**: All assets are optimized, accessible, and performant
6. **Demonstrable Value**: The demo effectively showcases the customization capabilities to stakeholders

The theme demo should now be a fully functional, visually impressive showcase that demonstrates the power of the customizable theme system and serves as a prototype for the admin theme editor.
</success_criteria>

<additional_context>

**For maximum efficiency:**
- Use parallel tool calls to read multiple seios-aner files simultaneously (CSS, component files, asset directories)
- When copying icons, consider batch operations if possible
- Test one icon type fully before moving to others (validate the pattern works)

**Asset optimization tips:**
- If seios-aner icons are too large, consider resizing to appropriate dimensions (e.g., 64x64 or 128x128)
- Use PNG format for icons with transparency
- Consider WebP format for better compression (with PNG fallbacks)
- Next.js Image component will handle optimization automatically

**Theme switching best practices:**
- Add a small transition delay (e.g., `transition: all 0.3s ease`) to color properties
- Batch CSS variable updates to avoid multiple reflows
- Consider using `requestAnimationFrame` if performance issues arise
- Provide user feedback during theme application (subtle loading indicator)

**Accessibility reminders:**
- Every icon needs descriptive alt text
- Color contrast should meet WCAG AA standards in all themes
- Theme switcher buttons should have clear labels and active states
- Test with keyboard navigation

This phase transforms the theme demo from a proof-of-concept to a polished, functional showcase that accurately represents the final product vision.
</additional_context>
