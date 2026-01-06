"use client";

import React, {
  createContext,
  useContext,
  useReducer,
  useEffect,
  useCallback,
  ReactNode,
} from "react";
import { City, WeatherData } from "@/types";
import { weatherAPI, geocodingAPI } from "@/lib/api";

// Define the state shape
interface WeatherState {
  cities: City[];
  favoriteCities: string[];
  unit: "metric" | "imperial";
  recentSearches: string[];
  isLoading: boolean;
  error: string | null;
  weatherData: Record<string, WeatherData>; // cityId -> weather data
}

// Define action types
type WeatherAction =
  | { type: "SET_CITIES"; payload: City[] }
  | { type: "ADD_CITY"; payload: City }
  | { type: "REMOVE_CITY"; payload: string }
  | { type: "UPDATE_CITY"; payload: { id: string; updates: Partial<City> } }
  | { type: "TOGGLE_FAVORITE"; payload: string }
  | { type: "SET_UNIT"; payload: "metric" | "imperial" }
  | { type: "ADD_RECENT_SEARCH"; payload: string }
  | { type: "CLEAR_RECENT_SEARCHES" }
  | { type: "SET_LOADING"; payload: boolean }
  | { type: "SET_ERROR"; payload: string | null }
  | { type: "SET_WEATHER_DATA"; payload: { cityId: string; data: WeatherData } }
  | {
      type: "UPDATE_WEATHER_DATA";
      payload: { cityId: string; data: WeatherData };
    }
  | {
      type: "REORDER_CITIES";
      payload: { startIndex: number; endIndex: number };
    }
  | { type: "LOAD_FROM_STORAGE"; payload: Partial<WeatherState> };

// Initial state
const initialState: WeatherState = {
  cities: [
    {
      id: "2643743",
      name: "London",
      country: "GB",
      lat: 51.5085,
      lon: -0.1257,
      favorite: false,
    },
    {
      id: "5128581",
      name: "New York",
      country: "US",
      lat: 40.7143,
      lon: -74.006,
      favorite: false,
    },
    {
      id: "1850147",
      name: "Tokyo",
      country: "JP",
      lat: 35.6895,
      lon: 139.6917,
      favorite: false,
    },
    {
      id: "2988507",
      name: "Paris",
      country: "FR",
      lat: 48.8534,
      lon: 2.3488,
      favorite: false,
    },
  ],
  favoriteCities: [],
  unit: "metric",
  recentSearches: [],
  isLoading: false,
  error: null,
  weatherData: {},
};

// Create reducer function
function weatherReducer(
  state: WeatherState,
  action: WeatherAction
): WeatherState {
  switch (action.type) {
    case "SET_CITIES":
      return { ...state, cities: action.payload };

    case "ADD_CITY": {
      const exists = state.cities.some((c) => c.id === action.payload.id);
      if (exists) return state; //  prevents duplicates no matter what

      return {
        ...state,
        cities: [...state.cities, { ...action.payload, favorite: false }],
      };
    }

    case "REMOVE_CITY":
      return {
        ...state,
        cities: state.cities.filter((c) => c.id !== action.payload),
        favoriteCities: state.favoriteCities.filter(
          (id) => id !== action.payload
        ),
        weatherData: Object.fromEntries(
          Object.entries(state.weatherData).filter(
            ([key]) => key !== action.payload
          )
        ),
      };

    case "UPDATE_CITY":
      return {
        ...state,
        cities: state.cities.map((city) =>
          city.id === action.payload.id
            ? { ...city, ...action.payload.updates }
            : city
        ),
      };

    case "TOGGLE_FAVORITE":
      const isFavorite = state.favoriteCities.includes(action.payload);
      const updatedFavoriteCities = isFavorite
        ? state.favoriteCities.filter((id) => id !== action.payload)
        : [...state.favoriteCities, action.payload];

      return {
        ...state,
        favoriteCities: updatedFavoriteCities,
        cities: state.cities.map((city) =>
          city.id === action.payload ? { ...city, favorite: !isFavorite } : city
        ),
      };

    case "SET_UNIT":
      return { ...state, unit: action.payload };

    case "ADD_RECENT_SEARCH":
      return {
        ...state,
        recentSearches: [
          action.payload,
          ...state.recentSearches
            .filter((s) => s !== action.payload)
            .slice(0, 9),
        ],
      };

    case "CLEAR_RECENT_SEARCHES":
      return { ...state, recentSearches: [] };

    case "SET_LOADING":
      return { ...state, isLoading: action.payload };

    case "SET_ERROR":
      return { ...state, error: action.payload };

    case "SET_WEATHER_DATA":
      return {
        ...state,
        weatherData: {
          ...state.weatherData,
          [action.payload.cityId]: action.payload.data,
        },
      };

    case "UPDATE_WEATHER_DATA":
      return {
        ...state,
        weatherData: {
          ...state.weatherData,
          [action.payload.cityId]: {
            ...state.weatherData[action.payload.cityId],
            ...action.payload.data,
          },
        },
      };

    case "REORDER_CITIES":
      const result = Array.from(state.cities);
      const [removed] = result.splice(action.payload.startIndex, 1);
      result.splice(action.payload.endIndex, 0, removed);
      return { ...state, cities: result };

    case "LOAD_FROM_STORAGE": {
      const incomingCities = action.payload.cities ?? state.cities;

      const seen = new Set<string>();
      const uniqueCities = incomingCities.filter((c) => {
        if (seen.has(c.id)) return false;
        seen.add(c.id);
        return true;
      });

      return {
        ...state,
        ...action.payload,
        cities: uniqueCities.map((city) => ({
          ...city,
          favorite: action.payload.favoriteCities?.includes(city.id) || false,
        })),
      };
    }

    default:
      return state;
  }
}

