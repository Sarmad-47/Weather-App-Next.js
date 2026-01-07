"use client";

import React, {
  createContext,
  useContext,
  useReducer,
  ReactNode,
  useEffect,
} from "react";
import {
  MapContextType,
  MapState,
  MapAction,
  MapViewport,
  MapMarker,
} from "@/types";

import { WeatherData, City } from "@/types";
import { geocodingAPI, weatherAPI } from "../api";
import { toast } from "sonner";

// Default viewport (centered on world)
const DEFAULT_VIEWPORT: MapViewport = {
  latitude: 20,
  longitude: 0,
  zoom: 1.5,
  bearing: 0,
  pitch: 0,
};

// Initial state
const initialState: MapState = {
  viewport: DEFAULT_VIEWPORT,
  markers: [],
  userLocation: {
    latitude: null,
    longitude: null,
    countryCode: null,
    countryName: null,
  },
  isLoading: false,
  error: null,
  selectedCity: null,
  isLocationAllowed: false,
  isLocationLoading: false,
};

// Reducer function
function mapReducer(state: MapState, action: MapAction): MapState {
  switch (action.type) {
    case "SET_VIEWPORT":
      return {
        ...state,
        viewport: { ...state.viewport, ...action.payload },
      };
    case "SET_MARKERS":
      return {
        ...state,
        markers: action.payload,
      };
    case "UPDATE_MARKER_WEATHER":
      return {
        ...state,
        markers: state.markers.map((marker) =>
          marker.cityId === action.payload.cityId
            ? { ...marker, weather: action.payload.weather, isActive: true }
            : { ...marker, isActive: false }
        ),
      };
    case "SET_USER_LOCATION":
      return {
        ...state,
        userLocation: {
          latitude: action.payload.latitude,
          longitude: action.payload.longitude,
          countryCode: action.payload.countryCode,
          countryName: action.payload.countryName,
        },
      };
    case "SET_SELECTED_CITY":
      return {
        ...state,
        selectedCity: action.payload,
      };
    case "SET_LOADING":
      return {
        ...state,
        isLoading: action.payload,
      };
    case "SET_ERROR":
      return {
        ...state,
        error: action.payload,
      };
    case "SET_LOCATION_ALLOWED":
      return {
        ...state,
        isLocationAllowed: action.payload,
      };
    case "SET_LOCATION_LOADING":
      return {
        ...state,
        isLocationLoading: action.payload,
      };
    case "RESET_MAP_STATE":
      return initialState;
    default:
      return state;
  }
}

// Create context
const MapContext = createContext<MapContextType | undefined>(undefined);

