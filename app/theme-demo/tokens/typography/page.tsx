/**
 * Typography Token Page
 *
 * Documentation for typography styles and text formatting.
 */

import { ComponentDemoLayout, DemoSection } from '../../_components/component-demo-layout';

export default function TypographyTokenPage() {
  return (
    <ComponentDemoLayout
      title="Typography"
      description="Typography system including headings, body text, and specialized text styles."
    >
      <DemoSection
        title="Headings"
        description="Semantic heading levels from h1 to h6"
      >
        <div className="space-y-4">
          <h1 className="text-4xl font-bold tracking-tight">Heading 1</h1>
          <h2 className="text-3xl font-bold tracking-tight">Heading 2</h2>
          <h3 className="text-2xl font-bold tracking-tight">Heading 3</h3>
          <h4 className="text-xl font-semibold tracking-tight">Heading 4</h4>
          <h5 className="text-lg font-semibold tracking-tight">Heading 5</h5>
          <h6 className="text-base font-semibold tracking-tight">Heading 6</h6>
        </div>
      </DemoSection>

      <DemoSection
        title="Body Text"
        description="Standard body text and variants"
      >
        <div className="space-y-4">
          <p className="text-base">
            This is the default body text size. It&apos;s designed for comfortable reading across
            all devices and screen sizes. The text uses the system font stack for optimal
            performance and native feel.
          </p>
          <p className="text-sm">
            This is small body text, often used for secondary information, captions, or
            supporting content that doesn&apos;t need to be as prominent.
          </p>
          <p className="text-xs">
            This is extra small text, typically used for labels, metadata, or very minor
            supporting information.
          </p>
          <p className="text-lg">
            This is large body text, used for emphasized paragraphs or lead text that should
            stand out from regular content.
          </p>
        </div>
      </DemoSection>

      <DemoSection
        title="Text Colors"
        description="Semantic text color utilities"
      >
        <div className="space-y-2">
          <p className="text-foreground">Default foreground text</p>
          <p className="text-muted-foreground">Muted foreground text for secondary content</p>
          <p className="text-primary">Primary colored text</p>
          <p className="text-destructive">Destructive/error text</p>
        </div>
      </DemoSection>

      <DemoSection
        title="Font Weights"
        description="Available font weight variations"
      >
        <div className="space-y-2">
          <p className="font-normal">Normal weight (400)</p>
          <p className="font-medium">Medium weight (500)</p>
          <p className="font-semibold">Semibold weight (600)</p>
          <p className="font-bold">Bold weight (700)</p>
        </div>
      </DemoSection>

      <DemoSection
        title="Text Formatting"
        description="Common text formatting utilities"
      >
        <div className="space-y-2">
          <p className="italic">Italic text</p>
          <p className="underline">Underlined text</p>
          <p className="line-through">Strike-through text</p>
          <p className="uppercase">Uppercase text</p>
          <p className="lowercase">LOWERCASE TEXT</p>
          <p className="capitalize">capitalized text</p>
        </div>
      </DemoSection>

      <DemoSection
        title="Monospace"
        description="Monospace font for code and technical content"
      >
        <div className="space-y-2">
          <p className="font-mono text-sm">const variable = &quot;monospace text&quot;;</p>
          <code className="text-sm bg-muted px-1.5 py-0.5 rounded">inline code</code>
        </div>
      </DemoSection>

      <DemoSection
        title="Lists"
        description="Unordered and ordered lists"
      >
        <div className="grid gap-6 md:grid-cols-2">
          <div>
            <h4 className="text-sm font-semibold mb-2">Unordered List</h4>
            <ul className="list-disc list-inside space-y-1 text-sm">
              <li>First item</li>
              <li>Second item</li>
              <li>Third item</li>
            </ul>
          </div>
          <div>
            <h4 className="text-sm font-semibold mb-2">Ordered List</h4>
            <ol className="list-decimal list-inside space-y-1 text-sm">
              <li>First step</li>
              <li>Second step</li>
              <li>Third step</li>
            </ol>
          </div>
        </div>
      </DemoSection>

      <DemoSection title="Usage">
        <div className="prose prose-sm max-w-none">
          <pre className="bg-muted/50 border rounded-md p-4 overflow-x-auto text-sm">
            <code>{`// Heading
<h1 className="text-3xl font-bold tracking-tight">Page Title</h1>

// Body text
<p className="text-base text-muted-foreground">
  Supporting text content
</p>

// Code
<code className="font-mono text-sm">inline code</code>`}</code>
          </pre>
        </div>
      </DemoSection>
    </ComponentDemoLayout>
  );
}
