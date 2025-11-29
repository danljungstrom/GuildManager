import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"

export const metadata = {
  title: 'Guild Info - GuildManager',
  description: 'Guild information, rules, and history',
}

export default function GuildInfoPage() {
  return (
    <div className="container mx-auto p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Guild Information</h1>
        <p className="text-muted-foreground mt-2">
          Learn about our guild, rules, and history
        </p>
      </div>

      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle>About Us</CardTitle>
            <CardDescription>Guild description and mission</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-muted-foreground">
              Welcome to our guild! This section will contain information about our guild&apos;s
              history, goals, and community values.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Guild Rules</CardTitle>
            <CardDescription>Code of conduct and expectations</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h3 className="font-semibold mb-2">General Conduct</h3>
              <p className="text-sm text-muted-foreground">
                Guild rules and conduct expectations will be displayed here.
              </p>
            </div>
            <Separator />
            <div>
              <h3 className="font-semibold mb-2">Raid Expectations</h3>
              <p className="text-sm text-muted-foreground">
                Raid attendance, preparation, and behavior guidelines.
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Guild Leadership</CardTitle>
            <CardDescription>Officers and their roles</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Guild leadership information will be displayed here.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
