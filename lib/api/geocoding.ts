import axios from "axios";

const OPENWEATHER_API_KEY = process.env.NEXT_PUBLIC_OPENWEATHER_API_KEY;

export const geocodingAPI = {
  // Direct geocoding: Get coordinates by city name
  getCoordinates: async (cityName: string, countryCode?: string) => {
    try {
      const response = await axios.get(
        "https://api.openweathermap.org/geo/1.0/direct",
        {
          params: {
            q: countryCode ? `${cityName},${countryCode}` : cityName,
            limit: 5,
            appid: OPENWEATHER_API_KEY,
          },
        }
      );
      return response.data;
    } catch (error) {
      console.error("Error fetching coordinates:", error);
      throw error;
    }
  },

  // Reverse geocoding: Get city name by coordinates
  getCityName: async (lat: number, lon: number) => {
    try {
      const response = await axios.get(
        "https://api.openweathermap.org/geo/1.0/reverse",
        {
          params: {
            lat,
            lon,
            limit: 1,
            appid: OPENWEATHER_API_KEY,
          },
        }
      );
      return response.data;
    } catch (error) {
      console.error("Error reverse geocoding:", error);
      throw error;
    }
  },
};
