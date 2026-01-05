import axios from "axios";

const OPENWEATHER_API_KEY = process.env.NEXT_PUBLIC_OPENWEATHER_API_KEY;
const BASE_URL = "https://api.openweathermap.org/data/2.5";

export const weatherAPI = {
  // Get current weather for a single location
  getCurrentWeather: async (query: string | { lat: number; lon: number }) => {
    const params =
      typeof query === "string"
        ? { q: query }
        : { lat: query.lat, lon: query.lon };

    try {
      const response = await axios.get(`${BASE_URL}/weather`, {
        params: {
          ...params,
          appid: OPENWEATHER_API_KEY,
          units: "metric",
        },
      });
      return response.data;
    } catch (error) {
      console.error("Error fetching current weather:", error);
      throw error;
    }
  },

  // Get 5-day forecast
  getForecast: async (query: string | { lat: number; lon: number }) => {
    const params =
      typeof query === "string"
        ? { q: query }
        : { lat: query.lat, lon: query.lon };

    try {
      const response = await axios.get(`${BASE_URL}/forecast`, {
        params: {
          ...params,
          appid: OPENWEATHER_API_KEY,
          units: "metric",
          cnt: 40, // 8 forecasts per day for 5 days
        },
      });
      return response.data;
    } catch (error) {
      console.error("Error fetching forecast:", error);
      throw error;
    }
  },

  // Get weather for multiple cities (bulk)
  getMultipleCitiesWeather: async (
    cities: Array<{ lat: number; lon: number } | string>
  ) => {
    try {
      const promises = cities.map((city) =>
        weatherAPI.getCurrentWeather(city).catch((error) => {
          console.error(`Error fetching weather for ${city}:`, error);
          return null;
        })
      );
      const results = await Promise.all(promises);
      return results.filter((result) => result !== null);
    } catch (error) {
      console.error("Error fetching multiple cities weather:", error);
      throw error;
    }
  },

  // Get air quality data
  getAirQuality: async (lat: number, lon: number) => {
    try {
      const response = await axios.get(`${BASE_URL}/air_pollution`, {
        params: {
          lat,
          lon,
          appid: OPENWEATHER_API_KEY,
        },
      });
      return response.data;
    } catch (error) {
      console.error("Error fetching air quality:", error);
      throw error;
    }
  },
};
