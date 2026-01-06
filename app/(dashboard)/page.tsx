"use client";

import { useEffect, useState } from "react";

import { WeatherCard } from "@/components/weather/WeatherCard";
import { TemperatureToggle } from "@/components/weather/TemperatureToggle";
import { ForecastChart } from "@/components/weather/ForecastChart";
import { LoadingSpinner } from "@/components/shared/LoadingSpinner";
import { ErrorBoundary } from "@/components/shared/ErrorBoundary";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useWeather } from "@/lib/context/WeatherContext";
import { RefreshCw, Plus, AlertCircle, Star, Globe } from "lucide-react";
import { cn } from "@/lib/utils";
import StatsOverview from "@/components/weather/StatsOverview";
import WeatherGuideLines from "@/components/weather/WeatherGuideLines";
import { AppPagination } from "@/components/shared/AppPagination";

export default function DashboardPage() {
  const {
    cities,
    favoriteCities,
    weatherData,
    isLoading,
    error,
    refreshWeatherData,
    fetchWeatherForCity,
  } = useWeather();

  const [activeTab, setActiveTab] = useState("all");
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Pagination state
  const PAGE_SIZE = 6;
  const [page, setPage] = useState(1);

  // Filter cities based on active tab
  const filteredCities =
    activeTab === "favorites"
      ? cities.filter((city) => favoriteCities.includes(city.id))
      : cities;

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

  const handleRefreshCity = async (cityId: string) => {
    const city = cities.find((c) => c.id === cityId);
    if (city) {
      await fetchWeatherForCity(city);
    }
  };

  // For Pagination
  const totalPages = Math.max(1, Math.ceil(filteredCities.length / PAGE_SIZE));
  const start = (page - 1) * PAGE_SIZE;
  const paginatedCities = filteredCities.slice(start, start + PAGE_SIZE);

  useEffect(() => {
    setPage(1);
  }, [activeTab, filteredCities.length]);

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
                className="gap-2 cursor-pointer"
              >
                <RefreshCw
                  className={cn("w-4 h-4", isRefreshing && "animate-spin")}
                />
                Refresh
              </Button>
            </div>
          </div>
        </div>

        {/* Stats Overview */}
        <StatsOverview />

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
                  <TabsTrigger value="all" className="gap-2 cursor-pointer">
                    <Globe className="w-4 h-4" />
                    All Cities ({cities.length})
                  </TabsTrigger>
                  <TabsTrigger
                    value="favorites"
                    className="gap-2 cursor-pointer"
                  >
                    <Star className="w-4 h-4" />
                    Favorites ({favoriteCities.length})
                  </TabsTrigger>
                </TabsList>

                <div className="text-sm text-muted-foreground ml-2">
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
                          className="cursor-pointer"
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
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
                      {paginatedCities.map((city) => {
                        const weather = weatherData[city.id];
                        return (
                          <WeatherCard
                            key={city.id}
                            cityId={city.id}
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
                            onRefresh={() => handleRefreshCity(city.id)}
                          />
                        );
                      })}
                    </div>
                  )}
                  <AppPagination
                    page={page}
                    totalPages={totalPages}
                    onPageChange={setPage}
                  />
                </TabsContent>
              </ErrorBoundary>
            </Tabs>
          </div>

          {/* Sidebar Section */}
          <div className="space-y-6">
            {/* Forecast Chart */}
            <ForecastChart />

            {/* Weather Guide and Tips  */}
            <WeatherGuideLines />
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