// Predefined cities for different countries
const COUNTRY_CITIES: { [countryCode: string]: City[] } = {
  // Pakistan (10 cities)
  PK: [
    {
      id: "1172451",
      name: "Lahore",
      country: "PK",
      lat: 31.5497,
      lon: 74.3436,
    },
    {
      id: "1174872",
      name: "Karachi",
      country: "PK",
      lat: 24.8608,
      lon: 67.0104,
    },
    {
      id: "1166993",
      name: "Islamabad",
      country: "PK",
      lat: 33.7215,
      lon: 73.0433,
    },
    {
      id: "1169825",
      name: "Multan",
      country: "PK",
      lat: 30.1968,
      lon: 71.4782,
    },
    {
      id: "1168197",
      name: "Faisalabad",
      country: "PK",
      lat: 31.4167,
      lon: 73.0833,
    },
    {
      id: "1168034",
      name: "Rawalpindi",
      country: "PK",
      lat: 33.6007,
      lon: 73.0679,
    },
    {
      id: "1167518",
      name: "Peshawar",
      country: "PK",
      lat: 34.008,
      lon: 71.5785,
    },
    {
      id: "1167718",
      name: "Quetta",
      country: "PK",
      lat: 30.1841,
      lon: 67.0014,
    },
    {
      id: "1166994",
      name: "Sialkot",
      country: "PK",
      lat: 32.4927,
      lon: 74.5313,
    },
    {
      id: "1170883",
      name: "Gujranwala",
      country: "PK",
      lat: 32.1557,
      lon: 74.1871,
    },
  ],
  // United States (10 cities)
  US: [
    {
      id: "5128581",
      name: "New York",
      country: "US",
      lat: 40.7143,
      lon: -74.006,
    },
    {
      id: "5368361",
      name: "Los Angeles",
      country: "US",
      lat: 34.0522,
      lon: -118.2437,
    },
    { id: "4887398", name: "Chicago", country: "US", lat: 41.85, lon: -87.65 },
    {
      id: "4699066",
      name: "Houston",
      country: "US",
      lat: 29.7633,
      lon: -95.3633,
    },
    {
      id: "4164138",
      name: "Miami",
      country: "US",
      lat: 25.7743,
      lon: -80.1937,
    },
    {
      id: "5392171",
      name: "San Francisco",
      country: "US",
      lat: 37.7749,
      lon: -122.4194,
    },
    {
      id: "5308655",
      name: "Phoenix",
      country: "US",
      lat: 33.4484,
      lon: -112.074,
    },
    {
      id: "4560349",
      name: "Philadelphia",
      country: "US",
      lat: 39.9523,
      lon: -75.1638,
    },
    {
      id: "5391811",
      name: "San Diego",
      country: "US",
      lat: 32.7157,
      lon: -117.1647,
    },
    {
      id: "4684888",
      name: "Dallas",
      country: "US",
      lat: 32.7767,
      lon: -96.797,
    },
  ],
  // United Kingdom (10 cities)
  GB: [
    {
      id: "2643743",
      name: "London",
      country: "GB",
      lat: 51.5085,
      lon: -0.1257,
    },
    {
      id: "2641673",
      name: "Manchester",
      country: "GB",
      lat: 53.4809,
      lon: -2.2374,
    },
    {
      id: "2644668",
      name: "Birmingham",
      country: "GB",
      lat: 52.4814,
      lon: -1.8998,
    },
    {
      id: "2640729",
      name: "Edinburgh",
      country: "GB",
      lat: 55.9521,
      lon: -3.1965,
    },
    {
      id: "2638077",
      name: "Liverpool",
      country: "GB",
      lat: 53.4106,
      lon: -2.9779,
    },
    {
      id: "2654675",
      name: "Bristol",
      country: "GB",
      lat: 51.4552,
      lon: -2.5966,
    },
    {
      id: "2633352",
      name: "Leeds",
      country: "GB",
      lat: 53.7965,
      lon: -1.5479,
    },
    {
      id: "2653822",
      name: "Cardiff",
      country: "GB",
      lat: 51.4816,
      lon: -3.1791,
    },
    {
      id: "2652221",
      name: "Glasgow",
      country: "GB",
      lat: 55.8652,
      lon: -4.2576,
    },
    {
      id: "2653941",
      name: "Cambridge",
      country: "GB",
      lat: 52.2053,
      lon: 0.1218,
    },
  ],
  // India (10 cities)
  IN: [
    { id: "1273294", name: "Delhi", country: "IN", lat: 28.6519, lon: 77.2315 },
    {
      id: "1275339",
      name: "Mumbai",
      country: "IN",
      lat: 19.0728,
      lon: 72.8826,
    },
    {
      id: "1277333",
      name: "Bangalore",
      country: "IN",
      lat: 12.9719,
      lon: 77.5937,
    },
    {
      id: "1264527",
      name: "Chennai",
      country: "IN",
      lat: 13.0878,
      lon: 80.2785,
    },
    {
      id: "1275004",
      name: "Kolkata",
      country: "IN",
      lat: 22.5626,
      lon: 88.363,
    },
    {
      id: "1279233",
      name: "Ahmedabad",
      country: "IN",
      lat: 23.0225,
      lon: 72.5714,
    },
    {
      id: "1269843",
      name: "Hyderabad",
      country: "IN",
      lat: 17.3841,
      lon: 78.4564,
    },
    {
      id: "1274746",
      name: "Pune",
      country: "IN",
      lat: 18.5204,
      lon: 73.8567,
    },
    {
      id: "1269515",
      name: "Jaipur",
      country: "IN",
      lat: 26.9124,
      lon: 75.7873,
    },
    {
      id: "1259229",
      name: "Surat",
      country: "IN",
      lat: 21.1702,
      lon: 72.8311,
    },
  ],
  // Canada (10 cities)
  CA: [
    {
      id: "6167865",
      name: "Toronto",
      country: "CA",
      lat: 43.7001,
      lon: -79.4163,
    },
    {
      id: "6077243",
      name: "Montreal",
      country: "CA",
      lat: 45.5088,
      lon: -73.5878,
    },
    {
      id: "6173331",
      name: "Vancouver",
      country: "CA",
      lat: 49.2497,
      lon: -123.1193,
    },
    {
      id: "5946768",
      name: "Edmonton",
      country: "CA",
      lat: 53.5501,
      lon: -113.4687,
    },
    {
      id: "6094817",
      name: "Ottawa",
      country: "CA",
      lat: 45.4112,
      lon: -75.6981,
    },
    {
      id: "6183235",
      name: "Calgary",
      country: "CA",
      lat: 51.0501,
      lon: -114.0853,
    },
    {
      id: "6076211",
      name: "Mississauga",
      country: "CA",
      lat: 43.5789,
      lon: -79.6583,
    },
    {
      id: "6155721",
      name: "Winnipeg",
      country: "CA",
      lat: 49.8844,
      lon: -97.147,
    },
    {
      id: "6945994",
      name: "Quebec City",
      country: "CA",
      lat: 46.8299,
      lon: -71.254,
    },
    {
      id: "6075357",
      name: "Hamilton",
      country: "CA",
      lat: 43.2557,
      lon: -79.8711,
    },
  ],
  // Australia (10 cities)
  AU: [
    {
      id: "2158177",
      name: "Sydney",
      country: "AU",
      lat: -33.8679,
      lon: 151.2073,
    },
    {
      id: "2153391",
      name: "Melbourne",
      country: "AU",
      lat: -37.814,
      lon: 144.9633,
    },
    {
      id: "2174003",
      name: "Brisbane",
      country: "AU",
      lat: -27.4679,
      lon: 153.0281,
    },
    {
      id: "2078025",
      name: "Perth",
      country: "AU",
      lat: -31.9522,
      lon: 115.8614,
    },
    {
      id: "2073124",
      name: "Adelaide",
      country: "AU",
      lat: -34.9287,
      lon: 138.5986,
    },
    {
      id: "2172517",
      name: "Canberra",
      country: "AU",
      lat: -35.2835,
      lon: 149.1281,
    },
    {
      id: "2165087",
      name: "Gold Coast",
      country: "AU",
      lat: -28.0003,
      lon: 153.4309,
    },
    {
      id: "2063523",
      name: "Newcastle",
      country: "AU",
      lat: -32.9272,
      lon: 151.7765,
    },
    {
      id: "2146148",
      name: "Wollongong",
      country: "AU",
      lat: -34.4251,
      lon: 150.8932,
    },
    {
      id: "2176592",
      name: "Hobart",
      country: "AU",
      lat: -42.8794,
      lon: 147.3294,
    },
  ],
};

