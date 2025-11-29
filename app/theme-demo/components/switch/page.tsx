'use client';

/**
 * Switch Component Demo Page
 */

import { useState } from 'react';
import { ComponentDemoLayout, DemoSection, PropsTable } from '../../_components/component-demo-layout';
import { CodeBlock } from '../../_components/code-block';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';

export default function SwitchDemoPage() {
  const [checked1, setChecked1] = useState(false);
  const [checked2, setChecked2] = useState(true);
  const [checked3, setChecked3] = useState(false);

  return (
    <ComponentDemoLayout
      title="Switch"
      description="Toggle switch component for binary on/off states."
    >
      {/* Basic Usage */}
      <DemoSection
        title="Basic Switch"
        description="Default switch with label"
      >
        <div className="space-y-4">
          <div className="flex items-center space-x-2">
            <Switch id="basic-switch" />
            <Label htmlFor="basic-switch">Enable notifications</Label>
          </div>
          <CodeBlock
            code={`<div className="flex items-center space-x-2">
  <Switch id="basic-switch" />
  <Label htmlFor="basic-switch">Enable notifications</Label>
</div>`}
          />
        </div>
      </DemoSection>

      {/* Controlled Switch */}
      <DemoSection
        title="Controlled Switch"
        description="Switch with controlled state"
      >
        <div className="space-y-4">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Switch
                  id="controlled-1"
                  checked={checked1}
                  onCheckedChange={setChecked1}
                />
                <Label htmlFor="controlled-1">Dark mode</Label>
              </div>
              <span className="text-sm text-muted-foreground">
                {checked1 ? 'On' : 'Off'}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Switch
                  id="controlled-2"
                  checked={checked2}
                  onCheckedChange={setChecked2}
                />
                <Label htmlFor="controlled-2">Auto-save</Label>
              </div>
              <span className="text-sm text-muted-foreground">
                {checked2 ? 'On' : 'Off'}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Switch
                  id="controlled-3"
                  checked={checked3}
                  onCheckedChange={setChecked3}
                />
                <Label htmlFor="controlled-3">Email alerts</Label>
              </div>
              <span className="text-sm text-muted-foreground">
                {checked3 ? 'On' : 'Off'}
              </span>
            </div>
          </div>
          <CodeBlock
            code={`const [checked, setChecked] = useState(false);

<Switch
  checked={checked}
  onCheckedChange={setChecked}
/>`}
          />
        </div>
      </DemoSection>

      {/* States */}
      <DemoSection
        title="States"
        description="Different switch states"
      >
        <div className="space-y-4">
          <div className="space-y-3">
            <div className="flex items-center space-x-2">
              <Switch id="state-unchecked" />
              <Label htmlFor="state-unchecked">Unchecked (default)</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Switch id="state-checked" defaultChecked />
              <Label htmlFor="state-checked">Checked</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Switch id="state-disabled" disabled />
              <Label htmlFor="state-disabled" className="text-muted-foreground">
                Disabled (unchecked)
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <Switch id="state-disabled-checked" disabled defaultChecked />
              <Label htmlFor="state-disabled-checked" className="text-muted-foreground">
                Disabled (checked)
              </Label>
            </div>
          </div>
          <CodeBlock
            code={`<Switch />  // Unchecked
<Switch defaultChecked />  // Checked
<Switch disabled />  // Disabled (unchecked)
<Switch disabled defaultChecked />  // Disabled (checked)`}
          />
        </div>
      </DemoSection>

      {/* Form Integration */}
      <DemoSection
        title="Form Integration"
        description="Switch in a form-like layout"
      >
        <div className="space-y-4">
          <div className="space-y-4 rounded-lg border p-4">
            <div>
              <h4 className="text-sm font-medium mb-3">Notification Settings</h4>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="form-email">Email Notifications</Label>
                    <p className="text-sm text-muted-foreground">
                      Receive emails about your account activity
                    </p>
                  </div>
                  <Switch id="form-email" defaultChecked />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="form-push">Push Notifications</Label>
                    <p className="text-sm text-muted-foreground">
                      Receive push notifications on your device
                    </p>
                  </div>
                  <Switch id="form-push" />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="form-sms">SMS Notifications</Label>
                    <p className="text-sm text-muted-foreground">
                      Receive text messages for important updates
                    </p>
                  </div>
                  <Switch id="form-sms" />
                </div>
              </div>
            </div>
          </div>
          <CodeBlock
            code={`<div className="flex items-center justify-between">
  <div className="space-y-0.5">
    <Label htmlFor="email">Email Notifications</Label>
    <p className="text-sm text-muted-foreground">
      Receive emails about your account activity
    </p>
  </div>
  <Switch id="email" defaultChecked />
</div>`}
          />
        </div>
      </DemoSection>

      {/* Props Documentation */}
      <DemoSection title="Props">
        <PropsTable
          data={[
            {
              prop: 'checked',
              type: 'boolean',
              description: 'Controlled checked state',
            },
            {
              prop: 'defaultChecked',
              type: 'boolean',
              default: 'false',
              description: 'Default checked state for uncontrolled component',
            },
            {
              prop: 'onCheckedChange',
              type: '(checked: boolean) => void',
              description: 'Callback fired when the checked state changes',
            },
            {
              prop: 'disabled',
              type: 'boolean',
              default: 'false',
              description: 'Disables the switch',
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
            <li>Switch is built on Radix UI primitives with full keyboard support</li>
            <li>Use <code className="text-primary">Space</code> or <code className="text-primary">Enter</code> to toggle the switch</li>
            <li>Always provide a descriptive label for screen readers</li>
            <li>The switch role is automatically announced by screen readers</li>
            <li>Focus is clearly indicated with a visible ring</li>
          </ul>
        </div>
      </DemoSection>
    </ComponentDemoLayout>
  );
}
