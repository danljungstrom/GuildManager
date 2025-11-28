'use client';

/**
 * Badge Component Demo Page
 */

import { ComponentDemoLayout, DemoSection, PropsTable } from '../../_components/component-demo-layout';
import { CodeBlock } from '../../_components/code-block';
import { Badge } from '@/components/ui/badge';
import { Check, X, AlertCircle, Info } from 'lucide-react';

export default function BadgeDemoPage() {
  return (
    <ComponentDemoLayout
      title="Badge"
      description="Small badge component for labels, status indicators, and tags."
    >
      {/* Variants */}
      <DemoSection
        title="Variants"
        description="All available badge variants"
      >
        <div className="space-y-4">
          <div className="flex flex-wrap gap-3">
            <Badge>Default</Badge>
            <Badge variant="secondary">Secondary</Badge>
            <Badge variant="outline">Outline</Badge>
            <Badge variant="destructive">Destructive</Badge>
          </div>
          <CodeBlock
            code={`<Badge>Default</Badge>
<Badge variant="secondary">Secondary</Badge>
<Badge variant="outline">Outline</Badge>
<Badge variant="destructive">Destructive</Badge>`}
          />
        </div>
      </DemoSection>

      {/* With Icons */}
      <DemoSection
        title="With Icons"
        description="Badges with icon decorations"
      >
        <div className="space-y-4">
          <div className="flex flex-wrap gap-3">
            <Badge>
              <Check className="h-3 w-3 mr-1" />
              Completed
            </Badge>
            <Badge variant="destructive">
              <X className="h-3 w-3 mr-1" />
              Failed
            </Badge>
            <Badge variant="secondary">
              <AlertCircle className="h-3 w-3 mr-1" />
              Warning
            </Badge>
            <Badge variant="outline">
              <Info className="h-3 w-3 mr-1" />
              Info
            </Badge>
          </div>
          <CodeBlock
            code={`<Badge>
  <Check className="h-3 w-3 mr-1" />
  Completed
</Badge>`}
          />
        </div>
      </DemoSection>

      {/* Status Badges */}
      <DemoSection
        title="Status Indicators"
        description="Common status badge patterns"
      >
        <div className="space-y-4">
          <div className="flex flex-wrap gap-3">
            <Badge className="bg-green-500 hover:bg-green-500/80">Active</Badge>
            <Badge className="bg-yellow-500 hover:bg-yellow-500/80">Pending</Badge>
            <Badge className="bg-red-500 hover:bg-red-500/80">Inactive</Badge>
            <Badge className="bg-blue-500 hover:bg-blue-500/80">In Progress</Badge>
            <Badge className="bg-purple-500 hover:bg-purple-500/80">Review</Badge>
          </div>
          <CodeBlock
            code={`<Badge className="bg-green-500 hover:bg-green-500/80">Active</Badge>
<Badge className="bg-yellow-500 hover:bg-yellow-500/80">Pending</Badge>
<Badge className="bg-red-500 hover:bg-red-500/80">Inactive</Badge>`}
          />
        </div>
      </DemoSection>

      {/* WoW Class Badges */}
      <DemoSection
        title="WoW Class Badges"
        description="Using WoW class colors"
      >
        <div className="space-y-4">
          <div className="flex flex-wrap gap-3">
            <Badge className="bg-class-warrior hover:bg-class-warrior/80">Warrior</Badge>
            <Badge className="bg-class-paladin hover:bg-class-paladin/80 text-foreground">Paladin</Badge>
            <Badge className="bg-class-hunter hover:bg-class-hunter/80 text-foreground">Hunter</Badge>
            <Badge className="bg-class-rogue hover:bg-class-rogue/80 text-foreground">Rogue</Badge>
            <Badge className="bg-class-priest hover:bg-class-priest/80 text-foreground">Priest</Badge>
            <Badge className="bg-class-shaman hover:bg-class-shaman/80">Shaman</Badge>
            <Badge className="bg-class-mage hover:bg-class-mage/80 text-foreground">Mage</Badge>
            <Badge className="bg-class-warlock hover:bg-class-warlock/80">Warlock</Badge>
            <Badge className="bg-class-druid hover:bg-class-druid/80">Druid</Badge>
          </div>
          <CodeBlock
            code={`<Badge className="bg-class-warrior hover:bg-class-warrior/80">Warrior</Badge>
<Badge className="bg-class-mage hover:bg-class-mage/80 text-foreground">Mage</Badge>`}
          />
        </div>
      </DemoSection>

      {/* WoW Role Badges */}
      <DemoSection
        title="WoW Role Badges"
        description="Using WoW role colors"
      >
        <div className="space-y-4">
          <div className="flex flex-wrap gap-3">
            <Badge className="bg-role-tank hover:bg-role-tank/80">Tank</Badge>
            <Badge className="bg-role-dps hover:bg-role-dps/80">DPS</Badge>
            <Badge className="bg-role-healer hover:bg-role-healer/80">Healer</Badge>
          </div>
          <CodeBlock
            code={`<Badge className="bg-role-tank hover:bg-role-tank/80">Tank</Badge>
<Badge className="bg-role-dps hover:bg-role-dps/80">DPS</Badge>
<Badge className="bg-role-healer hover:bg-role-healer/80">Healer</Badge>`}
          />
        </div>
      </DemoSection>

      {/* Interactive Badges */}
      <DemoSection
        title="Interactive Badges"
        description="Badges as clickable elements"
      >
        <div className="space-y-4">
          <div className="flex flex-wrap gap-3">
            <Badge className="cursor-pointer hover:bg-primary/70">
              Clickable
            </Badge>
            <Badge variant="outline" className="cursor-pointer hover:bg-accent">
              Tag
            </Badge>
            <Badge variant="secondary" className="cursor-pointer hover:bg-secondary/70">
              Filter
              <X className="h-3 w-3 ml-1" />
            </Badge>
          </div>
          <CodeBlock
            code={`<Badge className="cursor-pointer hover:bg-primary/70">
  Clickable
</Badge>`}
          />
        </div>
      </DemoSection>

      {/* Sizes */}
      <DemoSection
        title="Custom Sizes"
        description="Adjusting badge size with custom classes"
      >
        <div className="space-y-4">
          <div className="flex flex-wrap items-center gap-3">
            <Badge className="text-xs px-2 py-0">Small</Badge>
            <Badge>Default</Badge>
            <Badge className="text-sm px-3 py-1">Large</Badge>
          </div>
          <CodeBlock
            code={`<Badge className="text-xs px-2 py-0">Small</Badge>
<Badge>Default</Badge>
<Badge className="text-sm px-3 py-1">Large</Badge>`}
          />
        </div>
      </DemoSection>

      {/* Props Documentation */}
      <DemoSection title="Props">
        <PropsTable
          data={[
            {
              prop: 'variant',
              type: '"default" | "secondary" | "outline" | "destructive"',
              default: '"default"',
              description: 'The visual style variant of the badge',
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
            <li>Badges are purely visual by default and don't receive keyboard focus</li>
            <li>If making badges interactive, ensure they are keyboard accessible (use button or link elements)</li>
            <li>Ensure sufficient color contrast between badge background and text</li>
            <li>Don't rely solely on color to convey meaning - use text or icons as well</li>
            <li>For status badges, consider adding <code className="text-primary">aria-label</code> for screen readers</li>
          </ul>
        </div>
      </DemoSection>
    </ComponentDemoLayout>
  );
}