// Default cities (fallback if country not found)
const DEFAULT_CITIES: City[] = [
  {
    id: "5128581",
    name: "New York",
    country: "US",
    lat: 40.7143,
    lon: -74.006,
  },
  { id: "2643743", name: "London", country: "GB", lat: 51.5085, lon: -0.1257 },
  { id: "1850147", name: "Tokyo", country: "JP", lat: 35.6895, lon: 139.6917 },
  {
    id: "1796236",
    name: "Shanghai",
    country: "CN",
    lat: 31.2222,
    lon: 121.4581,
  },
  {
    id: "3435910",
    name: "Buenos Aires",
    country: "AR",
    lat: -34.6132,
    lon: -58.3772,
  },
];

interface MapProviderProps {
  children: ReactNode;
}

export function MapProvider({ children }: MapProviderProps) {
  const [state, dispatch] = useReducer(mapReducer, initialState);

  // Request user location
  const requestUserLocation = async (): Promise<void> => {
    if (!navigator.geolocation) {
      dispatch({
        type: "SET_ERROR",
        payload: "Geolocation is not supported by your browser",
      });
      toast.error("Geolocation not supported");
      return;
    }

    dispatch({ type: "SET_LOCATION_LOADING", payload: true });

    return new Promise((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;

          try {
            // Get country from coordinates using reverse geocoding
            const reverseGeocodeData = await geocodingAPI.getCityName(
              latitude,
              longitude
            );

            if (reverseGeocodeData && reverseGeocodeData.length > 0) {
              const locationData = reverseGeocodeData[0];

              dispatch({
                type: "SET_USER_LOCATION",
                payload: {
                  latitude,
                  longitude,
                  countryCode: locationData.country,
                  countryName: locationData.name || locationData.country,
                },
              });

              dispatch({ type: "SET_LOCATION_ALLOWED", payload: true });

              // Fetch cities for this country
              await fetchCountryCitiesWeather(locationData.country);

              // Fly to user's location
              dispatch({
                type: "SET_VIEWPORT",
                payload: {
                  latitude,
                  longitude,
                  zoom: 8,
                },
              });

              toast.success(`Location detected: ${locationData.country}`);
            }
          } catch (error) {
            console.error("Error getting country from coordinates:", error);
            dispatch({
              type: "SET_ERROR",
              payload: "Could not determine country from location",
            });
            toast.error("Could not determine country from location");
          }

          dispatch({ type: "SET_LOCATION_LOADING", payload: false });
          resolve();
        },
        (error) => {
          let errorMessage = "Unable to retrieve your location";

          switch (error.code) {
            case error.PERMISSION_DENIED:
              errorMessage =
                "Location permission denied. Using default cities.";
              dispatch({ type: "SET_LOCATION_ALLOWED", payload: false });
              // Load default cities if location is denied
              fetchDefaultCities();
              break;
            case error.POSITION_UNAVAILABLE:
              errorMessage = "Location information unavailable.";
              break;
            case error.TIMEOUT:
              errorMessage = "Location request timed out.";
              break;
          }

          dispatch({ type: "SET_ERROR", payload: errorMessage });
          dispatch({ type: "SET_LOCATION_LOADING", payload: false });
          toast.error(errorMessage);
          reject(error);
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 0,
        }
      );
    });
  };

  // Fetch weather for cities in a specific country
  const fetchCountryCitiesWeather = async (
    countryCode: string
  ): Promise<void> => {
    dispatch({ type: "SET_LOADING", payload: true });

    try {
      // Get cities for this country or use default
      const cities = COUNTRY_CITIES[countryCode] || DEFAULT_CITIES;

      // Create markers from cities
      const markers: MapMarker[] = cities.map((city) => ({
        id: `marker-${city.id}`,
        cityId: city.id,
        latitude: city.lat,
        longitude: city.lon,
        weather: null,
        isActive: false,
      }));

      dispatch({ type: "SET_MARKERS", payload: markers });

      // Fetch weather for all cities
      const citiesForWeather = cities.map((city) => ({
        lat: city.lat,
        lon: city.lon,
      }));
      const weatherResults = await weatherAPI.getMultipleCitiesWeather(
        citiesForWeather
      );

      // Update markers with weather data
      weatherResults.forEach((weather: WeatherData, index: number) => {
        if (weather && markers[index]) {
          dispatch({
            type: "UPDATE_MARKER_WEATHER",
            payload: {
              cityId: markers[index].cityId,
              weather,
            },
          });
        }
      });

      toast.success(
        `Loaded ${weatherResults.length} cities for ${countryCode}`
      );
    } catch (error) {
      console.error("Error fetching country cities weather:", error);
      dispatch({
        type: "SET_ERROR",
        payload: "Failed to load city weather data",
      });
      toast.error("Failed to load city weather data");
    } finally {
      dispatch({ type: "SET_LOADING", payload: false });
    }
  };

  // Fetch default cities (fallback)
  const fetchDefaultCities = async (): Promise<void> => {
    dispatch({ type: "SET_LOADING", payload: true });

    try {
      const markers: MapMarker[] = DEFAULT_CITIES.map((city) => ({
        id: `marker-${city.id}`,
        cityId: city.id,
        latitude: city.lat,
        longitude: city.lon,
        weather: null,
        isActive: false,
      }));

      dispatch({ type: "SET_MARKERS", payload: markers });

      // Fetch weather for default cities
      const citiesForWeather = DEFAULT_CITIES.map((city) => ({
        lat: city.lat,
        lon: city.lon,
      }));
      const weatherResults = await weatherAPI.getMultipleCitiesWeather(
        citiesForWeather
      );

      weatherResults.forEach((weather: WeatherData, index: number) => {
        if (weather && markers[index]) {
          dispatch({
            type: "UPDATE_MARKER_WEATHER",
            payload: {
              cityId: markers[index].cityId,
              weather,
            },
          });
        }
      });
    } catch (error) {
      console.error("Error fetching default cities weather:", error);
      dispatch({
        type: "SET_ERROR",
        payload: "Failed to load default cities weather",
      });
    } finally {
      dispatch({ type: "SET_LOADING", payload: false });
    }
  };

  // Update marker weather
  const updateMarkerWeather = (cityId: string, weather: WeatherData): void => {
    dispatch({
      type: "UPDATE_MARKER_WEATHER",
      payload: { cityId, weather },
    });
  };

  // Set selected city
  const setSelectedCity = (cityId: string | null): void => {
    dispatch({ type: "SET_SELECTED_CITY", payload: cityId });
  };

  // Fly to specific city
  const flyToCity = (lat: number, lon: number, zoom: number = 10): void => {
    dispatch({
      type: "SET_VIEWPORT",
      payload: {
        latitude: lat,
        longitude: lon,
        zoom,
      },
    });
  };

  // Initialize with default cities on mount
  useEffect(() => {
    fetchDefaultCities();
  }, []);

  const value: MapContextType = {
    state,
    dispatch,
    requestUserLocation,
    fetchCountryCitiesWeather,
    updateMarkerWeather,
    setSelectedCity,
    flyToCity,
  };

  return <MapContext.Provider value={value}>{children}</MapContext.Provider>;
}

// Custom hook to use the MapContext
export function useMap() {
  const context = useContext(MapContext);
  if (context === undefined) {
    throw new Error("useMap must be used within a MapProvider");
  }
  return context;
}
