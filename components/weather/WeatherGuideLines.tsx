import { Card, CardContent } from "@/components/ui/card";
import { RefreshCw, Star, Thermometer, Wind } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { useWeather } from "@/lib/context/WeatherContext";

export default function WeatherGuideLines() {
  const { unit } = useWeather();
  return (
    <>
      {/* Weather Tips */}
      <Card>
        <CardContent className="pt-6">
          <h3 className="font-semibold mb-4">Weather Tips</h3>
          <ul className="space-y-3 text-sm">
            <li className="flex items-start gap-2">
              <Thermometer className="w-4 h-4 text-orange-500 mt-0.5 shrink-0" />
              <span>
                Click on any city card to expand detailed weather information
              </span>
            </li>
            <li className="flex items-start gap-2">
              <Star className="w-4 h-4 text-yellow-500 mt-0.5 shrink-0" />
              <span>Click the star icon to add cities to your favorites</span>
            </li>
            <li className="flex items-start gap-2">
              <RefreshCw className="w-4 h-4 text-blue-500 mt-0.5 shrink-0" />
              <span>Use the refresh button to update all weather data</span>
            </li>
            <li className="flex items-start gap-2">
              <Wind className="w-4 h-4 text-gray-500 mt-0.5 shrink-0" />
              <span>
                Wind direction shows as compass direction (N, NE, E, etc.)
              </span>
            </li>
          </ul>
        </CardContent>
      </Card>

      {/* Temperature Legend */}
      <Card>
        <CardContent className="pt-6">
          <h3 className="font-semibold mb-4">Temperature Guide</h3>
          <div className="space-y-2 text-sm">
            <div className="flex items-center justify-between">
              <span className="text-blue-500 font-medium">
                &lt; 0°{unit === "metric" ? "C" : "F"}
              </span>
              <span className="text-muted-foreground">Freezing</span>
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <span className="text-cyan-500 font-medium">0-10°</span>
              <span className="text-muted-foreground">Cold</span>
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <span className="text-green-500 font-medium">10-20°</span>
              <span className="text-muted-foreground">Cool</span>
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <span className="text-yellow-500 font-medium">20-30°</span>
              <span className="text-muted-foreground">Warm</span>
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <span className="text-orange-500 font-medium">30-40°</span>
              <span className="text-muted-foreground">Hot</span>
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <span className="text-red-500 font-medium">&gt; 40°</span>
              <span className="text-muted-foreground">Extreme</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </>
  );
}
