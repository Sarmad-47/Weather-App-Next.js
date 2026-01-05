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
        <h1 className="text-xl font-semibold tracking-tight">Overview</h1>
        <p className="text-sm text-muted-foreground">
          Your weather dashboard layout is ready. Next: wire OpenWeather +
          Mapbox.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card className="rounded-2xl">
          <CardHeader>
            <CardTitle className="text-base">Current Location</CardTitle>
            <CardDescription>Weather fetched via Mapbox coords</CardDescription>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground">
            Add your “current location weather” widget here.
          </CardContent>
        </Card>

        <Card className="rounded-2xl">
          <CardHeader>
            <CardTitle className="text-base">Saved Locations</CardTitle>
            <CardDescription>Your pinned cities</CardDescription>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground">
            List saved cities + quick temperature here.
          </CardContent>
        </Card>

        <Card className="rounded-2xl">
          <CardHeader>
            <CardTitle className="text-base">Forecast</CardTitle>
            <CardDescription>Hourly / daily overview</CardDescription>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground">
            Add charts/cards for hourly & daily forecast here.
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
