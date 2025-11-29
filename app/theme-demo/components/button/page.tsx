'use client';

/**
 * Button Component Demo Page
 */

import { ComponentDemoLayout, DemoSection, PropsTable } from '../../_components/component-demo-layout';
import { CodeBlock } from '../../_components/code-block';
import { Button } from '@/components/ui/button';
import { ChevronRight, Mail, Loader2, Download, Plus, Trash2 } from 'lucide-react';
import Link from 'next/link';

export default function ButtonDemoPage() {
  return (
    <ComponentDemoLayout
      title="Button"
      description="Versatile button component with multiple variants, sizes, and states."
    >
      {/* Variants */}
      <DemoSection
        title="Variants"
        description="All available button style variants"
      >
        <div className="space-y-4">
          <div className="flex flex-wrap gap-3">
            <Button>Default</Button>
            <Button variant="secondary">Secondary</Button>
            <Button variant="outline">Outline</Button>
            <Button variant="ghost">Ghost</Button>
            <Button variant="link">Link</Button>
            <Button variant="destructive">Destructive</Button>
          </div>
          <CodeBlock
            code={`<Button>Default</Button>
<Button variant="secondary">Secondary</Button>
<Button variant="outline">Outline</Button>
<Button variant="ghost">Ghost</Button>
<Button variant="link">Link</Button>
<Button variant="destructive">Destructive</Button>`}
          />
        </div>
      </DemoSection>

      {/* Sizes */}
      <DemoSection
        title="Sizes"
        description="Different button sizes"
      >
        <div className="space-y-4">
          <div className="flex flex-wrap items-center gap-3">
            <Button size="sm">Small</Button>
            <Button size="default">Default</Button>
            <Button size="lg">Large</Button>
            <Button size="icon">
              <Mail className="h-4 w-4" />
            </Button>
          </div>
          <CodeBlock
            code={`<Button size="sm">Small</Button>
<Button size="default">Default</Button>
<Button size="lg">Large</Button>
<Button size="icon">
  <Mail className="h-4 w-4" />
</Button>`}
          />
        </div>
      </DemoSection>

      {/* With Icons */}
      <DemoSection
        title="With Icons"
        description="Buttons with icon decorations"
      >
        <div className="space-y-4">
          <div className="flex flex-wrap gap-3">
            <Button>
              <Mail className="mr-2 h-4 w-4" />
              Email
            </Button>
            <Button variant="outline">
              Download
              <Download className="ml-2 h-4 w-4" />
            </Button>
            <Button variant="secondary">
              <Plus className="mr-2 h-4 w-4" />
              Add Item
            </Button>
            <Button variant="destructive">
              <Trash2 className="mr-2 h-4 w-4" />
              Delete
            </Button>
          </div>
          <CodeBlock
            code={`<Button>
  <Mail className="mr-2 h-4 w-4" />
  Email
</Button>
<Button variant="outline">
  Download
  <Download className="ml-2 h-4 w-4" />
</Button>`}
          />
        </div>
      </DemoSection>

      {/* Icon Buttons */}
      <DemoSection
        title="Icon Buttons"
        description="Square icon-only buttons"
      >
        <div className="space-y-4">
          <div className="flex flex-wrap gap-3">
            <Button size="icon">
              <Mail className="h-4 w-4" />
            </Button>
            <Button size="icon" variant="outline">
              <Download className="h-4 w-4" />
            </Button>
            <Button size="icon" variant="ghost">
              <Plus className="h-4 w-4" />
            </Button>
            <Button size="icon" variant="destructive">
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
          <CodeBlock
            code={`<Button size="icon">
  <Mail className="h-4 w-4" />
</Button>`}
          />
        </div>
      </DemoSection>

      {/* Loading State */}
      <DemoSection
        title="Loading State"
        description="Buttons with loading indicators"
      >
        <div className="space-y-4">
          <div className="flex flex-wrap gap-3">
            <Button disabled>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Loading...
            </Button>
            <Button variant="outline" disabled>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Please wait
            </Button>
            <Button variant="secondary" disabled>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Processing
            </Button>
          </div>
          <CodeBlock
            code={`<Button disabled>
  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
  Loading...
</Button>`}
          />
        </div>
      </DemoSection>

      {/* Disabled State */}
      <DemoSection
        title="Disabled State"
        description="Disabled buttons across all variants"
      >
        <div className="space-y-4">
          <div className="flex flex-wrap gap-3">
            <Button disabled>Default</Button>
            <Button variant="secondary" disabled>Secondary</Button>
            <Button variant="outline" disabled>Outline</Button>
            <Button variant="ghost" disabled>Ghost</Button>
            <Button variant="link" disabled>Link</Button>
            <Button variant="destructive" disabled>Destructive</Button>
          </div>
          <CodeBlock
            code={`<Button disabled>Default</Button>
<Button variant="secondary" disabled>Secondary</Button>
<Button variant="outline" disabled>Outline</Button>`}
          />
        </div>
      </DemoSection>

      {/* As Child (Link) */}
      <DemoSection
        title="As Link"
        description="Button component rendered as Next.js Link"
      >
        <div className="space-y-4">
          <div className="flex flex-wrap gap-3">
            <Button asChild>
              <Link href="/theme-demo">
                Go to Theme Demo
                <ChevronRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button variant="outline" asChild>
              <Link href="/roster">View Roster</Link>
            </Button>
          </div>
          <CodeBlock
            code={`<Button asChild>
  <Link href="/theme-demo">
    Go to Theme Demo
    <ChevronRight className="ml-2 h-4 w-4" />
  </Link>
</Button>`}
          />
        </div>
      </DemoSection>

      {/* Button Groups */}
      <DemoSection
        title="Button Groups"
        description="Multiple buttons grouped together"
      >
        <div className="space-y-4">
          <div className="flex flex-wrap gap-0">
            <Button variant="outline" className="rounded-r-none">
              First
            </Button>
            <Button variant="outline" className="rounded-none border-l-0">
              Second
            </Button>
            <Button variant="outline" className="rounded-l-none border-l-0">
              Third
            </Button>
          </div>
          <CodeBlock
            code={`<div className="flex flex-wrap gap-0">
  <Button variant="outline" className="rounded-r-none">First</Button>
  <Button variant="outline" className="rounded-none border-l-0">Second</Button>
  <Button variant="outline" className="rounded-l-none border-l-0">Third</Button>
</div>`}
          />
        </div>
      </DemoSection>

      {/* Props Documentation */}
      <DemoSection title="Props">
        <PropsTable
          data={[
            {
              prop: 'variant',
              type: '"default" | "secondary" | "outline" | "ghost" | "link" | "destructive"',
              default: '"default"',
              description: 'The visual style variant of the button',
            },
            {
              prop: 'size',
              type: '"default" | "sm" | "lg" | "icon"',
              default: '"default"',
              description: 'The size of the button',
            },
            {
              prop: 'asChild',
              type: 'boolean',
              default: 'false',
              description: 'Render as a child component (useful for Link)',
            },
            {
              prop: 'disabled',
              type: 'boolean',
              default: 'false',
              description: 'Disables the button',
            },
            {
              prop: 'className',
              type: 'string',
              description: 'Additional CSS classes to apply',
            },
          ]}
        />
      </DemoSection>

      {/* Accessibility Notes */}
      <DemoSection title="Accessibility">
        <div className="prose prose-sm max-w-none">
          <ul className="space-y-2 text-muted-foreground">
            <li>Buttons are fully keyboard accessible and can be activated with <code className="text-primary">Space</code> or <code className="text-primary">Enter</code></li>
            <li>Use descriptive button text that clearly indicates the action</li>
            <li>For icon-only buttons, provide an <code className="text-primary">aria-label</code> for screen readers</li>
            <li>Disabled buttons are automatically removed from keyboard navigation</li>
            <li>Focus indicators are clearly visible for keyboard navigation</li>
            <li>Use the <code className="text-primary">asChild</code> prop to render buttons as links for navigation actions</li>
          </ul>
        </div>
      </DemoSection>
    </ComponentDemoLayout>
  );
}
