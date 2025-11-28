<objective>
Establish visual hierarchy and consistency across all WoW icon components by implementing appropriate borders and shapes: circular borders for character identity elements (class, spec, role) and rounded rectangular borders for profession icons.

This creates clear visual grouping and removes design inconsistencies like the awkward "square border around circular icon" issue currently present in role icons.
</objective>

<context>
Phase 2 successfully implemented all icon assets and displays them in the theme demo. However, the icon components lack consistent border treatment and visual hierarchy:

**Current Issues:**
1. **Profession icons** - No borders at all
2. **Role icons** - Awkward square border around circular icons (makes them look cramped/small)
3. **Spec icons** - Need consistent treatment with class icons
4. **Class icons** - Need to verify current border implementation

**Desired Visual Hierarchy:**
- **Character Identity Elements** (Class, Spec, Role) → Circular icons with colored borders
  - Class icons: Border color based on class color
  - Spec icons: Border color based on parent class color
  - Role icons: Border color based on role color (tank/dps/healer)
- **Profession Icons** → Rounded rectangular/square icons with neutral or themed borders
  - Distinct shape differentiates them from character identity
  - Rounded corners maintain modern aesthetic

**Tech Stack:**
- React 19 with TypeScript
- Tailwind CSS v3
- Next.js Image component
- Existing WoW components in `components/wow/`

**Current Component Files:**
- `components/wow/ClassIcon.tsx`
- `components/wow/SpecIcon.tsx`
- `components/wow/RoleIcon.tsx`
- `components/wow/ProfessionIcon.tsx`
</context>

<requirements>

1. **Class Icons (ClassIcon.tsx):**
   - Ensure circular presentation (likely already implemented)
   - Add colored border using class color from constants
   - Border should be visible but not overwhelming (2-3px)
   - Border color should use CSS variables for class colors
   - Verify size variations (sm, md, lg) all look good with borders

2. **Spec Icons (SpecIcon.tsx):**
   - Implement circular presentation matching class icons
   - Border color should use parent class color
   - Same border width as class icons for consistency
   - Maintain size variants

3. **Role Icons (RoleIcon.tsx):**
   - **Remove square border** around circular icon
   - Implement circular border using role color
   - Increase size slightly (icons currently appear small)
   - Border color should use role CSS variables (--role-tank, --role-dps, --role-healer)
   - Ensure proper sizing across variants

4. **Profession Icons (ProfessionIcon.tsx):**
   - Implement **rounded rectangular** borders (distinct from circular character elements)
   - Border radius: rounded-lg or rounded-xl (test which looks better)
   - Border color: neutral (border color from theme) or subtle themed color
   - Maintain skill level display functionality
   - Consider slightly different aspect ratio or padding to emphasize rectangular nature

5. **Consistency Across All Icons:**
   - Same border width across all icon types (2-3px)
   - Consistent padding/spacing inside borders
   - All icons should use Tailwind classes for maintainability
   - Responsive sizing should work consistently
   - Hover states should be consistent (if applicable)

</requirements>

<implementation>

<phase_1_audit>
**Audit Current Implementation:**
1. Read all four icon component files in parallel
2. Document current border/shape implementations
3. Identify what needs to change for each component
4. Note any existing Tailwind classes that can be reused
</phase_1_audit>

<phase_2_class_and_spec_icons>
**Update ClassIcon.tsx:**
1. Ensure wrapper div has `rounded-full` class for circular shape
2. Add border using Tailwind: `border-2` or `border-3`
3. Border color should use class-specific CSS variable:
   ```tsx
   style={{ borderColor: `hsl(var(--class-${className.toLowerCase()}))` }}
   ```
4. Add `ring-offset-background` if using ring effects
5. Test all size variants (sm, md, lg)

**Update SpecIcon.tsx:**
1. Follow same pattern as ClassIcon
2. Use parent class color for border:
   ```tsx
   style={{ borderColor: `hsl(var(--class-${className.toLowerCase()}))` }}
   ```
3. Ensure circular shape with `rounded-full`
4. Match border width with ClassIcon
</phase_2_class_and_spec_icons>

<phase_3_role_icons>
**Update RoleIcon.tsx:**
1. **Remove any square container** - icon should be directly circular
2. Change wrapper to circular with `rounded-full`
3. Add role-colored border:
   ```tsx
   style={{ borderColor: `hsl(var(--role-${role.toLowerCase()}))` }}
   ```
4. Increase base size slightly (e.g., if currently 32px, try 40px)
5. Ensure proper padding so icon doesn't touch border
6. Update size variants to be more generous
7. Test appearance in all three roles (tank, dps, healer)
</phase_3_role_icons>

<phase_4_profession_icons>
**Update ProfessionIcon.tsx:**
1. Use `rounded-lg` or `rounded-xl` for rounded rectangle shape
2. Add border with neutral color:
   ```tsx
   className="border-2 border-border rounded-lg"
   ```
3. Consider aspect ratio - professions could be slightly wider than tall (4:3 ratio?)
4. Maintain skill level badge display
5. Ensure skill tier colors are still visible and don't clash with border
6. Test with all profession categories
</phase_4_profession_icons>

