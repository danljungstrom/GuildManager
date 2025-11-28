'use client';

/**
 * Breadcrumb Component Demo Page
 */

import { ComponentDemoLayout, DemoSection, PropsTable } from '../../_components/component-demo-layout';
import { CodeBlock } from '../../_components/code-block';
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbSeparator,
  BreadcrumbEllipsis,
} from '@/components/ui/breadcrumb';
import { Slash, ChevronRight, Home } from 'lucide-react';
import Link from 'next/link';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

export default function BreadcrumbDemoPage() {
  return (
    <ComponentDemoLayout
      title="Breadcrumb"
      description="Navigation breadcrumb component for showing hierarchical page location."
    >
      {/* Basic Usage */}
      <DemoSection
        title="Basic Breadcrumb"
        description="Simple breadcrumb navigation"
      >
        <div className="space-y-4">
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink asChild>
                  <Link href="/">Home</Link>
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbLink asChild>
                  <Link href="/theme-demo">Theme Demo</Link>
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>Breadcrumb</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
          <CodeBlock
            code={`<Breadcrumb>
  <BreadcrumbList>
    <BreadcrumbItem>
      <BreadcrumbLink asChild>
        <Link href="/">Home</Link>
      </BreadcrumbLink>
    </BreadcrumbItem>
    <BreadcrumbSeparator />
    <BreadcrumbItem>
      <BreadcrumbLink asChild>
        <Link href="/theme-demo">Theme Demo</Link>
      </BreadcrumbLink>
    </BreadcrumbItem>
    <BreadcrumbSeparator />
    <BreadcrumbItem>
      <BreadcrumbPage>Breadcrumb</BreadcrumbPage>
    </BreadcrumbItem>
  </BreadcrumbList>
</Breadcrumb>`}
          />
        </div>
      </DemoSection>

      {/* Custom Separator */}
      <DemoSection
        title="Custom Separator"
        description="Using custom separator icons"
      >
        <div className="space-y-4">
          <div className="space-y-3">
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem>
                  <BreadcrumbLink asChild>
                    <Link href="/">Home</Link>
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator>
                  <Slash />
                </BreadcrumbSeparator>
                <BreadcrumbItem>
                  <BreadcrumbLink asChild>
                    <Link href="/theme-demo">Components</Link>
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator>
                  <Slash />
                </BreadcrumbSeparator>
                <BreadcrumbItem>
                  <BreadcrumbPage>Breadcrumb</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>

            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem>
                  <BreadcrumbLink asChild>
                    <Link href="/">Home</Link>
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator>
                  <ChevronRight />
                </BreadcrumbSeparator>
                <BreadcrumbItem>
                  <BreadcrumbLink asChild>
                    <Link href="/theme-demo">Components</Link>
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator>
                  <ChevronRight />
                </BreadcrumbSeparator>
                <BreadcrumbItem>
                  <BreadcrumbPage>Breadcrumb</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
          <CodeBlock
            code={`<BreadcrumbSeparator>
  <Slash />
</BreadcrumbSeparator>

<BreadcrumbSeparator>
  <ChevronRight />
</BreadcrumbSeparator>`}
          />
        </div>
      </DemoSection>

      {/* With Icons */}
      <DemoSection
        title="With Icons"
        description="Breadcrumb items with icon decorations"
      >
        <div className="space-y-4">
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink asChild>
                  <Link href="/" className="flex items-center gap-2">
                    <Home className="h-4 w-4" />
                    Home
                  </Link>
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbLink asChild>
                  <Link href="/theme-demo">Theme Demo</Link>
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>Components</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
          <CodeBlock
            code={`<BreadcrumbLink asChild>
  <Link href="/" className="flex items-center gap-2">
    <Home className="h-4 w-4" />
    Home
  </Link>
</BreadcrumbLink>`}
          />
        </div>
      </DemoSection>

      {/* With Ellipsis */}
      <DemoSection
        title="With Ellipsis"
        description="Collapsed breadcrumb with ellipsis"
      >
        <div className="space-y-4">
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink asChild>
                  <Link href="/">Home</Link>
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbEllipsis />
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbLink asChild>
                  <Link href="/theme-demo/components">Components</Link>
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>Breadcrumb</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
          <CodeBlock
            code={`<BreadcrumbItem>
  <BreadcrumbEllipsis />
</BreadcrumbItem>`}
          />
        </div>
      </DemoSection>

      {/* With Dropdown */}
      <DemoSection
        title="With Dropdown Menu"
        description="Ellipsis as dropdown to show collapsed items"
      >
        <div className="space-y-4">
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink asChild>
                  <Link href="/">Home</Link>
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <DropdownMenu>
                  <DropdownMenuTrigger className="flex items-center gap-1">
                    <BreadcrumbEllipsis />
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="start">
                    <DropdownMenuItem asChild>
                      <Link href="/theme-demo">Theme Demo</Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href="/theme-demo/components">Components</Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href="/theme-demo/config">Config</Link>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>Current Page</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
          <CodeBlock
            code={`<BreadcrumbItem>
  <DropdownMenu>
    <DropdownMenuTrigger className="flex items-center gap-1">
      <BreadcrumbEllipsis />
    </DropdownMenuTrigger>
    <DropdownMenuContent align="start">
      <DropdownMenuItem asChild>
        <Link href="/theme-demo">Theme Demo</Link>
      </DropdownMenuItem>
      <DropdownMenuItem asChild>
        <Link href="/components">Components</Link>
      </DropdownMenuItem>
    </DropdownMenuContent>
  </DropdownMenu>
</BreadcrumbItem>`}
          />
        </div>
      </DemoSection>

      {/* Responsive */}
      <DemoSection
        title="Responsive Example"
        description="Mobile-friendly breadcrumb that collapses on small screens"
      >
        <div className="space-y-4">
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem className="hidden md:block">
                <BreadcrumbLink asChild>
                  <Link href="/">Home</Link>
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator className="hidden md:block" />
              <BreadcrumbItem>
                <DropdownMenu>
                  <DropdownMenuTrigger className="flex items-center gap-1 md:hidden">
                    <BreadcrumbEllipsis />
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="start">
                    <DropdownMenuItem asChild>
                      <Link href="/">Home</Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href="/theme-demo">Theme Demo</Link>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
                <BreadcrumbLink asChild className="hidden md:block">
                  <Link href="/theme-demo">Theme Demo</Link>
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>Components</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
          <CodeBlock
            code={`<BreadcrumbItem className="hidden md:block">
  <BreadcrumbLink asChild>
    <Link href="/">Home</Link>
  </BreadcrumbLink>
</BreadcrumbItem>
<BreadcrumbSeparator className="hidden md:block" />`}
          />
        </div>
      </DemoSection>

      {/* Props Documentation */}
      <DemoSection title="Component API">
        <div className="space-y-6">
          <div>
            <h4 className="text-sm font-semibold mb-3">BreadcrumbLink</h4>
            <PropsTable
              data={[
                {
                  prop: 'asChild',
                  type: 'boolean',
                  default: 'false',
                  description: 'Render as a child component (useful for Next.js Link)',
                },
              ]}
            />
          </div>
          <div>
            <h4 className="text-sm font-semibold mb-3">BreadcrumbSeparator</h4>
            <PropsTable
              data={[
                {
                  prop: 'children',
                  type: 'ReactNode',
                  default: '<ChevronRightIcon />',
                  description: 'Custom separator icon or element',
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
            <li>Breadcrumb uses semantic <code className="text-primary">nav</code> element with <code className="text-primary">aria-label="breadcrumb"</code></li>
            <li>Current page is marked with <code className="text-primary">aria-current="page"</code></li>
            <li>All links are keyboard accessible</li>
            <li>Separators are marked with <code className="text-primary">aria-hidden="true"</code> to hide from screen readers</li>
            <li>Use descriptive link text that makes sense out of context</li>
            <li>Ensure sufficient color contrast for all breadcrumb text</li>
          </ul>
        </div>
      </DemoSection>
    </ComponentDemoLayout>
  );
}
