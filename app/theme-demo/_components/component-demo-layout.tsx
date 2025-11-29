/**
 * Component Demo Layout
 *
 * Reusable layout wrapper for component demo pages.
 */

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { ReactNode } from 'react';

interface ComponentDemoLayoutProps {
  title: string;
  description: string;
  children: ReactNode;
}

export function ComponentDemoLayout({
  title,
  description,
  children,
}: ComponentDemoLayoutProps) {
  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="space-y-3 pb-6 border-b-2 border-primary/20">
        <h1 className="text-4xl font-bold tracking-tight bg-gradient-to-r from-primary via-primary/80 to-primary/60 bg-clip-text text-transparent">
          {title}
        </h1>
        <p className="text-lg text-muted-foreground">{description}</p>
      </div>

      {/* Content */}
      {children}
    </div>
  );
}

interface DemoSectionProps {
  title: string;
  description?: string;
  children: ReactNode;
}

export function DemoSection({ title, description, children }: DemoSectionProps) {
  return (
    <Card className="relative border-primary/20 bg-card/50 backdrop-blur-sm shadow-lg hover:shadow-xl hover:shadow-primary/5 transition-all duration-300">
      <CardHeader className="border-b border-primary/10">
        <CardTitle className="text-primary">{title}</CardTitle>
        {description && <CardDescription>{description}</CardDescription>}
      </CardHeader>
      <CardContent className="relative pt-6">{children}</CardContent>
    </Card>
  );
}

interface PropsTableProps {
  data: {
    prop: string;
    type: string;
    default?: string;
    description: string;
  }[];
}

export function PropsTable({ data }: PropsTableProps) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b">
            <th className="text-left py-2 px-4 font-semibold">Prop</th>
            <th className="text-left py-2 px-4 font-semibold">Type</th>
            <th className="text-left py-2 px-4 font-semibold">Default</th>
            <th className="text-left py-2 px-4 font-semibold">Description</th>
          </tr>
        </thead>
        <tbody>
          {data.map((row, index) => (
            <tr key={index} className="border-b">
              <td className="py-2 px-4 font-mono text-xs text-primary">{row.prop}</td>
              <td className="py-2 px-4 font-mono text-xs text-muted-foreground">{row.type}</td>
              <td className="py-2 px-4 font-mono text-xs">
                {row.default || <span className="text-muted-foreground">-</span>}
              </td>
              <td className="py-2 px-4 text-muted-foreground">{row.description}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