<phase_5_consistency_polish>
**Ensure Consistency:**
1. All icons use same border width (likely `border-2`)
2. Verify padding is consistent (use `p-1` or `p-1.5`)
3. Check hover states - add if beneficial:
   ```tsx
   className="... hover:scale-105 transition-transform"
   ```
4. Ensure all size variants work well:
   - sm: Suitable for dense lists
   - md: Default, comfortable viewing
   - lg: Featured display
5. Test in theme demo with different themes and dark/light modes
</phase_5_consistency_polish>

</implementation>

<constraints>

**DO:**
- Use Tailwind CSS classes for all styling
- Use CSS variables for dynamic colors (class colors, role colors)
- Maintain existing fallback text rendering for missing icons
- Keep TypeScript types strict
- Test with all themes (default, Horde, TBC, WotLK)
- Preserve existing component props and behavior
- Ensure accessibility (alt text, proper contrast)

**DO NOT:**
- Hard-code colors - use CSS variables
- Break existing functionality
- Change component APIs (maintain backward compatibility)
- Make borders too thick or overwhelming
- Skip testing size variants
- Forget dark mode compatibility

**WHY these constraints:**
- CSS variables enable theme customization
- Tailwind classes are maintainable and consistent
- Backward compatibility ensures existing usage doesn't break
- Proper sizing ensures icons work in all contexts (lists, cards, headers)
- Dark mode support is critical for user experience
</constraints>

<output>

**Files to Update:**
- `components/wow/ClassIcon.tsx` - Add/verify circular border with class color
- `components/wow/SpecIcon.tsx` - Add circular border with class color
- `components/wow/RoleIcon.tsx` - Fix square-around-circle issue, make circular with role color border
- `components/wow/ProfessionIcon.tsx` - Add rounded rectangular border with neutral color

**No new files needed** - this is purely enhancement of existing components.

</output>

<verification>

Before declaring complete, verify:

**Visual Consistency:**
- [ ] All class icons have circular borders with appropriate class colors
- [ ] All spec icons have circular borders with parent class colors
- [ ] All role icons are circular (no square border) with role colors
- [ ] All profession icons have rounded rectangular borders
- [ ] Border width is consistent across all icon types

**Size Variants:**
- [ ] Small (sm) size works well for all icon types
- [ ] Medium (md) size is comfortable default for all icon types
- [ ] Large (lg) size works well for featured display
- [ ] Role icons no longer appear too small

**Color and Theme:**
- [ ] Class borders use correct class colors
- [ ] Spec borders use correct parent class colors
- [ ] Role borders use correct role colors
- [ ] Profession borders work with neutral theme color
- [ ] All borders visible in both light and dark modes
- [ ] Borders work with all theme presets (default, Horde, TBC, WotLK)

**Component Behavior:**
- [ ] Fallback text rendering still works
- [ ] All props still function correctly
- [ ] No TypeScript errors
- [ ] No console warnings
- [ ] Existing usage in theme demo works correctly

**Theme Demo Display:**
- [ ] Class showcase section looks polished
- [ ] Spec showcase section looks polished
- [ ] Role showcase section looks polished
- [ ] Profession showcase section looks polished
- [ ] Visual hierarchy is clear (circular vs rounded rectangle)
- [ ] Icons are distinguishable and well-spaced

**Accessibility:**
- [ ] Borders have sufficient contrast in all themes
- [ ] Icons remain identifiable with borders
- [ ] Alt text still present and accurate
- [ ] Focus states work properly (if applicable)

</verification>

<success_criteria>

This enhancement is successful when:

1. **Clear Visual Hierarchy**: Character identity elements (class, spec, role) are visually grouped with circular borders, while professions are distinct with rounded rectangles
2. **Consistent Borders**: All icons have appropriate borders with consistent width and proper color theming
3. **No Awkward Designs**: The "square around circle" role icon issue is resolved
4. **Proper Sizing**: Role icons no longer appear too small
5. **Theme Compatible**: Borders work beautifully with all theme presets and dark/light modes
6. **Production Ready**: No regressions, all TypeScript types correct, code is maintainable

The icon system should feel cohesive, professional, and ready for production use.
</success_criteria>

<additional_context>

**Design Principles:**
- Circular = Character Identity (who you are: class, spec, role)
- Rounded Rectangle = Character Skills (what you do: professions)
- This creates intuitive visual grouping

**Border Width Guidance:**
- 2px (`border-2`) is subtle and elegant
- 3px (`border-3`) is more prominent, may work better for smaller sizes
- Test both and choose what looks best

**Color Considerations:**
- Class/spec borders in class colors reinforce identity
- Role borders in role colors maintain clarity
- Profession borders in neutral allow flexibility
- All should remain visible in both dark/light modes

**Responsive Behavior:**
- Icons may appear at different sizes in different contexts
- Borders should scale proportionally
- Test in grid layouts, lists, and inline contexts

**Future Extensibility:**
- This pattern can extend to other WoW elements (factions, achievements, etc.)
- Circular = identity, Rounded rectangle = items/skills/systems
- Keep this pattern in mind for future components
</additional_context>