// Create context
interface WeatherContextType extends WeatherState {
  dispatch: React.Dispatch<WeatherAction>;
  fetchWeatherForCity: (city: City) => Promise<void>;
  fetchWeatherForAllCities: () => Promise<void>;
  searchCity: (query: string) => Promise<City | null>;
  refreshWeatherData: () => Promise<void>;
  addCityFromSearch: (
    cityName: string,
    countryCode?: string
  ) => Promise<City | null>;

  toggleFavorite: (cityId: string) => void;
  setUnit: (unit: "metric" | "imperial") => void;
  removeCity: (cityId: string) => void;
}

const WeatherContext = createContext<WeatherContextType | undefined>(undefined);

// Custom hook to use weather context
export function useWeather() {
  const context = useContext(WeatherContext);
  if (!context) {
    throw new Error("useWeather must be used within WeatherProvider");
  }
  return context;
}

// Function to load persisted state from localStorage
const loadPersistedState = (): Partial<WeatherState> => {
  if (typeof window === "undefined") {
    return {};
  }

  try {
    const savedState = localStorage.getItem("weather-app-state");
    if (savedState) {
      const parsed = JSON.parse(savedState);
      return {
        cities: parsed.cities || initialState.cities,
        favoriteCities: parsed.favoriteCities || initialState.favoriteCities,
        unit: parsed.unit || initialState.unit,
        recentSearches: parsed.recentSearches || initialState.recentSearches,
      };
    }
  } catch (error) {
    console.error("Failed to load state from localStorage:", error);
  }

  return {};
};

// Provider component
interface WeatherProviderProps {
  children: ReactNode;
}

