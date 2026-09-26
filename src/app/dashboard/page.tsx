import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Workspace</h1>
        <p className="text-sm text-muted-foreground">
          Customizable dashboard shell ready for hackathon feature
          implementation.
        </p>
      </div>

      <div className="grid gap-6">
        <Card className="border-dashed border-2">
          <CardHeader>
            <CardTitle>Main Canvas</CardTitle>
            <CardDescription>
              Replace this card with your core application components and
              product features.
            </CardDescription>
          </CardHeader>
          <CardContent className="h-64 flex items-center justify-center text-sm text-muted-foreground">
            Ready for your hackathon implementation.
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
