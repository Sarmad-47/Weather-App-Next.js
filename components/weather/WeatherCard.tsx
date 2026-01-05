"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { WeatherData } from "@/types";
import { useWeather } from "@/lib/context/WeatherContext";
import { WeatherIcon } from "./WeatherIcon";
import {
  formatTemperature,
  getTemperatureColor,
} from "@/lib/utils/temperature";
import { formatTime } from "@/lib/utils/date";
import {
  getWindDirection,
  getWeatherCondition,
  getHumidityDescription,
  getPressureDescription,
} from "@/lib/utils/weather-utils";
import {
  Thermometer,
  Droplets,
  Wind,
  Gauge,
  Star,
  MapPin,
  Clock,
  RefreshCw,
  X,
  Maximize2,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useState } from "react";

interface WeatherCardProps {
  weather: WeatherData;
  loading?: boolean;
  onRemove?: () => void;
  onRefresh?: () => void;
  className?: string;
}

export function WeatherCard({
  weather,
  loading = false,
  onRemove,
  onRefresh,
  className,
}: WeatherCardProps) {
  const { unit, favoriteCities, toggleFavorite } = useWeather();
  const [isExpanded, setIsExpanded] = useState(false);

  if (loading) {
    return (
      <Card className={cn("w-full", className)}>
        <CardHeader className="pb-3">
          <Skeleton className="h-6 w-32" />
          <Skeleton className="h-4 w-24 mt-2" />
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between mb-6">
            <Skeleton className="h-16 w-16 rounded-full" />
            <div>
              <Skeleton className="h-12 w-24" />
              <Skeleton className="h-4 w-32 mt-2" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Skeleton className="h-16 w-full" />
            <Skeleton className="h-16 w-full" />
            <Skeleton className="h-16 w-full" />
            <Skeleton className="h-16 w-full" />
          </div>
        </CardContent>
      </Card>
    );
  }

  const isFavorite = favoriteCities.includes(weather.id.toString());
  const tempColor = getTemperatureColor(weather.main.temp, unit);
  const windDirection = getWindDirection(weather.wind.deg || 0);
  const condition = getWeatherCondition(weather.weather?.[0]?.id ?? 800);
  const humidityDesc = getHumidityDescription(weather.main.humidity);
  const pressureDesc = getPressureDescription(weather.main.pressure);

  return (
    <Card
      className={cn(
        "w-full hover:shadow-lg transition-all duration-200 relative group",
        className
      )}
    >
      {/* Card Header */}
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <CardTitle className="flex items-center gap-2 text-lg font-semibold">
              <MapPin className="w-4 h-4 text-muted-foreground" />
              {weather.name}, {weather.sys.country}
              {isFavorite && (
                <Badge variant="secondary" className="ml-2">
                  Favorite
                </Badge>
              )}
            </CardTitle>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Clock className="w-3 h-3" />
              Updated: {formatTime(weather.dt)}
            </div>
          </div>

          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity"
              onClick={() => setIsExpanded(!isExpanded)}
            >
              <Maximize2 className="w-3 h-3" />
            </Button>
            {onRemove && (
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity"
                onClick={onRemove}
              >
                <X className="w-3 h-3" />
              </Button>
            )}
          </div>
        </div>
      </CardHeader>

      {/* Card Content */}
      <CardContent>
        {/* Main Weather Info */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <div className="relative">
              <WeatherIcon
                iconCode={weather.weather[0].icon}
                size={isExpanded ? "lg" : "md"}
              />
              <div className="absolute -bottom-2 -right-2">
                <Button
                  variant={isFavorite ? "default" : "outline"}
                  size="icon"
                  className="h-6 w-6 rounded-full"
                  onClick={() => toggleFavorite(weather.id.toString())}
                >
                  <Star className={cn("w-3 h-3", isFavorite && "fill-white")} />
                </Button>
              </div>
            </div>

            <div>
              <div className={cn("text-4xl font-bold", tempColor)}>
                {formatTemperature(weather.main.temp, unit)}
              </div>
              <div className="text-sm text-muted-foreground">
                Feels like {formatTemperature(weather.main.feels_like, unit)}
              </div>
            </div>
          </div>

          {onRefresh && (
            <Button
              variant="ghost"
              size="icon"
              onClick={onRefresh}
              className="opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <RefreshCw className="w-4 h-4" />
            </Button>
          )}
        </div>

        {/* Weather Details */}
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            {/* Temperature Details */}
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Thermometer className="w-4 h-4" />
                <span>Temperature</span>
              </div>
              <div className="font-medium">
                {formatTemperature(weather.main.temp_min, unit)} /{" "}
                {formatTemperature(weather.main.temp_max, unit)}
              </div>
            </div>

            {/* Humidity */}
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Droplets className="w-4 h-4" />
                <span>Humidity</span>
              </div>
              <div className="font-medium">
                {weather.main.humidity}% ({humidityDesc})
              </div>
            </div>
          </div>

          {isExpanded && (
            <div className="pt-4 border-t space-y-4">
              <div className="grid grid-cols-2 gap-4">
                {/* Wind */}
                <div className="space-y-1">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Wind className="w-4 h-4" />
                    <span>Wind</span>
                  </div>
                  <div className="font-medium">
                    {weather.wind.speed} m/s {windDirection}
                  </div>
                </div>

                {/* Pressure */}
                <div className="space-y-1">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Gauge className="w-4 h-4" />
                    <span>Pressure</span>
                  </div>
                  <div className="font-medium">
                    {weather.main.pressure} hPa ({pressureDesc})
                  </div>
                </div>
              </div>

              {/* Weather Condition */}
              <div className="pt-2">
                <div className="text-sm text-muted-foreground mb-1">
                  Condition
                </div>
                <Badge variant="outline" className="capitalize">
                  {condition} - {weather.weather[0].description}
                </Badge>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
