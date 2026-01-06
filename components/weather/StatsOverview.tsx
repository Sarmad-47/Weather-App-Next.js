import { useWeather } from "@/lib/context";

import { Card, CardContent } from "@/components/ui/card";
import { Star, Globe, Thermometer, Droplets } from "lucide-react";

export default function StatsOverview() {
  const { cities, favoriteCities, weatherData, unit } = useWeather();

  // Calculate aggregated weather stats
  const weatherStats = {
    avgTemp:
      cities.reduce((sum, city) => {
        const weather = weatherData[city.id];
        return sum + (weather?.main.temp || 0);
      }, 0) / cities.length || 0,

    avgHumidity:
      cities.reduce((sum, city) => {
        const weather = weatherData[city.id];
        return sum + (weather?.main.humidity || 0);
      }, 0) / cities.length || 0,

    totalCities: cities.length,
    favoriteCount: favoriteCities.length,
  };

  const toDisplayTemp = (tempC: number, unit: "metric" | "imperial") =>
    unit === "imperial" ? tempC * (9 / 5) + 32 : tempC;

  const avgTempDisplay = toDisplayTemp(weatherStats.avgTemp, unit);

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                Total Cities
              </p>
              <p className="text-2xl font-bold">{weatherStats.totalCities}</p>
            </div>
            <Globe className="w-8 h-8 text-primary" />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                Avg Temperature
              </p>
              <p className="text-2xl font-bold">
                {Math.round(avgTempDisplay)}°{unit === "metric" ? "C" : "F"}
              </p>
            </div>
            <Thermometer className="w-8 h-8 text-orange-500" />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                Avg Humidity
              </p>
              <p className="text-2xl font-bold">
                {Math.round(weatherStats.avgHumidity)}%
              </p>
            </div>
            <Droplets className="w-8 h-8 text-blue-500" />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                Favorites
              </p>
              <p className="text-2xl font-bold">{weatherStats.favoriteCount}</p>
            </div>
            <Star className="w-8 h-8 text-yellow-500" />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
