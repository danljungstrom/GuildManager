'use client';

/**
 * ColorPalette Component
 *
 * Displays the color system with CSS variable names and live values.
 */

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface ColorItem {
  name: string;
  variable: string;
  description: string;
}

const baseColors: ColorItem[] = [
  { name: 'Primary', variable: '--primary', description: 'Main brand color' },
  { name: 'Secondary', variable: '--secondary', description: 'Secondary brand color' },
  { name: 'Accent', variable: '--accent', description: 'Accent highlights' },
  { name: 'Background', variable: '--background', description: 'Page background' },
  { name: 'Foreground', variable: '--foreground', description: 'Text color' },
  { name: 'Muted', variable: '--muted', description: 'Muted backgrounds' },
  { name: 'Border', variable: '--border', description: 'Border color' },
];

const wowClassColors: ColorItem[] = [
  { name: 'Druid', variable: '--class-druid', description: 'Orange' },
  { name: 'Hunter', variable: '--class-hunter', description: 'Green' },
  { name: 'Mage', variable: '--class-mage', description: 'Cyan' },
  { name: 'Paladin', variable: '--class-paladin', description: 'Pink' },
  { name: 'Priest', variable: '--class-priest', description: 'White' },
  { name: 'Rogue', variable: '--class-rogue', description: 'Yellow' },
  { name: 'Shaman', variable: '--class-shaman', description: 'Blue' },
  { name: 'Warlock', variable: '--class-warlock', description: 'Purple' },
  { name: 'Warrior', variable: '--class-warrior', description: 'Brown' },
];

const wowRoleColors: ColorItem[] = [
  { name: 'Tank', variable: '--role-tank', description: 'Blue-teal' },
  { name: 'DPS', variable: '--role-dps', description: 'Red' },
  { name: 'Healer', variable: '--role-healer', description: 'Green' },
];

function ColorSwatch({ item }: { item: ColorItem }) {
  return (
    <div className="flex items-center gap-3 p-3 rounded-lg border bg-card">
      <div
        className="w-12 h-12 rounded border-2 border-border flex-shrink-0"
        style={{ backgroundColor: `hsl(var(${item.variable}))` }}
      />
      <div className="flex-1 min-w-0">
        <div className="font-medium text-sm">{item.name}</div>
        <code className="text-xs text-muted-foreground">{item.variable}</code>
      </div>
      <Badge variant="outline" className="text-xs">
        {item.description}
      </Badge>
    </div>
  );
}

export function ColorPalette() {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Base Color System</CardTitle>
          <CardDescription>
            Core theme colors used throughout the application
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3 md:grid-cols-2">
            {baseColors.map((item) => (
              <ColorSwatch key={item.variable} item={item} />
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>WoW Class Colors</CardTitle>
          <CardDescription>
            Official World of Warcraft class colors for roster displays
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
            {wowClassColors.map((item) => (
              <ColorSwatch key={item.variable} item={item} />
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>WoW Role Colors</CardTitle>
          <CardDescription>
            Role-based colors for raid composition displays
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3 md:grid-cols-3">
            {wowRoleColors.map((item) => (
              <ColorSwatch key={item.variable} item={item} />
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
