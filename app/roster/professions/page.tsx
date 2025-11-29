import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ProfessionIcon } from "@/components/wow/ProfessionIcon"

export const metadata = {
  title: 'Professions - GuildManager',
  description: 'View guild member professions and skill levels',
}

const professions = [
  'Alchemy', 'Blacksmithing', 'Enchanting', 'Engineering',
  'Herbalism', 'Leatherworking', 'Mining', 'Skinning',
  'Tailoring'
] as const

export default function RosterProfessionsPage() {
  return (
    <div className="container mx-auto p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Guild Professions</h1>
        <p className="text-muted-foreground mt-2">
          Track guild member professions and their skill levels
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {professions.map((profession) => (
          <Card key={profession}>
            <CardHeader className="pb-3">
              <div className="flex items-center gap-2">
                <ProfessionIcon profession={profession} size="sm" />
                <CardTitle className="text-base">{profession}</CardTitle>
              </div>
              <CardDescription>No members</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                No guild members with {profession.toLowerCase()}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
