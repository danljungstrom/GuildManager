<objective>
Thoroughly evaluate the setup wizard implementation created with Copilot to ensure it follows project standards, best practices, and integrates properly with the existing GuildManager codebase.

This evaluation will identify:
- Alignment with project conventions (CLAUDE.md)
- Code quality and TypeScript best practices
- Integration with existing architecture (Firebase, contexts, types)
- UI/UX consistency with the design system
- Security considerations
- Edge cases and error handling
- Potential improvements or issues

The goal is to provide actionable feedback on what's working well and what needs refinement.
</objective>

<context>
The setup wizard was created using GitHub Copilot and consists of:
- `components/setup/SetupWizard.tsx` - Multi-step wizard component
- `app/admin/settings/page.tsx` - Admin settings page for post-setup configuration
- `lib/services/guild-config.service.ts` - Service layer for Firestore operations
- `lib/contexts/GuildContext.tsx` - React context for guild config management
- `lib/firebase/config.ts` - Firebase initialization
- Integration with `app/page.tsx` to show wizard on first load

The project uses:
- Next.js 15 with App Router
- Firebase Firestore for persistence
- shadcn/ui components
- TypeScript
- Tailwind CSS with CSS custom properties
- HSL color format for theming

Reference the CLAUDE.md file for project-specific conventions and guidelines.
</context>

<files_to_analyze>
@components/setup/SetupWizard.tsx
@app/admin/settings/page.tsx
@lib/services/guild-config.service.ts
@lib/contexts/GuildContext.tsx
@lib/firebase/config.ts
@lib/types/guild-config.types.ts
@app/page.tsx
@app/layout.tsx
</files_to_analyze>

<evaluation_criteria>
Evaluate the implementation across these dimensions:

## 1. Architecture & Integration
- Does it follow Next.js 15 App Router conventions?
- Is the separation of concerns appropriate (components, services, contexts)?
- Does it integrate cleanly with existing Firebase setup?
- Is the context provider used correctly?
- Are client/server boundaries handled properly?

## 2. TypeScript & Type Safety
- Are all types properly defined and imported?
- Are there any `any` types that should be more specific?
- Do type definitions match across files?
- Are optional vs required fields handled correctly?
- Are there type inconsistencies (e.g., `secondaryColor` vs `accentColor`)?

## 3. UI/UX & Design System
- Does it use shadcn/ui components consistently?
- Does it follow the project's HSL color theming approach?
- Is the multi-step wizard UX clear and intuitive?
- Are loading and error states handled properly?
- Is the UI responsive?
- Does it match the visual style of other pages?

## 4. Data Flow & State Management
- Is form state managed appropriately?
- Does the wizard handle validation correctly?
- Is the config properly fetched and refreshed?
- Are updates optimistic or pessimistic (reload vs refresh)?
- Is there proper error recovery?

## 5. Firebase & Firestore
- Is the Firestore document structure appropriate?
- Are reads/writes handled correctly?
- Is offline support considered?
- Are security rules needed (check firestore.rules)?
- Is the config document path consistent?

## 6. Error Handling & Edge Cases
- What happens if Firebase is not configured?
- How are network errors handled?
- What if the user navigates away mid-setup?
- Is there proper loading state during async operations?
- Are form validation errors clear to users?

## 7. Security Considerations
- Should the setup wizard be protected (only run once)?
- Should admin settings require authentication?
- Are there any XSS or injection vulnerabilities?
- Is user input sanitized?

## 8. Code Quality
- Is the code readable and maintainable?
- Are there any anti-patterns?
- Is error logging appropriate?
- Are there unnecessary dependencies or imports?
- Is naming consistent with the rest of the project?

## 9. Potential Bugs
- Color conversion logic in SetupWizard.tsx (lines 194-220)
- Type mismatches between GuildConfigInput and GuildConfig
- Window.location.reload() vs proper state management
- Hardcoded config document path
- Missing null checks

## 10. Missing Features
- Undo/cancel during setup
- Setup completion confirmation
- Migration path if schema changes
- Admin authentication
- Image upload for logo/favicon
</evaluation_criteria>

<output_format>
Provide your evaluation as a structured markdown report:

## Executive Summary
[2-3 sentence overview: Is this production-ready? Major concerns? Overall quality?]

## Strengths
[What was done well - be specific with file references and line numbers]

## Issues Found

### Critical Issues
[Issues that must be fixed before production - include severity, location, and specific fix]

### Medium Priority Issues
[Issues that should be addressed but aren't blockers]

### Low Priority / Enhancements
[Nice-to-haves and potential improvements]

## Code Alignment with Project Standards

### Follows CLAUDE.md Guidelines
[Specific examples where code aligns with project conventions]

### Deviations from Standards
[Where code doesn't follow project patterns and why it matters]

## Specific Code Review Comments

[File-by-file detailed feedback with line numbers, e.g.:]

**components/setup/SetupWizard.tsx**
- Line 194-220: Color conversion logic is problematic because...
- Line 39: window.location.reload() is not ideal because...

**lib/services/guild-config.service.ts**
- Line 5: Hardcoded document path should be...

[Continue for each file]

## Security Assessment
[Any security concerns and recommendations]

## Recommendations

### Must Do (Before Production)
1. [Specific action item with rationale]
2. [Specific action item with rationale]

### Should Do (Soon)
1. [Specific action item with rationale]
2. [Specific action item with rationale]

### Could Do (Future Enhancement)
1. [Specific action item with rationale]
2. [Specific action item with rationale]

## Conclusion
[Final verdict: Ship it? Fix first? Major refactor needed?]
</output_format>

<verification>
Before completing your evaluation:
1. Read all listed files completely
2. Check for consistency across files (naming, types, patterns)
3. Verify integration points (how components connect)
4. Look for common anti-patterns in React/Next.js
5. Consider the user journey through the wizard
6. Think about what could go wrong at runtime
7. Ensure all feedback is constructive and specific
</verification>

<success_criteria>
A successful evaluation will:
- Identify real issues with specific line numbers
- Explain WHY each issue matters
- Provide actionable recommendations
- Balance criticism with recognition of good work
- Consider both immediate bugs and long-term maintainability
- Reference project standards from CLAUDE.md
- Be thorough but concise
</success_criteria>
