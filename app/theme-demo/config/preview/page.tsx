'use client';

/**
 * Theme Preview Config Page
 *
 * Shows how theme changes affect all components simultaneously.
 */

import { ComponentDemoLayout, DemoSection } from '../../_components/component-demo-layout';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Slider } from '@/components/ui/slider';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import { ClassIcon } from '@/components/wow/ClassIcon';
import { RoleIcon } from '@/components/wow/RoleIcon';
import { ChevronDown, Home, Search, Bell, Settings, User, Mail } from 'lucide-react';
import Link from 'next/link';

export default function ThemePreviewPage() {
  return (
    <ComponentDemoLayout
      title="Theme Preview"
      description="Comprehensive preview showing how theme colors affect all components. Use the Color Editor to see changes in real-time."
    >
      {/* Navigation Elements */}
      <DemoSection
        title="Navigation Components"
        description="Breadcrumbs, dropdowns, and navigation elements"
      >
        <div className="space-y-4">
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink asChild>
                  <Link href="/">
                    <Home className="h-4 w-4" />
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
                <BreadcrumbPage>Preview</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>

          <div className="flex flex-wrap gap-3">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline">
                  Menu
                  <ChevronDown className="ml-2 h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>Profile</DropdownMenuItem>
                <DropdownMenuItem>Settings</DropdownMenuItem>
                <DropdownMenuItem>Logout</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </DemoSection>

      {/* Buttons & Badges */}
      <DemoSection
        title="Buttons & Badges"
        description="All button and badge variants"
      >
        <div className="space-y-4">
          <div>
            <h4 className="text-sm font-medium mb-3">Buttons</h4>
            <div className="flex flex-wrap gap-3">
              <Button>Default</Button>
              <Button variant="secondary">Secondary</Button>
              <Button variant="outline">Outline</Button>
              <Button variant="ghost">Ghost</Button>
              <Button variant="destructive">Destructive</Button>
            </div>
          </div>
          <Separator />
          <div>
            <h4 className="text-sm font-medium mb-3">Badges</h4>
            <div className="flex flex-wrap gap-3">
              <Badge>Default</Badge>
              <Badge variant="secondary">Secondary</Badge>
              <Badge variant="outline">Outline</Badge>
              <Badge variant="destructive">Destructive</Badge>
            </div>
          </div>
        </div>
      </DemoSection>

      {/* Form Elements */}
      <DemoSection
        title="Form Elements"
        description="Inputs, switches, and form controls"
      >
        <div className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="preview-email">Email</Label>
              <Input id="preview-email" type="email" placeholder="email@example.com" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="preview-search">Search</Label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input id="preview-search" placeholder="Search..." className="pl-10" />
              </div>
            </div>
          </div>

          <Separator />

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="preview-notifications">Email Notifications</Label>
                <p className="text-sm text-muted-foreground">
                  Receive emails about your account activity
                </p>
              </div>
              <Switch id="preview-notifications" defaultChecked />
            </div>
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="preview-marketing">Marketing Emails</Label>
                <p className="text-sm text-muted-foreground">
                  Receive emails about new features and updates
                </p>
              </div>
              <Switch id="preview-marketing" />
            </div>
          </div>

          <Separator />

          <div className="space-y-2">
            <Label>Volume</Label>
            <Slider defaultValue={[50]} max={100} step={1} />
          </div>
        </div>
      </DemoSection>

      {/* Cards & Tabs */}
      <DemoSection
        title="Cards & Tabs"
        description="Card layouts and tabbed interfaces"
      >
        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="details">Details</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>
          <TabsContent value="overview" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>Card Title</CardTitle>
                  <CardDescription>Card description goes here</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    This is the card content. It demonstrates how the theme colors
                    apply to card components.
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Statistics</CardTitle>
                  <CardDescription>Key metrics and numbers</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Active Users</span>
                      <span className="text-2xl font-bold text-primary">1,234</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Total Revenue</span>
                      <span className="text-2xl font-bold text-primary">$45,678</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          <TabsContent value="details">
            <Card>
              <CardHeader>
                <CardTitle>Details</CardTitle>
                <CardDescription>Detailed information view</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Details tab content showing theme application.
                </p>
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="settings">
            <Card>
              <CardHeader>
                <CardTitle>Settings</CardTitle>
                <CardDescription>Configuration options</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Settings tab content with theme colors applied.
                </p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </DemoSection>

      {/* WoW Components */}
      <DemoSection
        title="WoW-Specific Components"
        description="Guild-specific components with theme integration"
      >
        <div className="space-y-4">
          <div>
            <h4 className="text-sm font-medium mb-3">Class Icons</h4>
            <div className="flex flex-wrap gap-3">
              <ClassIcon className="Warrior" variant="both" showText size="md" />
              <ClassIcon className="Paladin" variant="both" showText size="md" />
              <ClassIcon className="Priest" variant="both" showText size="md" />
              <ClassIcon className="Mage" variant="both" showText size="md" />
            </div>
          </div>
          <Separator />
          <div>
            <h4 className="text-sm font-medium mb-3">Role Icons</h4>
            <div className="flex flex-wrap gap-3">
              <RoleIcon role="Tank" variant="both" showText size="md" />
              <RoleIcon role="DPS" variant="both" showText size="md" />
              <RoleIcon role="Healer" variant="both" showText size="md" />
            </div>
          </div>
        </div>
      </DemoSection>

      {/* User Interface Pattern */}
      <DemoSection
        title="Complete UI Pattern"
        description="Full interface example showing theme cohesion"
      >
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Avatar>
                  <AvatarFallback>JD</AvatarFallback>
                </Avatar>
                <div>
                  <CardTitle className="text-base">John Doe</CardTitle>
                  <CardDescription className="text-xs">john.doe@example.com</CardDescription>
                </div>
              </div>
              <div className="flex gap-2">
                <Button size="icon" variant="ghost">
                  <Bell className="h-4 w-4" />
                </Button>
                <Button size="icon" variant="ghost">
                  <Settings className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardHeader>
          <Separator />
          <CardContent className="pt-4">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">Profile Status</span>
                </div>
                <Badge>Active</Badge>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">Email Verified</span>
                </div>
                <Badge variant="secondary">Verified</Badge>
              </div>
              <Separator />
              <div className="flex gap-2">
                <Button className="flex-1" variant="outline">Edit Profile</Button>
                <Button className="flex-1">Save Changes</Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </DemoSection>

      {/* Instructions */}
      <DemoSection title="How to Use">
        <div className="prose prose-sm max-w-none">
          <p className="text-muted-foreground">
            This page shows a comprehensive preview of how theme colors are applied across
            all components. To see changes in real-time:
          </p>
          <ol className="space-y-2 text-muted-foreground mt-4">
            <li>Navigate to the <strong className="text-foreground">Color Editor</strong> page</li>
            <li>Adjust the color sliders for any theme variable</li>
            <li>Return to this page to see how your changes affect the entire UI</li>
            <li>Iterate until you find the perfect color combination</li>
            <li>Export your configuration from the Color Editor</li>
          </ol>
        </div>
      </DemoSection>
    </ComponentDemoLayout>
  );
}
