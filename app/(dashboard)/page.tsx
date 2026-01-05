"use client";

import { useState } from "react";
import { SearchBar } from "@/components/shared/SearchBar";
import { WeatherCard } from "@/components/weather/WeatherCard";
import { TemperatureToggle } from "@/components/weather/TemperatureToggle";
import { ForecastChart } from "@/components/weather/ForecastChart";
import { LoadingSpinner } from "@/components/shared/LoadingSpinner";
import { ErrorBoundary } from "@/components/shared/ErrorBoundary";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Separator } from "@/components/ui/separator";
import { useWeather } from "@/lib/context/WeatherContext";
import {
  RefreshCw,
  Plus,
  AlertCircle,
  Star,
  Globe,
  Thermometer,
  Droplets,
  Wind,
} from "lucide-react";
import { cn } from "@/lib/utils";

export default function DashboardPage() {
  const {
    cities,
    favoriteCities,
    weatherData,
    isLoading,
    error,
    refreshWeatherData,
    addCityFromSearch,
    removeCity,
    fetchWeatherForCity,
    unit,
    setUnit,
  } = useWeather();

  const [activeTab, setActiveTab] = useState("all");
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Filter cities based on active tab
  const filteredCities =
    activeTab === "favorites"
      ? cities.filter((city) => favoriteCities.includes(city.id))
      : cities;

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

  const handleSearch = async (query: string) => {
    try {
      await addCityFromSearch(query);
    } catch (err) {
      console.error("Search error:", err);
    }
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      await refreshWeatherData();
    } catch (err) {
      console.error("Refresh error:", err);
    } finally {
      setIsRefreshing(false);
    }
  };

  const handleRemoveCity = (cityId: string) => {
    removeCity(cityId);
  };

  const handleRefreshCity = async (cityId: string) => {
    const city = cities.find((c) => c.id === cityId);
    if (city) {
      await fetchWeatherForCity(city);
    }
  };

  // Render loading state
  if (isLoading && !weatherData) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="flex flex-col items-center justify-center space-y-4">
          <LoadingSpinner size="lg" />
          <p className="text-muted-foreground">Loading weather data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-background to-muted/20">
      <div className="container mx-auto px-4 py-8">
        {/* Header Section */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">
                Weather Dashboard
              </h1>
              <p className="text-muted-foreground mt-1">
                Real-time weather updates for {cities.length} cities worldwide
              </p>
            </div>

            <div className="flex items-center gap-3">
              <TemperatureToggle />
              <Button
                variant="outline"
                size="sm"
                onClick={handleRefresh}
                disabled={isRefreshing}
                className="gap-2"
              >
                <RefreshCw
                  className={cn("w-4 h-4", isRefreshing && "animate-spin")}
                />
                Refresh
              </Button>
            </div>
          </div>

          {/* Search Bar */}
          <div className="mb-8">
            <SearchBar onSearch={handleSearch} />
          </div>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Total Cities
                  </p>
                  <p className="text-2xl font-bold">
                    {weatherStats.totalCities}
                  </p>
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
                    {Math.round(weatherStats.avgTemp)}°
                    {unit === "metric" ? "C" : "F"}
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
                  <p className="text-2xl font-bold">
                    {weatherStats.favoriteCount}
                  </p>
                </div>
                <Star className="w-8 h-8 text-yellow-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Error Alert */}
        {error && (
          <Alert variant="destructive" className="mb-6">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Weather Cards Section */}
          <div className="lg:col-span-2">
            <Tabs
              value={activeTab}
              onValueChange={setActiveTab}
              className="w-full"
            >
              <div className="flex items-center justify-between mb-6">
                <TabsList>
                  <TabsTrigger value="all" className="gap-2">
                    <Globe className="w-4 h-4" />
                    All Cities ({cities.length})
                  </TabsTrigger>
                  <TabsTrigger value="favorites" className="gap-2">
                    <Star className="w-4 h-4" />
                    Favorites ({favoriteCities.length})
                  </TabsTrigger>
                </TabsList>

                <div className="text-sm text-muted-foreground">
                  {filteredCities.length} cities displayed
                </div>
              </div>

              <ErrorBoundary>
                <TabsContent value={activeTab} className="mt-0">
                  {filteredCities.length === 0 ? (
                    <Card>
                      <CardContent className="pt-6 text-center">
                        <Star className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                        <h3 className="text-lg font-semibold mb-2">
                          {activeTab === "favorites"
                            ? "No favorite cities yet"
                            : "No cities available"}
                        </h3>
                        <p className="text-muted-foreground mb-4">
                          {activeTab === "favorites"
                            ? "Mark cities as favorites to see them here"
                            : "Search for cities to add them to your dashboard"}
                        </p>
                        <Button
                          onClick={() =>
                            activeTab === "favorites" && setActiveTab("all")
                          }
                        >
                          {activeTab === "favorites"
                            ? "Browse All Cities"
                            : "Search Cities"}
                        </Button>
                      </CardContent>
                    </Card>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {filteredCities.map((city) => {
                        const weather = weatherData[city.id];
                        return (
                          <WeatherCard
                            key={city.id}
                            weather={
                              weather || {
                                id: parseInt(city.id),
                                name: city.name,
                                sys: { country: city.country },
                                main: {
                                  temp: 0,
                                  feels_like: 0,
                                  humidity: 0,
                                  pressure: 1013,
                                },
                                weather: [
                                  {
                                    main: "Unknown",
                                    description: "Loading...",
                                    icon: "50d",
                                  },
                                ],
                                wind: {
                                  speed: 0,
                                  deg: 0,
                                },
                                coord: {
                                  lat: city.lat,
                                  lon: city.lon,
                                },
                              }
                            }
                            loading={!weather && isLoading}
                            onRemove={() => handleRemoveCity(city.id)}
                            onRefresh={() => handleRefreshCity(city.id)}
                          />
                        );
                      })}
                    </div>
                  )}
                </TabsContent>
              </ErrorBoundary>
            </Tabs>
          </div>

          {/* Sidebar Section */}
          <div className="space-y-6">
            {/* Forecast Chart */}
            <ForecastChart />

            {/* Weather Tips */}
            <Card>
              <CardContent className="pt-6">
                <h3 className="font-semibold mb-4">Weather Tips</h3>
                <ul className="space-y-3 text-sm">
                  <li className="flex items-start gap-2">
                    <Thermometer className="w-4 h-4 text-orange-500 mt-0.5 shrink-0" />
                    <span>
                      Click on any city card to expand detailed weather
                      information
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Star className="w-4 h-4 text-yellow-500 mt-0.5 shrink-0" />
                    <span>
                      Click the star icon to add cities to your favorites
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <RefreshCw className="w-4 h-4 text-blue-500 mt-0.5 shrink-0" />
                    <span>
                      Use the refresh button to update all weather data
                    </span>
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
          </div>
        </div>

        {/* Empty State - No cities */}
        {cities.length === 0 && !isLoading && (
          <div className="text-center py-16">
            <Globe className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <h2 className="text-2xl font-semibold mb-2">No Cities Added Yet</h2>
            <p className="text-muted-foreground mb-6 max-w-md mx-auto">
              Start by searching for cities to add to your weather dashboard.
              Monitor weather conditions across the globe in real-time.
            </p>
            <div className="flex items-center justify-center gap-4">
              <Button size="lg" className="gap-2">
                <Plus className="w-4 h-4" />
                Search Cities
              </Button>
              <Button variant="outline" size="lg">
                Use Current Location
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
