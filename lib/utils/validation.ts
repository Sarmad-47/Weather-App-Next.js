export const validateCityName = (
  cityName: string
): { isValid: boolean; message?: string } => {
  if (!cityName || cityName.trim() === "") {
    return { isValid: false, message: "City name is required" };
  }

  const trimmed = cityName.trim();

  if (trimmed.length < 2) {
    return {
      isValid: false,
      message: "City name must be at least 2 characters",
    };
  }

  if (trimmed.length > 100) {
    return { isValid: false, message: "City name is too long" };
  }

  // Allow letters, spaces, commas, apostrophes, hyphens, and parentheses
  const cityNameRegex = /^[a-zA-Z\s,'\-()]+$/;
  if (!cityNameRegex.test(trimmed)) {
    return { isValid: false, message: "City name contains invalid characters" };
  }

  return { isValid: true };
};

export const validateCoordinates = (
  lat: number,
  lon: number
): { isValid: boolean; message?: string } => {
  if (lat < -90 || lat > 90) {
    return { isValid: false, message: "Latitude must be between -90 and 90" };
  }

  if (lon < -180 || lon > 180) {
    return {
      isValid: false,
      message: "Longitude must be between -180 and 180",
    };
  }

  // Check if coordinates are numbers
  if (isNaN(lat) || isNaN(lon)) {
    return { isValid: false, message: "Coordinates must be valid numbers" };
  }

  return { isValid: true };
};

export const validateCountryCode = (
  countryCode: string
): { isValid: boolean; message?: string } => {
  if (!countryCode) {
    return { isValid: false, message: "Country code is required" };
  }

  const countryCodeRegex = /^[A-Z]{2}$/;
  if (!countryCodeRegex.test(countryCode)) {
    return {
      isValid: false,
      message: "Country code must be 2 uppercase letters",
    };
  }

  return { isValid: true };
};

export const validateSearchQuery = (
  query: string
): { isValid: boolean; message?: string } => {
  if (!query || query.trim() === "") {
    return { isValid: false, message: "Search query is required" };
  }

  const trimmed = query.trim();

  if (trimmed.length < 2) {
    return { isValid: false, message: "Search must be at least 2 characters" };
  }

  if (trimmed.length > 50) {
    return { isValid: false, message: "Search query is too long" };
  }

  // Allow letters, numbers, spaces, commas, and hyphens
  const searchRegex = /^[a-zA-Z0-9\s,'\-]+$/;
  if (!searchRegex.test(trimmed)) {
    return { isValid: false, message: "Search contains invalid characters" };
  }

  return { isValid: true };
};

export const validateTemperature = (
  temp: number,
  unit: "metric" | "imperial"
): { isValid: boolean; message?: string } => {
  if (isNaN(temp)) {
    return { isValid: false, message: "Temperature must be a number" };
  }

  const absTemp = Math.abs(temp);
  const limit = unit === "metric" ? 60 : 140; // Rough conversion: 60°C = 140°F

  if (absTemp > limit) {
    return {
      isValid: false,
      message: `Temperature is outside reasonable range for ${unit} units`,
    };
  }

  return { isValid: true };
};
