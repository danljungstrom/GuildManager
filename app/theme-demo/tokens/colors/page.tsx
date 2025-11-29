/**
 * Colors Token Page
 *
 * Documentation for the color system and CSS variables.
 */

import { ComponentDemoLayout, DemoSection } from '../../_components/component-demo-layout';
import { ColorPalette } from '@/components/theme-demo/ColorPalette';

export default function ColorsTokenPage() {
  return (
    <ComponentDemoLayout
      title="Color Tokens"
      description="Complete color palette including base colors, semantic colors, and WoW-specific class and role colors."
    >
      <DemoSection
        title="Color Palette"
        description="All colors are defined using CSS custom properties in HSL format"
      >
        <ColorPalette />
      </DemoSection>

      <DemoSection title="Usage">
        <div className="prose prose-sm max-w-none">
          <p className="text-muted-foreground">
            Colors are implemented as CSS custom properties (CSS variables) which allows for
            runtime theme customization without rebuilding the application.
          </p>
          <h4 className="text-foreground mt-4 mb-2">Using in Tailwind</h4>
          <pre className="bg-muted/50 border rounded-md p-4 overflow-x-auto text-sm">
            <code>{`<div className="bg-primary text-primary-foreground">
  Primary background with foreground text
</div>

<div className="text-class-warrior">
  Warrior class color
</div>`}</code>
          </pre>

          <h4 className="text-foreground mt-4 mb-2">Using in CSS</h4>
          <pre className="bg-muted/50 border rounded-md p-4 overflow-x-auto text-sm">
            <code>{`.custom-element {
  background-color: hsl(var(--primary));
  color: hsl(var(--primary-foreground));
}

.warrior-text {
  color: hsl(var(--class-warrior));
}`}</code>
          </pre>
        </div>
      </DemoSection>

      <DemoSection title="Color Categories">
        <div className="prose prose-sm max-w-none">
          <ul className="space-y-2 text-muted-foreground">
            <li><strong className="text-foreground">Base Colors</strong> - Primary, secondary, background, foreground</li>
            <li><strong className="text-foreground">Component Colors</strong> - Card, popover, muted, accent</li>
            <li><strong className="text-foreground">Form Colors</strong> - Border, input, ring</li>
            <li><strong className="text-foreground">Semantic Colors</strong> - Success, warning, error, info, destructive</li>
            <li><strong className="text-foreground">WoW Class Colors</strong> - All 9 class colors (Druid, Hunter, Mage, etc.)</li>
            <li><strong className="text-foreground">WoW Role Colors</strong> - Tank, DPS, Healer</li>
            <li><strong className="text-foreground">Attunement Colors</strong> - Raid attunement status colors</li>
          </ul>
        </div>
      </DemoSection>
    </ComponentDemoLayout>
  );
}
