import { cn } from "@/lib/utils";
import Image from "next/image";

interface WeatherIconProps {
  iconCode: string;
  size?: "sm" | "md" | "lg" | "xl";
  className?: string;
}

export function WeatherIcon({
  iconCode,
  size = "md",
  className,
}: WeatherIconProps) {
  const sizeClasses = {
    sm: "w-6 h-6",
    md: "w-12 h-12",
    lg: "w-16 h-16",
    xl: "w-24 h-24",
  };

  const getIconUrl = () => {
    return `https://openweathermap.org/img/wn/${iconCode}@2x.png`;
  };

  const dimension = {
    sm: 24,
    md: 48,
    lg: 64,
    xl: 96,
  }[size];

  return (
    <Image
      src={getIconUrl()}
      alt="Weather icon"
      width={dimension}
      height={dimension}
      className={cn(sizeClasses[size], className)}
      unoptimized
    />
  );
}
