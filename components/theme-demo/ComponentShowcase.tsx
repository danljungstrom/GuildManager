'use client';

/**
 * ComponentShowcase Component
 *
 * Displays all UI components with various states and variants.
 */

import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Switch } from '@/components/ui/switch';
import { Slider } from '@/components/ui/slider';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { ClassIcon } from '@/components/wow/ClassIcon';
import { RoleIcon } from '@/components/wow/RoleIcon';
import { SpecIcon } from '@/components/wow/SpecIcon';
import { ProfessionIcon } from '@/components/wow/ProfessionIcon';
import { AttendanceBadge } from '@/components/wow/AttendanceBadge';
import { getAllClasses, CLASS_CONFIGS } from '@/lib/consts/classes';
import { getAllRoles } from '@/lib/consts/roles';
import { PROFESSIONS, PROFESSION_CONFIGS } from '@/lib/consts/professions';
import type { Profession } from '@/lib/types/professions.types';

export function ComponentShowcase() {
  const classes = getAllClasses();
  const roles = getAllRoles();

  // Organize professions by category
  const craftingProfessions = PROFESSIONS.filter(
    (p) => PROFESSION_CONFIGS[p].isPrimary && PROFESSION_CONFIGS[p].category === 'CRAFTING'
  );
  const gatheringProfessions = PROFESSIONS.filter(
    (p) => PROFESSION_CONFIGS[p].isPrimary && PROFESSION_CONFIGS[p].category === 'GATHERING'
  );
  const secondaryProfessions = PROFESSIONS.filter(
    (p) => !PROFESSION_CONFIGS[p].isPrimary
  );

  return (
    <div className="space-y-8">
      {/* Buttons */}
      <Card>
        <CardHeader>
          <CardTitle>Buttons</CardTitle>
          <CardDescription>Button components in various variants and states</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-wrap gap-3">
            <Button>Default</Button>
            <Button variant="secondary">Secondary</Button>
            <Button variant="outline">Outline</Button>
            <Button variant="ghost">Ghost</Button>
            <Button variant="destructive">Destructive</Button>
          </div>
          <div className="flex flex-wrap gap-3">
            <Button size="sm">Small</Button>
            <Button size="default">Default</Button>
            <Button size="lg">Large</Button>
          </div>
          <div className="flex flex-wrap gap-3">
            <Button disabled>Disabled</Button>
            <Button variant="outline" disabled>
              Disabled Outline
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Badges */}
      <Card>
        <CardHeader>
          <CardTitle>Badges</CardTitle>
          <CardDescription>Badge components for labels and status</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-3">
            <Badge>Default</Badge>
            <Badge variant="secondary">Secondary</Badge>
            <Badge variant="outline">Outline</Badge>
            <Badge variant="destructive">Destructive</Badge>
          </div>
        </CardContent>
      </Card>

      {/* Form Elements */}
      <Card>
        <CardHeader>
          <CardTitle>Form Elements</CardTitle>
          <CardDescription>Input fields, checkboxes, and other form controls</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="text-input">Text Input</Label>
            <Input id="text-input" placeholder="Enter your name..." />
          </div>

          <div className="space-y-2">
            <Label htmlFor="disabled-input">Disabled Input</Label>
            <Input id="disabled-input" placeholder="Disabled" disabled />
          </div>

          <Separator />

          <div className="flex items-center space-x-2">
            <Checkbox id="checkbox" />
            <Label htmlFor="checkbox">Accept terms and conditions</Label>
          </div>

          <Separator />

          <div className="space-y-2">
            <Label>Radio Group</Label>
            <RadioGroup defaultValue="option-1">
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="option-1" id="option-1" />
                <Label htmlFor="option-1">Option 1</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="option-2" id="option-2" />
                <Label htmlFor="option-2">Option 2</Label>
              </div>
            </RadioGroup>
          </div>

          <Separator />

          <div className="flex items-center space-x-2">
            <Switch id="switch" />
            <Label htmlFor="switch">Enable notifications</Label>
          </div>

          <Separator />

          <div className="space-y-2">
            <Label>Slider</Label>
            <Slider defaultValue={[50]} max={100} step={1} />
          </div>
        </CardContent>
      </Card>

      {/* Tabs */}
      <Card>
        <CardHeader>
          <CardTitle>Tabs</CardTitle>
          <CardDescription>Tabbed navigation component</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="tab1" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="tab1">Tab 1</TabsTrigger>
              <TabsTrigger value="tab2">Tab 2</TabsTrigger>
              <TabsTrigger value="tab3">Tab 3</TabsTrigger>
            </TabsList>
            <TabsContent value="tab1" className="mt-4">
              <p className="text-sm text-muted-foreground">Content for tab 1</p>
            </TabsContent>
            <TabsContent value="tab2" className="mt-4">
              <p className="text-sm text-muted-foreground">Content for tab 2</p>
            </TabsContent>
            <TabsContent value="tab3" className="mt-4">
              <p className="text-sm text-muted-foreground">Content for tab 3</p>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* WoW Class Icons */}
      <Card>
        <CardHeader>
          <CardTitle>WoW Class Icons</CardTitle>
          <CardDescription>All 9 WoW classes with authentic icons and color coding</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <h4 className="text-sm font-medium mb-3">All Classes - Icon Only</h4>
            <div className="grid grid-cols-3 sm:grid-cols-5 md:grid-cols-9 gap-4">
              {classes.map((className) => (
                <div key={className} className="flex flex-col items-center gap-1">
                  <ClassIcon className={className} variant="icon" size="lg" />
                  <span className="text-xs text-muted-foreground">{className}</span>
                </div>
              ))}
            </div>
          </div>
          <Separator />
          <div>
            <h4 className="text-sm font-medium mb-3">All Classes - With Labels</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {classes.map((className) => (
                <ClassIcon
                  key={className}
                  className={className}
                  variant="both"
                  showText
                  size="md"
                />
              ))}
            </div>
          </div>
          <Separator />
          <div>
            <h4 className="text-sm font-medium mb-3">Size Variants</h4>
            <div className="flex flex-wrap items-center gap-4">
              <ClassIcon className="Warrior" variant="both" showText size="sm" />
              <ClassIcon className="Mage" variant="both" showText size="md" />
              <ClassIcon className="Priest" variant="both" showText size="lg" />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* WoW Role Icons */}
      <Card>
        <CardHeader>
          <CardTitle>WoW Role Icons</CardTitle>
          <CardDescription>Tank, DPS, and Healer role indicators</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex flex-wrap gap-4">
            {roles.map((role) => (
              <RoleIcon key={role} role={role} variant="both" showText size="md" />
            ))}
          </div>
        </CardContent>
      </Card>

      {/* WoW Spec Icons */}
      <Card>
        <CardHeader>
          <CardTitle>WoW Specialization Icons</CardTitle>
          <CardDescription>Sample specializations from each class</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <h4 className="text-sm font-medium mb-3">Tank Specializations</h4>
            <div className="flex flex-wrap gap-4">
              <SpecIcon className="Warrior" spec="Protection" showText size="md" />
              <SpecIcon className="Paladin" spec="Protection" showText size="md" />
              <SpecIcon className="Druid" spec="Feral" showText size="md" />
            </div>
          </div>
          <Separator />
          <div>
            <h4 className="text-sm font-medium mb-3">Healer Specializations</h4>
            <div className="flex flex-wrap gap-4">
              <SpecIcon className="Priest" spec="Holy" showText size="md" />
              <SpecIcon className="Paladin" spec="Holy" showText size="md" />
              <SpecIcon className="Druid" spec="Restoration" showText size="md" />
              <SpecIcon className="Shaman" spec="Restoration" showText size="md" />
            </div>
          </div>
          <Separator />
          <div>
            <h4 className="text-sm font-medium mb-3">DPS Specializations (Sample)</h4>
            <div className="flex flex-wrap gap-4">
              <SpecIcon className="Mage" spec="Fire" showText size="md" />
              <SpecIcon className="Rogue" spec="Assassination" showText size="md" />
              <SpecIcon className="Hunter" spec="Marksmanship" showText size="md" />
              <SpecIcon className="Warlock" spec="Destruction" showText size="md" />
              <SpecIcon className="Warrior" spec="Fury" showText size="md" />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Profession Icons */}
      <Card>
        <CardHeader>
          <CardTitle>Profession Icons</CardTitle>
          <CardDescription>All WoW professions organized by category</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <h4 className="text-sm font-medium mb-3">Crafting Professions</h4>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
              {craftingProfessions.map((profession) => (
                <ProfessionIcon
                  key={profession}
                  profession={profession as Profession}
                  skill={300}
                  showText
                  showSkill
                  size="md"
                />
              ))}
            </div>
          </div>
          <Separator />
          <div>
            <h4 className="text-sm font-medium mb-3">Gathering Professions</h4>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {gatheringProfessions.map((profession) => (
                <ProfessionIcon
                  key={profession}
                  profession={profession as Profession}
                  skill={225}
                  showText
                  showSkill
                  size="md"
                />
              ))}
            </div>
          </div>
          <Separator />
          <div>
            <h4 className="text-sm font-medium mb-3">Secondary Professions</h4>
            <div className="grid grid-cols-2 gap-4">
              {secondaryProfessions.map((profession) => (
                <ProfessionIcon
                  key={profession}
                  profession={profession as Profession}
                  skill={150}
                  showText
                  showSkill
                  size="md"
                />
              ))}
            </div>
          </div>
          <Separator />
          <div>
            <h4 className="text-sm font-medium mb-3">Skill Level Variants</h4>
            <div className="flex flex-wrap gap-4">
              <ProfessionIcon profession="Blacksmithing" skill={300} showText showSkill />
              <ProfessionIcon profession="Blacksmithing" skill={225} showText showSkill />
              <ProfessionIcon profession="Blacksmithing" skill={150} showText showSkill />
              <ProfessionIcon profession="Blacksmithing" skill={75} showText showSkill />
              <ProfessionIcon profession="Blacksmithing" skill={1} showText showSkill />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Attendance Badges */}
      <Card>
        <CardHeader>
          <CardTitle>Attendance Badges</CardTitle>
          <CardDescription>Raid attendance status indicators</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-3">
            <AttendanceBadge status="present" />
            <AttendanceBadge status="absent" />
            <AttendanceBadge status="late" />
            <AttendanceBadge status="excused" />
          </div>
          <Separator className="my-4" />
          <div className="flex flex-wrap gap-3">
            <AttendanceBadge status="present" percentage={95} showPercentage />
            <AttendanceBadge status="present" percentage={80} showPercentage />
            <AttendanceBadge status="late" percentage={60} showPercentage />
          </div>
        </CardContent>
      </Card>

      {/* Avatars */}
      <Card>
        <CardHeader>
          <CardTitle>Avatars</CardTitle>
          <CardDescription>User avatar components</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4">
            <Avatar>
              <AvatarFallback>AB</AvatarFallback>
            </Avatar>
            <Avatar>
              <AvatarFallback>CD</AvatarFallback>
            </Avatar>
            <Avatar>
              <AvatarFallback>EF</AvatarFallback>
            </Avatar>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
