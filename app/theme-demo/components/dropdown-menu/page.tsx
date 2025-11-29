'use client';

/**
 * Dropdown Menu Component Demo Page
 */

import { ComponentDemoLayout, DemoSection, PropsTable } from '../../_components/component-demo-layout';
import { CodeBlock } from '../../_components/code-block';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuCheckboxItem,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
} from '@/components/ui/dropdown-menu';
import { ChevronDown, User, Settings, LogOut, Mail, MessageSquare, Plus, Cloud, CreditCard, Keyboard, Users } from 'lucide-react';
import { useState } from 'react';

export default function DropdownMenuDemoPage() {
  const [showStatusBar, setShowStatusBar] = useState(true);
  const [showActivityBar, setShowActivityBar] = useState(false);
  const [showPanel, setShowPanel] = useState(false);
  const [position, setPosition] = useState('bottom');

  return (
    <ComponentDemoLayout
      title="Dropdown Menu"
      description="Contextual menu component with various item types and nested submenus."
    >
      {/* Basic Usage */}
      <DemoSection
        title="Basic Dropdown"
        description="Simple dropdown menu with items"
      >
        <div className="space-y-4">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline">
                Open Menu
                <ChevronDown className="ml-2 h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem>
                <User className="mr-2 h-4 w-4" />
                Profile
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Settings className="mr-2 h-4 w-4" />
                Settings
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <LogOut className="mr-2 h-4 w-4" />
                Log out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <CodeBlock
            code={`<DropdownMenu>
  <DropdownMenuTrigger asChild>
    <Button variant="outline">Open Menu</Button>
  </DropdownMenuTrigger>
  <DropdownMenuContent>
    <DropdownMenuItem>
      <User className="mr-2 h-4 w-4" />
      Profile
    </DropdownMenuItem>
    <DropdownMenuItem>
      <Settings className="mr-2 h-4 w-4" />
      Settings
    </DropdownMenuItem>
    <DropdownMenuSeparator />
    <DropdownMenuItem>
      <LogOut className="mr-2 h-4 w-4" />
      Log out
    </DropdownMenuItem>
  </DropdownMenuContent>
</DropdownMenu>`}
          />
        </div>
      </DemoSection>

      {/* With Labels */}
      <DemoSection
        title="With Labels"
        description="Dropdown with section labels"
      >
        <div className="space-y-4">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline">Account</Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56">
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <User className="mr-2 h-4 w-4" />
                Profile
              </DropdownMenuItem>
              <DropdownMenuItem>
                <CreditCard className="mr-2 h-4 w-4" />
                Billing
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Settings className="mr-2 h-4 w-4" />
                Settings
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Keyboard className="mr-2 h-4 w-4" />
                Keyboard shortcuts
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <CodeBlock
            code={`<DropdownMenuContent className="w-56">
  <DropdownMenuLabel>My Account</DropdownMenuLabel>
  <DropdownMenuSeparator />
  <DropdownMenuItem>Profile</DropdownMenuItem>
  <DropdownMenuItem>Billing</DropdownMenuItem>
  <DropdownMenuItem>Settings</DropdownMenuItem>
</DropdownMenuContent>`}
          />
        </div>
      </DemoSection>

      {/* With Shortcuts */}
      <DemoSection
        title="With Keyboard Shortcuts"
        description="Dropdown items with keyboard shortcuts"
      >
        <div className="space-y-4">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline">Actions</Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <Mail className="mr-2 h-4 w-4" />
                New Email
                <DropdownMenuShortcut>⌘N</DropdownMenuShortcut>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <MessageSquare className="mr-2 h-4 w-4" />
                New Message
                <DropdownMenuShortcut>⌘M</DropdownMenuShortcut>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Plus className="mr-2 h-4 w-4" />
                New Item
                <DropdownMenuShortcut>⌘I</DropdownMenuShortcut>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <CodeBlock
            code={`<DropdownMenuItem>
  <Mail className="mr-2 h-4 w-4" />
  New Email
  <DropdownMenuShortcut>⌘N</DropdownMenuShortcut>
</DropdownMenuItem>`}
          />
        </div>
      </DemoSection>

      {/* Checkbox Items */}
      <DemoSection
        title="Checkbox Items"
        description="Dropdown with checkable items"
      >
        <div className="space-y-4">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline">View Options</Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56">
              <DropdownMenuLabel>Appearance</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuCheckboxItem
                checked={showStatusBar}
                onCheckedChange={setShowStatusBar}
              >
                Status Bar
              </DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem
                checked={showActivityBar}
                onCheckedChange={setShowActivityBar}
              >
                Activity Bar
              </DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem
                checked={showPanel}
                onCheckedChange={setShowPanel}
              >
                Panel
              </DropdownMenuCheckboxItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <CodeBlock
            code={`const [checked, setChecked] = useState(true);

<DropdownMenuCheckboxItem
  checked={checked}
  onCheckedChange={setChecked}
>
  Status Bar
</DropdownMenuCheckboxItem>`}
          />
        </div>
      </DemoSection>

      {/* Radio Items */}
      <DemoSection
        title="Radio Items"
        description="Dropdown with radio group selection"
      >
        <div className="space-y-4">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline">
                Position: {position}
                <ChevronDown className="ml-2 h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56">
              <DropdownMenuLabel>Panel Position</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuRadioGroup value={position} onValueChange={setPosition}>
                <DropdownMenuRadioItem value="top">Top</DropdownMenuRadioItem>
                <DropdownMenuRadioItem value="bottom">Bottom</DropdownMenuRadioItem>
                <DropdownMenuRadioItem value="right">Right</DropdownMenuRadioItem>
              </DropdownMenuRadioGroup>
            </DropdownMenuContent>
          </DropdownMenu>
          <CodeBlock
            code={`const [position, setPosition] = useState('bottom');

<DropdownMenuRadioGroup value={position} onValueChange={setPosition}>
  <DropdownMenuRadioItem value="top">Top</DropdownMenuRadioItem>
  <DropdownMenuRadioItem value="bottom">Bottom</DropdownMenuRadioItem>
  <DropdownMenuRadioItem value="right">Right</DropdownMenuRadioItem>
</DropdownMenuRadioGroup>`}
          />
        </div>
      </DemoSection>

      {/* Submenu */}
      <DemoSection
        title="With Submenu"
        description="Nested submenu items"
      >
        <div className="space-y-4">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline">More Options</Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56">
              <DropdownMenuLabel>Options</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <User className="mr-2 h-4 w-4" />
                Profile
              </DropdownMenuItem>
              <DropdownMenuSub>
                <DropdownMenuSubTrigger>
                  <Users className="mr-2 h-4 w-4" />
                  Invite users
                </DropdownMenuSubTrigger>
                <DropdownMenuSubContent>
                  <DropdownMenuItem>
                    <Mail className="mr-2 h-4 w-4" />
                    Email
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <MessageSquare className="mr-2 h-4 w-4" />
                    Message
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>
                    <Plus className="mr-2 h-4 w-4" />
                    More...
                  </DropdownMenuItem>
                </DropdownMenuSubContent>
              </DropdownMenuSub>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <Cloud className="mr-2 h-4 w-4" />
                API
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <CodeBlock
            code={`<DropdownMenuSub>
  <DropdownMenuSubTrigger>
    <Users className="mr-2 h-4 w-4" />
    Invite users
  </DropdownMenuSubTrigger>
  <DropdownMenuSubContent>
    <DropdownMenuItem>Email</DropdownMenuItem>
    <DropdownMenuItem>Message</DropdownMenuItem>
  </DropdownMenuSubContent>
</DropdownMenuSub>`}
          />
        </div>
      </DemoSection>

      {/* Props Documentation */}
      <DemoSection title="Component API">
        <div className="space-y-6">
          <div>
            <h4 className="text-sm font-semibold mb-3">DropdownMenuItem</h4>
            <PropsTable
              data={[
                {
                  prop: 'inset',
                  type: 'boolean',
                  default: 'false',
                  description: 'Adds left padding for alignment with labeled items',
                },
                {
                  prop: 'disabled',
                  type: 'boolean',
                  default: 'false',
                  description: 'Disables the menu item',
                },
              ]}
            />
          </div>
          <div>
            <h4 className="text-sm font-semibold mb-3">DropdownMenuCheckboxItem</h4>
            <PropsTable
              data={[
                {
                  prop: 'checked',
                  type: 'boolean',
                  description: 'Controlled checked state',
                },
                {
                  prop: 'onCheckedChange',
                  type: '(checked: boolean) => void',
                  description: 'Callback fired when checked state changes',
                },
              ]}
            />
          </div>
          <div>
            <h4 className="text-sm font-semibold mb-3">DropdownMenuRadioGroup</h4>
            <PropsTable
              data={[
                {
                  prop: 'value',
                  type: 'string',
                  description: 'Controlled selected value',
                },
                {
                  prop: 'onValueChange',
                  type: '(value: string) => void',
                  description: 'Callback fired when value changes',
                },
              ]}
            />
          </div>
        </div>
      </DemoSection>

      {/* Accessibility Notes */}
      <DemoSection title="Accessibility">
        <div className="prose prose-sm max-w-none">
          <ul className="space-y-2 text-muted-foreground">
            <li>Built on Radix UI primitives with full keyboard support</li>
            <li>Use <code className="text-primary">Enter</code> or <code className="text-primary">Space</code> to activate menu items</li>
            <li>Use <code className="text-primary">Arrow keys</code> to navigate between items</li>
            <li>Use <code className="text-primary">Esc</code> to close the menu</li>
            <li>Submenus open with <code className="text-primary">Enter</code> or <code className="text-primary">Right Arrow</code></li>
            <li>Focus is trapped within the menu when open</li>
            <li>Screen readers announce menu role and item count automatically</li>
          </ul>
        </div>
      </DemoSection>
    </ComponentDemoLayout>
  );
}
