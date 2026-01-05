export const convertTemperature = (
  temp: number,
  unit: "metric" | "imperial"
): number => {
  if (unit === "imperial") {
    // Celsius to Fahrenheit
    return (temp * 9) / 5 + 32;
  }
  return temp;
};

export const formatTemperature = (
  temp: number,
  unit: "metric" | "imperial"
): string => {
  const convertedTemp = convertTemperature(temp, unit);
  const symbol = unit === "metric" ? "°C" : "°F";
  return `${Math.round(convertedTemp)}${symbol}`;
};

export const getTemperatureColor = (
  temp: number,
  unit: "metric" | "imperial"
): string => {
  const convertedTemp = convertTemperature(temp, unit);

  if (convertedTemp <= 0) return "text-blue-500";
  if (convertedTemp <= 10) return "text-cyan-500";
  if (convertedTemp <= 20) return "text-green-500";
  if (convertedTemp <= 30) return "text-yellow-500";
  if (convertedTemp <= 40) return "text-orange-500";
  return "text-red-500";
};

export const getTemperatureRangeColor = (
  temp: number,
  unit: "metric" | "imperial"
): string => {
  const convertedTemp = convertTemperature(temp, unit);

  if (convertedTemp <= 0) return "from-blue-400 to-blue-600";
  if (convertedTemp <= 10) return "from-cyan-400 to-blue-500";
  if (convertedTemp <= 20) return "from-green-400 to-emerald-600";
  if (convertedTemp <= 30) return "from-yellow-400 to-orange-500";
  if (convertedTemp <= 40) return "from-orange-400 to-red-500";
  return "from-red-400 to-red-700";
};

export const getTemperatureDescription = (
  temp: number,
  unit: "metric" | "imperial"
): string => {
  const convertedTemp = convertTemperature(temp, unit);

  if (convertedTemp <= 0) return "Freezing";
  if (convertedTemp <= 10) return "Cold";
  if (convertedTemp <= 20) return "Cool";
  if (convertedTemp <= 30) return "Warm";
  if (convertedTemp <= 40) return "Hot";
  return "Extreme Heat";
};
