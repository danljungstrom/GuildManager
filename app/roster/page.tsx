import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

export const metadata = {
  title: 'Guild Roster - GuildManager',
  description: 'View and manage your guild roster',
}

export default function RosterPage() {
  return (
    <div className="container mx-auto p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-primary">Guild Roster</h1>
        <p className="text-muted-foreground mt-2">
          View and manage all guild members
        </p>
      </div>

      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle>All Members</CardTitle>
            <CardDescription>Complete list of guild members</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-center py-12">
              <p className="text-muted-foreground mb-4">
                No members found
              </p>
              <p className="text-sm text-muted-foreground">
                Guild roster data will appear here once members are added
              </p>
            </div>
          </CardContent>
        </Card>

        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Roster Statistics</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Total Members:</span>
                <Badge variant="secondary">0</Badge>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Main Raiders:</span>
                <Badge variant="secondary">0</Badge>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Recruits:</span>
                <Badge variant="secondary">0</Badge>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Class Distribution</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                No class data available
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Role Distribution</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                No role data available
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
