'use client';

/**
 * Input Component Demo Page
 */

import { ComponentDemoLayout, DemoSection, PropsTable } from '../../_components/component-demo-layout';
import { CodeBlock } from '../../_components/code-block';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Search, Mail } from 'lucide-react';

export default function InputDemoPage() {
  return (
    <ComponentDemoLayout
      title="Input"
      description="Text input field component for forms and user input."
    >
      {/* Basic Usage */}
      <DemoSection
        title="Basic Input"
        description="Default text input with placeholder"
      >
        <div className="space-y-4">
          <div className="space-y-2 relative">
            <Label htmlFor="basic-input">Email</Label>
            <Input id="basic-input" type="email" placeholder="Enter your email..." />
          </div>
          <CodeBlock
            code={`<Input type="email" placeholder="Enter your email..." />`}
          />
        </div>
      </DemoSection>

      {/* Input Types */}
      <DemoSection
        title="Input Types"
        description="Different HTML input types"
      >
        <div className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2 relative">
              <Label htmlFor="text-input">Text</Label>
              <Input id="text-input" type="text" placeholder="Text input" />
            </div>
            <div className="space-y-2 relative">
              <Label htmlFor="email-input">Email</Label>
              <Input id="email-input" type="email" placeholder="email@example.com" />
            </div>
            <div className="space-y-2 relative">
              <Label htmlFor="password-input">Password</Label>
              <Input id="password-input" type="password" placeholder="Password" />
            </div>
            <div className="space-y-2 relative">
              <Label htmlFor="number-input">Number</Label>
              <Input id="number-input" type="number" placeholder="123" />
            </div>
            <div className="space-y-2 relative">
              <Label htmlFor="tel-input">Telephone</Label>
              <Input id="tel-input" type="tel" placeholder="(555) 123-4567" />
            </div>
            <div className="space-y-2 relative">
              <Label htmlFor="url-input">URL</Label>
              <Input id="url-input" type="url" placeholder="https://example.com" />
            </div>
            <div className="space-y-2 relative">
              <Label htmlFor="date-input">Date</Label>
              <Input id="date-input" type="date" />
            </div>
            <div className="space-y-2 relative">
              <Label htmlFor="time-input">Time</Label>
              <Input id="time-input" type="time" />
            </div>
          </div>
          <CodeBlock
            code={`<Input type="text" placeholder="Text input" />
<Input type="email" placeholder="email@example.com" />
<Input type="password" placeholder="Password" />
<Input type="number" placeholder="123" />`}
          />
        </div>
      </DemoSection>

      {/* States */}
      <DemoSection
        title="States"
        description="Disabled and read-only states"
      >
        <div className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2 relative">
              <Label htmlFor="disabled-input">Disabled</Label>
              <Input id="disabled-input" placeholder="Disabled input" disabled />
            </div>
            <div className="space-y-2 relative">
              <Label htmlFor="readonly-input">Read-only</Label>
              <Input id="readonly-input" value="Read-only value" readOnly />
            </div>
          </div>
          <CodeBlock
            code={`<Input placeholder="Disabled input" disabled />
<Input value="Read-only value" readOnly />`}
          />
        </div>
      </DemoSection>

      {/* With Icons */}
      <DemoSection
        title="With Icons"
        description="Input fields with icon decorations"
      >
        <div className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="search-input">Search</Label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input id="search-input" placeholder="Search..." className="pl-10" />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="email-icon-input">Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input id="email-icon-input" type="email" placeholder="Email" className="pl-10" />
              </div>
            </div>
          </div>
          <CodeBlock
            code={`<div className="relative">
  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
  <Input placeholder="Search..." className="pl-10" />
</div>`}
          />
        </div>
      </DemoSection>

      {/* File Input */}
      <DemoSection
        title="File Input"
        description="File upload input with custom styling"
      >
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="file-input">Upload File</Label>
            <Input id="file-input" type="file" />
          </div>
          <CodeBlock
            code={`<Input type="file" />`}
          />
        </div>
      </DemoSection>

      {/* Props Documentation */}
      <DemoSection title="Props">
        <PropsTable
          data={[
            {
              prop: 'type',
              type: 'string',
              default: 'text',
              description: 'The HTML input type (text, email, password, number, etc.)',
            },
            {
              prop: 'placeholder',
              type: 'string',
              description: 'Placeholder text displayed when input is empty',
            },
            {
              prop: 'disabled',
              type: 'boolean',
              default: 'false',
              description: 'Disables the input field',
            },
            {
              prop: 'readOnly',
              type: 'boolean',
              default: 'false',
              description: 'Makes the input read-only',
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
            <li>Always use a <code className="text-primary">Label</code> component with inputs for accessibility</li>
            <li>Use appropriate <code className="text-primary">type</code> attributes for better mobile keyboard support</li>
            <li>Provide clear placeholder text that doesn't replace labels</li>
            <li>Ensure sufficient color contrast for placeholder text</li>
            <li>Use <code className="text-primary">aria-label</code> or <code className="text-primary">aria-labelledby</code> when visual labels aren't present</li>
          </ul>
        </div>
      </DemoSection>
    </ComponentDemoLayout>
  );
}
