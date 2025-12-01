import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ClassIcon } from "@/components/wow/ClassIcon"

export const metadata = {
  title: 'Roster by Class - GuildManager',
  description: 'View guild members organized by class and role',
}

const wowClasses = [
  'Druid', 'Hunter', 'Mage', 'Paladin', 'Priest',
  'Rogue', 'Shaman', 'Warlock', 'Warrior'
] as const

export default function RosterByClassPage() {
  return (
    <div className="container mx-auto p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-primary">Roster by Class & Role</h1>
        <p className="text-muted-foreground mt-2">
          View guild members organized by their class and role
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {wowClasses.map((className) => (
          <Card key={className}>
            <CardHeader className="pb-3">
              <div className="flex items-center gap-2">
                <ClassIcon className={className} size="sm" />
                <CardTitle className="text-base">{className}</CardTitle>
              </div>
              <CardDescription>No members</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                No {className.toLowerCase()}s in the guild
              </p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
