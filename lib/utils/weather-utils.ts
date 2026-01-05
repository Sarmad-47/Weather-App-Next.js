import { City } from "@/types";

export const getWeatherIconUrl = (
  iconCode: string,
  size: "2x" | "4x" = "2x"
): string => {
  return `https://openweathermap.org/img/wn/${iconCode}@${size}.png`;
};

export const getWeatherCondition = (weatherCode: number): string => {
  // Weather condition groups based on OpenWeatherMap API
  if (weatherCode >= 200 && weatherCode < 300) return "Thunderstorm";
  if (weatherCode >= 300 && weatherCode < 400) return "Drizzle";
  if (weatherCode >= 500 && weatherCode < 600) return "Rain";
  if (weatherCode >= 600 && weatherCode < 700) return "Snow";
  if (weatherCode >= 700 && weatherCode < 800) return "Atmosphere";
  if (weatherCode === 800) return "Clear";
  if (weatherCode > 800) return "Clouds";
  return "Unknown";
};

export const getWindDirection = (degrees: number): string => {
  const directions = ["N", "NE", "E", "SE", "S", "SW", "W", "NW"];
  const index = Math.round((degrees % 360) / 45) % 8;
  return directions[index];
};

export const calculateFeelsLike = (
  temp: number,
  humidity: number,
  windSpeed: number
): number => {
  // Simple approximation of feels like temperature
  if (temp >= 27) {
    // Heat index approximation (simplified)
    const heatIndex = temp + (0.5 * humidity) / 100;
    return Math.round(heatIndex * 10) / 10;
  } else if (temp <= 10 && windSpeed > 3) {
    // Wind chill approximation (simplified)
    const windChill = temp - windSpeed * 0.7;
    return Math.round(windChill * 10) / 10;
  }
  return temp;
};

export const generateCityId = (city: Omit<City, "id">): string => {
  return `${city.name
    .toLowerCase()
    .replace(/\s+/g, "-")}-${city.country.toLowerCase()}`;
};

export const getWeatherIconComponent = (iconCode: string): string => {
  // Map OpenWeatherMap icon codes to emoji or icon names
  const iconMap: Record<string, string> = {
    "01d": "☀️", // clear sky (day)
    "01n": "🌙", // clear sky (night)
    "02d": "⛅", // few clouds (day)
    "02n": "☁️", // few clouds (night)
    "03d": "☁️", // scattered clouds
    "03n": "☁️",
    "04d": "☁️", // broken clouds
    "04n": "☁️",
    "09d": "🌧️", // shower rain
    "09n": "🌧️",
    "10d": "🌦️", // rain (day)
    "10n": "🌧️", // rain (night)
    "11d": "⛈️", // thunderstorm
    "11n": "⛈️",
    "13d": "❄️", // snow
    "13n": "❄️",
    "50d": "🌫️", // mist
    "50n": "🌫️",
  };

  return iconMap[iconCode] || "🌤️";
};

export const getUVIndexDescription = (uvIndex: number): string => {
  if (uvIndex <= 2) return "Low";
  if (uvIndex <= 5) return "Moderate";
  if (uvIndex <= 7) return "High";
  if (uvIndex <= 10) return "Very High";
  return "Extreme";
};

export const getHumidityDescription = (humidity: number): string => {
  if (humidity < 30) return "Dry";
  if (humidity < 50) return "Comfortable";
  if (humidity < 70) return "Moderate";
  if (humidity < 90) return "Humid";
  return "Very Humid";
};

export const getPressureDescription = (pressure: number): string => {
  if (pressure < 1000) return "Low";
  if (pressure < 1013) return "Normal";
  if (pressure < 1025) return "High";
  return "Very High";
};

export const getVisibilityDescription = (visibility: number): string => {
  const km = visibility / 1000;
  if (km < 1) return "Very Poor";
  if (km < 5) return "Poor";
  if (km < 10) return "Moderate";
  if (km < 20) return "Good";
  return "Excellent";
};
