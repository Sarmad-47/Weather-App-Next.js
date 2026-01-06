"use client";

import { Button } from "@/components/ui/button";
import { useWeather } from "@/lib/context/WeatherContext";
import { cn } from "@/lib/utils";

export function TemperatureToggle() {
  const { unit, setUnit } = useWeather();

  return (
    <div className="flex items-center bg-muted rounded-lg p-1">
      <Button
        variant={unit === "metric" ? "default" : "ghost"}
        size="sm"
        onClick={() => setUnit("metric")}
        className={cn(
          "px-3 transition-all cursor-pointer",
          unit === "metric" && "shadow-sm"
        )}
      >
        °C
      </Button>
      <Button
        variant={unit === "imperial" ? "default" : "ghost"}
        size="sm"
        onClick={() => setUnit("imperial")}
        className={cn(
          "px-3 transition-all cursor-pointer",
          unit === "imperial" && "shadow-sm"
        )}
      >
        °F
      </Button>
    </div>
  );
}
