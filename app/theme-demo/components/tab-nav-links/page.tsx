'use client';

/**
 * Tab Nav Links Component Demo Page
 */

import { ComponentDemoLayout, DemoSection, PropsTable } from '../../_components/component-demo-layout';
import { CodeBlock } from '../../_components/code-block';
import { TabNavLinks, TabNavLink } from '@/components/ui/tab-nav-links';
import { Home, User, Settings, Bell } from 'lucide-react';

export default function TabNavLinksDemoPage() {
  return (
    <ComponentDemoLayout
      title="Tab Nav Links"
      description="Navigation tabs using links for page-level navigation instead of controlled state."
    >
      {/* Basic Usage */}
      <DemoSection
        title="Basic Tab Navigation"
        description="Simple tab navigation with links"
      >
        <div className="space-y-4">
          <TabNavLinks>
            <TabNavLink href="/theme-demo" active>
              Overview
            </TabNavLink>
            <TabNavLink href="/theme-demo/components">
              Components
            </TabNavLink>
            <TabNavLink href="/theme-demo/config">
              Config
            </TabNavLink>
          </TabNavLinks>
          <CodeBlock
            code={`<TabNavLinks>
  <TabNavLink href="/overview" active>
    Overview
  </TabNavLink>
  <TabNavLink href="/components">
    Components
  </TabNavLink>
  <TabNavLink href="/config">
    Config
  </TabNavLink>
</TabNavLinks>`}
          />
        </div>
      </DemoSection>

      {/* With Icons */}
      <DemoSection
        title="With Icons"
        description="Tab navigation with icon decorations"
      >
        <div className="space-y-4">
          <TabNavLinks>
            <TabNavLink href="/theme-demo" active>
              <Home className="mr-2 h-4 w-4" />
              Home
            </TabNavLink>
            <TabNavLink href="/theme-demo/profile">
              <User className="mr-2 h-4 w-4" />
              Profile
            </TabNavLink>
            <TabNavLink href="/theme-demo/settings">
              <Settings className="mr-2 h-4 w-4" />
              Settings
            </TabNavLink>
            <TabNavLink href="/theme-demo/notifications">
              <Bell className="mr-2 h-4 w-4" />
              Notifications
            </TabNavLink>
          </TabNavLinks>
          <CodeBlock
            code={`<TabNavLinks>
  <TabNavLink href="/home" active>
    <Home className="mr-2 h-4 w-4" />
    Home
  </TabNavLink>
  <TabNavLink href="/profile">
    <User className="mr-2 h-4 w-4" />
    Profile
  </TabNavLink>
</TabNavLinks>`}
          />
        </div>
      </DemoSection>

      {/* Icon Only */}
      <DemoSection
        title="Icon Only"
        description="Compact icon-only tabs"
      >
        <div className="space-y-4">
          <TabNavLinks>
            <TabNavLink href="/theme-demo" active aria-label="Home">
              <Home className="h-4 w-4" />
            </TabNavLink>
            <TabNavLink href="/theme-demo/profile" aria-label="Profile">
              <User className="h-4 w-4" />
            </TabNavLink>
            <TabNavLink href="/theme-demo/settings" aria-label="Settings">
              <Settings className="h-4 w-4" />
            </TabNavLink>
            <TabNavLink href="/theme-demo/notifications" aria-label="Notifications">
              <Bell className="h-4 w-4" />
            </TabNavLink>
          </TabNavLinks>
          <CodeBlock
            code={`<TabNavLinks>
  <TabNavLink href="/home" active aria-label="Home">
    <Home className="h-4 w-4" />
  </TabNavLink>
  <TabNavLink href="/profile" aria-label="Profile">
    <User className="h-4 w-4" />
  </TabNavLink>
</TabNavLinks>`}
          />
        </div>
      </DemoSection>

      {/* Different States */}
      <DemoSection
        title="States"
        description="Active and inactive tab states"
      >
        <div className="space-y-4">
          <div className="space-y-3">
            <div>
              <p className="text-sm text-muted-foreground mb-2">First tab active:</p>
              <TabNavLinks>
                <TabNavLink href="#" active>
                  Active
                </TabNavLink>
                <TabNavLink href="#">Inactive</TabNavLink>
                <TabNavLink href="#">Inactive</TabNavLink>
              </TabNavLinks>
            </div>
            <div>
              <p className="text-sm text-muted-foreground mb-2">Middle tab active:</p>
              <TabNavLinks>
                <TabNavLink href="#">Inactive</TabNavLink>
                <TabNavLink href="#" active>
                  Active
                </TabNavLink>
                <TabNavLink href="#">Inactive</TabNavLink>
              </TabNavLinks>
            </div>
            <div>
              <p className="text-sm text-muted-foreground mb-2">Last tab active:</p>
              <TabNavLinks>
                <TabNavLink href="#">Inactive</TabNavLink>
                <TabNavLink href="#">Inactive</TabNavLink>
                <TabNavLink href="#" active>
                  Active
                </TabNavLink>
              </TabNavLinks>
            </div>
          </div>
          <CodeBlock
            code={`<TabNavLink href="#" active>Active</TabNavLink>
<TabNavLink href="#">Inactive</TabNavLink>`}
          />
        </div>
      </DemoSection>

      {/* Responsive Example */}
      <DemoSection
        title="Responsive Example"
        description="Tab navigation that adapts to screen size"
      >
        <div className="space-y-4">
          <TabNavLinks className="w-full">
            <TabNavLink href="/theme-demo" active className="flex-1">
              <span className="hidden sm:inline">Overview</span>
              <Home className="h-4 w-4 sm:hidden" />
            </TabNavLink>
            <TabNavLink href="/theme-demo/components" className="flex-1">
              <span className="hidden sm:inline">Components</span>
              <User className="h-4 w-4 sm:hidden" />
            </TabNavLink>
            <TabNavLink href="/theme-demo/config" className="flex-1">
              <span className="hidden sm:inline">Config</span>
              <Settings className="h-4 w-4 sm:hidden" />
            </TabNavLink>
          </TabNavLinks>
          <CodeBlock
            code={`<TabNavLinks className="w-full">
  <TabNavLink href="/overview" active className="flex-1">
    <span className="hidden sm:inline">Overview</span>
    <Home className="h-4 w-4 sm:hidden" />
  </TabNavLink>
  <TabNavLink href="/components" className="flex-1">
    <span className="hidden sm:inline">Components</span>
    <User className="h-4 w-4 sm:hidden" />
  </TabNavLink>
</TabNavLinks>`}
          />
        </div>
      </DemoSection>

      {/* Full Width */}
      <DemoSection
        title="Full Width"
        description="Tabs stretched to fill container"
      >
        <div className="space-y-4">
          <TabNavLinks className="w-full">
            <TabNavLink href="/theme-demo" active className="flex-1">
              Overview
            </TabNavLink>
            <TabNavLink href="/theme-demo/components" className="flex-1">
              Components
            </TabNavLink>
            <TabNavLink href="/theme-demo/config" className="flex-1">
              Configuration
            </TabNavLink>
            <TabNavLink href="/theme-demo/reference" className="flex-1">
              Reference
            </TabNavLink>
          </TabNavLinks>
          <CodeBlock
            code={`<TabNavLinks className="w-full">
  <TabNavLink href="/overview" active className="flex-1">
    Overview
  </TabNavLink>
  <TabNavLink href="/components" className="flex-1">
    Components
  </TabNavLink>
</TabNavLinks>`}
          />
        </div>
      </DemoSection>

      {/* Use Case: Settings Navigation */}
      <DemoSection
        title="Use Case: Settings Navigation"
        description="Example of tab navigation in a settings page"
      >
        <div className="space-y-4">
          <div className="rounded-lg border p-6">
            <TabNavLinks className="mb-6">
              <TabNavLink href="#" active>
                General
              </TabNavLink>
              <TabNavLink href="#">Account</TabNavLink>
              <TabNavLink href="#">Appearance</TabNavLink>
              <TabNavLink href="#">Notifications</TabNavLink>
              <TabNavLink href="#">Privacy</TabNavLink>
            </TabNavLinks>
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">General Settings</h3>
              <p className="text-sm text-muted-foreground">
                Configure your general application preferences and settings.
              </p>
            </div>
          </div>
          <CodeBlock
            code={`<TabNavLinks>
  <TabNavLink href="/settings/general" active>General</TabNavLink>
  <TabNavLink href="/settings/account">Account</TabNavLink>
  <TabNavLink href="/settings/appearance">Appearance</TabNavLink>
  <TabNavLink href="/settings/notifications">Notifications</TabNavLink>
  <TabNavLink href="/settings/privacy">Privacy</TabNavLink>
</TabNavLinks>`}
          />
        </div>
      </DemoSection>

      {/* Props Documentation */}
      <DemoSection title="Component API">
        <div className="space-y-6">
          <div>
            <h4 className="text-sm font-semibold mb-3">TabNavLink</h4>
            <PropsTable
              data={[
                {
                  prop: 'href',
                  type: 'string',
                  description: 'The URL to navigate to (required)',
                },
                {
                  prop: 'active',
                  type: 'boolean',
                  default: 'false',
                  description: 'Whether this tab is currently active',
                },
                {
                  prop: 'className',
                  type: 'string',
                  description: 'Additional CSS classes to apply',
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
            <li>Tab nav links are built on Next.js Link for proper client-side navigation</li>
            <li>All links are keyboard accessible using <code className="text-primary">Tab</code> key</li>
            <li>Links can be activated with <code className="text-primary">Enter</code> key</li>
            <li>For icon-only tabs, always provide <code className="text-primary">aria-label</code> for screen readers</li>
            <li>The active state is visually distinct with background color and shadow</li>
            <li>Focus indicators are clearly visible for keyboard navigation</li>
            <li>Use semantic navigation patterns - each tab should lead to a distinct page/route</li>
          </ul>
        </div>
      </DemoSection>

      {/* Comparison with Tabs */}
      <DemoSection title="When to Use">
        <div className="prose prose-sm max-w-none">
          <div className="space-y-3 text-muted-foreground">
            <p><strong className="text-foreground">Use TabNavLinks when:</strong></p>
            <ul className="space-y-2">
              <li>Each tab represents a different page/route</li>
              <li>You want browser history entries for each tab</li>
              <li>Users should be able to bookmark individual tabs</li>
              <li>Navigation should work with browser back/forward buttons</li>
            </ul>
            <p className="mt-4"><strong className="text-foreground">Use regular Tabs component when:</strong></p>
            <ul className="space-y-2">
              <li>Content is all on the same page, just toggled</li>
              <li>You don&apos;t want to change the URL</li>
              <li>State should be managed client-side only</li>
            </ul>
          </div>
        </div>
      </DemoSection>
    </ComponentDemoLayout>
  );
}