export function WeatherProvider({ children }: WeatherProviderProps) {
  const [state, dispatch] = useReducer(weatherReducer, initialState);

  // Load persisted state on initial mount
  useEffect(() => {
    const persistedState = loadPersistedState();
    if (Object.keys(persistedState).length > 0) {
      dispatch({ type: "LOAD_FROM_STORAGE", payload: persistedState });
    }
  }, []);

  // Helper functions for common actions
  const toggleFavorite = useCallback((cityId: string) => {
    dispatch({ type: "TOGGLE_FAVORITE", payload: cityId });
  }, []);

  const setUnit = useCallback((unit: "metric" | "imperial") => {
    dispatch({ type: "SET_UNIT", payload: unit });
  }, []);

  const removeCity = useCallback((cityId: string) => {
    dispatch({ type: "REMOVE_CITY", payload: cityId });
  }, []);

  // Fetch weather for a specific city
  const fetchWeatherForCity = async (city: City) => {
    dispatch({ type: "SET_LOADING", payload: true });
    dispatch({ type: "SET_ERROR", payload: null });

    try {
      const data = await weatherAPI.getCurrentWeather({
        lat: city.lat,
        lon: city.lon,
      });
      dispatch({
        type: "SET_WEATHER_DATA",
        payload: { cityId: city.id, data },
      });
    } catch (error) {
      console.error(`Error fetching weather for ${city.name}:`, error);
      dispatch({
        type: "SET_ERROR",
        payload: `Failed to fetch weather for ${city.name}`,
      });
    } finally {
      dispatch({ type: "SET_LOADING", payload: false });
    }
  };

  // Fetch weather for all cities
  const fetchWeatherForAllCities = async () => {
    dispatch({ type: "SET_LOADING", payload: true });
    dispatch({ type: "SET_ERROR", payload: null });

    try {
      const promises = state.cities.map((city) =>
        weatherAPI
          .getCurrentWeather({ lat: city.lat, lon: city.lon })
          .then((data) => ({
            cityId: city.id,
            data,
          }))
          .catch((error) => {
            console.error(`Error fetching weather for ${city.name}:`, error);
            return null;
          })
      );

      const results = await Promise.all(promises);

      results.forEach((result) => {
        if (result) {
          dispatch({
            type: "SET_WEATHER_DATA",
            payload: result,
          });
        }
      });
    } catch (error) {
      console.error("Error fetching weather for all cities:", error);
      dispatch({
        type: "SET_ERROR",
        payload: "Failed to fetch weather data",
      });
    } finally {
      dispatch({ type: "SET_LOADING", payload: false });
    }
  };

  // Search for a city by name
  const searchCity = async (query: string): Promise<City | null> => {
    dispatch({ type: "SET_LOADING", payload: true });
    dispatch({ type: "SET_ERROR", payload: null });

    try {
      const results = await geocodingAPI.getCoordinates(query);

      if (results.length === 0) {
        dispatch({
          type: "SET_ERROR",
          payload: `No city found for "${query}"`,
        });
        return null;
      }

      const city = results[0];
      const cityObj: City = {
        id: `${city.lat}-${city.lon}`,
        name: city.name,
        country: city.country,
        lat: city.lat,
        lon: city.lon,
        favorite: false,
      };

      // Add to recent searches
      dispatch({
        type: "ADD_RECENT_SEARCH",
        payload: `${city.name}, ${city.country}`,
      });

      return cityObj;
    } catch (error) {
      console.error("Error searching city:", error);
      dispatch({
        type: "SET_ERROR",
        payload: "Failed to search for city",
      });
      return null;
    } finally {
      dispatch({ type: "SET_LOADING", payload: false });
    }
  };

  // Add city from search
  const addCityFromSearch = async (cityName: string, countryCode?: string) => {
    const city = await searchCity(cityName);
    if (!city) return null;

    //  prevent duplicates
    const exists = state.cities.some((c) => c.id === city.id);
    if (!exists) {
      dispatch({ type: "ADD_CITY", payload: city });
    }

    await fetchWeatherForCity(city);
    return city;
  };

  // Refresh all weather data
  const refreshWeatherData = async () => {
    await fetchWeatherForAllCities();
  };

  // Load initial weather data on mount
  useEffect(() => {
    fetchWeatherForAllCities();
  }, [state.cities]); // Re-fetch when cities change

  // Persist state to localStorage
  useEffect(() => {
    if (typeof window !== "undefined") {
      const stateToPersist = {
        cities: state.cities,
        favoriteCities: state.favoriteCities,
        unit: state.unit,
        recentSearches: state.recentSearches,
      };
      localStorage.setItem("weather-app-state", JSON.stringify(stateToPersist));
    }
  }, [state.cities, state.favoriteCities, state.unit, state.recentSearches]);

  const contextValue: WeatherContextType = {
    ...state,
    dispatch,
    fetchWeatherForCity,
    fetchWeatherForAllCities,
    searchCity,
    refreshWeatherData,
    addCityFromSearch,
    toggleFavorite,
    setUnit,
    removeCity,
  };

  return (
    <WeatherContext.Provider value={contextValue}>
      {children}
    </WeatherContext.Provider>
  );
}
