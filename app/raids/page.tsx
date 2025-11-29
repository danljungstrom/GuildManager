import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Sword } from "lucide-react"

export const metadata = {
  title: 'Raids - GuildManager',
  description: 'Manage guild raids and raid attendance',
}

export default function RaidsPage() {
  return (
    <div className="container mx-auto p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Raid Management</h1>
        <p className="text-muted-foreground mt-2">
          Schedule and track guild raids, attendance, and loot
        </p>
      </div>

      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Sword className="h-5 w-5 text-primary" />
              <CardTitle>Upcoming Raids</CardTitle>
            </div>
            <CardDescription>Scheduled raid events for this week</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-center py-12">
              <p className="text-muted-foreground mb-4">
                No raids scheduled
              </p>
              <p className="text-sm text-muted-foreground">
                Raid schedules will appear here once created
              </p>
            </div>
          </CardContent>
        </Card>

        <div className="grid gap-4 md:grid-cols-2">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Raid Statistics</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Total Raids:</span>
                <Badge variant="secondary">0</Badge>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">This Week:</span>
                <Badge variant="secondary">0</Badge>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Avg Attendance:</span>
                <Badge variant="secondary">0%</Badge>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Recent Clears</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                No raid clears recorded
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
