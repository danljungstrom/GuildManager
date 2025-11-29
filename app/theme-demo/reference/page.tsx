/**
 * Reference Documentation Page
 *
 * Complete design system documentation and guidelines.
 */

import { ComponentDemoLayout, DemoSection } from '../_components/component-demo-layout';
import { CodeBlock } from '../_components/code-block';

export default function ReferencePage() {
  return (
    <ComponentDemoLayout
      title="Design System Reference"
      description="Complete documentation for the GuildManager design system including patterns, guidelines, and best practices."
    >
      <DemoSection title="Overview">
        <div className="prose prose-sm max-w-none">
          <p className="text-muted-foreground">
            The GuildManager design system is built on modern web standards with a focus on
            customization, accessibility, and developer experience. It combines shadcn/ui
            components with WoW-specific elements to create a cohesive guild management interface.
          </p>
        </div>
      </DemoSection>

      <DemoSection title="Tech Stack">
        <div className="prose prose-sm max-w-none">
          <ul className="space-y-2 text-muted-foreground">
            <li><strong className="text-foreground">Next.js 15</strong> - React framework with App Router</li>
            <li><strong className="text-foreground">React 19</strong> - UI library</li>
            <li><strong className="text-foreground">TypeScript</strong> - Type-safe JavaScript</li>
            <li><strong className="text-foreground">Tailwind CSS v4</strong> - Utility-first CSS framework</li>
            <li><strong className="text-foreground">shadcn/ui</strong> - Component library based on Radix UI</li>
            <li><strong className="text-foreground">Radix UI</strong> - Unstyled, accessible component primitives</li>
            <li><strong className="text-foreground">Lucide React</strong> - Icon library</li>
          </ul>
        </div>
      </DemoSection>

      <DemoSection title="Design Principles">
        <div className="grid gap-4 md:grid-cols-2">
          <div className="p-4 rounded-lg border bg-card">
            <h4 className="font-semibold mb-2">Customizable by Default</h4>
            <p className="text-sm text-muted-foreground">
              All theme colors use CSS custom properties, allowing guilds to customize their
              branding without code changes.
            </p>
          </div>
          <div className="p-4 rounded-lg border bg-card">
            <h4 className="font-semibold mb-2">Accessibility First</h4>
            <p className="text-sm text-muted-foreground">
              Built on Radix UI primitives with full keyboard navigation, screen reader support,
              and ARIA attributes.
            </p>
          </div>
          <div className="p-4 rounded-lg border bg-card">
            <h4 className="font-semibold mb-2">Responsive Design</h4>
            <p className="text-sm text-muted-foreground">
              All components work seamlessly across mobile, tablet, and desktop viewports.
            </p>
          </div>
          <div className="p-4 rounded-lg border bg-card">
            <h4 className="font-semibold mb-2">Type Safety</h4>
            <p className="text-sm text-muted-foreground">
              Full TypeScript coverage ensures type safety and excellent developer experience.
            </p>
          </div>
        </div>
      </DemoSection>

      <DemoSection title="File Structure">
        <CodeBlock
          code={`app/
├── globals.css         # Global styles & CSS variables
├── layout.tsx          # Root layout
├── page.tsx            # Homepage
└── theme-demo/         # Design system showcase

components/
├── ui/                 # shadcn/ui base components
├── wow/                # WoW-specific components
└── theme-demo/         # Theme demo components

lib/
├── types/              # TypeScript type definitions
├── consts/             # Constants (classes, roles, etc.)
├── config/             # Configuration files
└── utils.ts            # Utility functions

public/
└── icons/              # Icon assets`}
        />
      </DemoSection>

      <DemoSection title="Adding Components">
        <div className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Use shadcn/ui CLI to add new components to the project:
          </p>
          <CodeBlock
            code={`# Add a single component
npx shadcn@latest add button

# Add multiple components
npx shadcn@latest add button card dialog

# List available components
npx shadcn@latest add`}
          />
        </div>
      </DemoSection>

      <DemoSection title="Styling Guidelines">
        <div className="prose prose-sm max-w-none">
          <h4 className="text-foreground mb-2">Color Usage</h4>
          <ul className="space-y-2 text-muted-foreground mb-4">
            <li>Always use CSS variables for colors (never hard-coded hex values)</li>
            <li>Use semantic color names (primary, destructive, muted) instead of specific colors</li>
            <li>Ensure foreground/background pairs have sufficient contrast</li>
          </ul>

          <h4 className="text-foreground mb-2">Component Patterns</h4>
          <ul className="space-y-2 text-muted-foreground mb-4">
            <li>Use the <code className="text-primary">cn()</code> utility for conditional classes</li>
            <li>Provide prop-based variants using class-variance-authority</li>
            <li>Forward refs for all components to support composition</li>
            <li>Include TypeScript types for all props</li>
          </ul>

          <h4 className="text-foreground mb-2">Responsive Design</h4>
          <ul className="space-y-2 text-muted-foreground">
            <li>Mobile-first approach (base styles are mobile, use md:, lg: for larger screens)</li>
            <li>Test all components at mobile, tablet, and desktop sizes</li>
            <li>Use Tailwind responsive prefixes (sm:, md:, lg:, xl:, 2xl:)</li>
          </ul>
        </div>
      </DemoSection>

      <DemoSection title="WoW-Specific Components">
        <div className="prose prose-sm max-w-none">
          <p className="text-muted-foreground mb-3">
            Custom components designed specifically for WoW guild management:
          </p>
          <ul className="space-y-2 text-muted-foreground">
            <li><strong className="text-foreground">ClassIcon</strong> - Display WoW class icons with authentic colors</li>
            <li><strong className="text-foreground">RoleIcon</strong> - Show Tank, DPS, or Healer role indicators</li>
            <li><strong className="text-foreground">SpecIcon</strong> - Display specialization icons</li>
            <li><strong className="text-foreground">ProfessionIcon</strong> - Show profession icons with skill levels</li>
            <li><strong className="text-foreground">AttendanceBadge</strong> - Raid attendance status badges</li>
          </ul>
        </div>
      </DemoSection>

      <DemoSection title="Dark Mode Support">
        <div className="prose prose-sm max-w-none">
          <p className="text-muted-foreground mb-3">
            The design system includes full dark mode support using CSS variables:
          </p>
          <CodeBlock
            code={`:root {
  --background: 0 0% 100%;
  --foreground: 20 14.3% 4.1%;
  /* ... */
}

.dark {
  --background: 20 14.3% 4.1%;
  --foreground: 60 9.1% 97.8%;
  /* ... */
}`}
          />
          <p className="text-muted-foreground mt-3">
            Toggle dark mode by adding/removing the <code className="text-primary">.dark</code> class
            on the root element.
          </p>
        </div>
      </DemoSection>

      <DemoSection title="Accessibility Checklist">
        <div className="prose prose-sm max-w-none">
          <ul className="space-y-2 text-muted-foreground">
            <li>✓ All interactive elements are keyboard accessible</li>
            <li>✓ Focus states are clearly visible</li>
            <li>✓ ARIA labels provided for icon-only buttons</li>
            <li>✓ Semantic HTML elements used throughout</li>
            <li>✓ Color contrast meets WCAG AA standards</li>
            <li>✓ Form inputs have associated labels</li>
            <li>✓ Screen reader tested with NVDA/JAWS</li>
          </ul>
        </div>
      </DemoSection>

      <DemoSection title="Resources">
        <div className="prose prose-sm max-w-none">
          <ul className="space-y-2 text-muted-foreground">
            <li>
              <a href="https://ui.shadcn.com" className="text-primary hover:underline" target="_blank" rel="noopener noreferrer">
                shadcn/ui Documentation
              </a>
            </li>
            <li>
              <a href="https://www.radix-ui.com" className="text-primary hover:underline" target="_blank" rel="noopener noreferrer">
                Radix UI Primitives
              </a>
            </li>
            <li>
              <a href="https://tailwindcss.com" className="text-primary hover:underline" target="_blank" rel="noopener noreferrer">
                Tailwind CSS Documentation
              </a>
            </li>
            <li>
              <a href="https://nextjs.org" className="text-primary hover:underline" target="_blank" rel="noopener noreferrer">
                Next.js Documentation
              </a>
            </li>
          </ul>
        </div>
      </DemoSection>
    </ComponentDemoLayout>
  );
}
