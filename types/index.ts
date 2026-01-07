export interface WeatherData {
  id: number;
  name: string;
  dt: number;
  sys: {
    country: string;
  };
  main: {
    temp: number;
    feels_like: number;
    humidity: number;
    pressure: number;
    temp_min: number;
    temp_max: number;
  };
  weather: Array<{
    id: number;
    main: string;
    description: string;
    icon: string;
  }>;
  wind: {
    speed: number;
    deg: number;
  };
  coord: {
    lat: number;
    lon: number;
  };
}

export interface ForecastData {
  list: Array<{
    dt: number;
    main: WeatherData["main"];
    weather: WeatherData["weather"];
    wind: WeatherData["wind"];
  }>;
}

export interface City {
  id: string;
  name: string;
  country: string;
  lat: number;
  lon: number;
  favorite?: boolean;
}

// For mapbox integration
export interface MapViewport {
  latitude: number;
  longitude: number;
  zoom: number;
  bearing?: number;
  pitch?: number;
  padding?: {
    top: number;
    bottom: number;
    left: number;
    right: number;
  };
}

export interface MapMarker {
  id: string;
  cityId: string;
  latitude: number;
  longitude: number;
  weather: WeatherData | null;
  isActive: boolean;
}

export interface CountryCities {
  [countryCode: string]: City[];
}

export interface MapState {
  viewport: MapViewport;
  markers: MapMarker[];
  userLocation: {
    latitude: number | null;
    longitude: number | null;
    countryCode: string | null;
    countryName: string | null;
  };
  isLoading: boolean;
  error: string | null;
  selectedCity: string | null;
  isLocationAllowed: boolean;
  isLocationLoading: boolean;
}

export type MapAction =
  | { type: "SET_VIEWPORT"; payload: Partial<MapViewport> }
  | { type: "SET_MARKERS"; payload: MapMarker[] }
  | {
      type: "UPDATE_MARKER_WEATHER";
      payload: { cityId: string; weather: WeatherData };
    }
  | {
      type: "SET_USER_LOCATION";
      payload: {
        latitude: number;
        longitude: number;
        countryCode: string;
        countryName: string;
      };
    }
  | { type: "SET_SELECTED_CITY"; payload: string | null }
  | { type: "SET_LOADING"; payload: boolean }
  | { type: "SET_ERROR"; payload: string | null }
  | { type: "SET_LOCATION_ALLOWED"; payload: boolean }
  | { type: "SET_LOCATION_LOADING"; payload: boolean }
  | { type: "RESET_MAP_STATE" };

export interface MapContextType {
  state: MapState;
  dispatch: React.Dispatch<MapAction>;
  requestUserLocation: () => Promise<void>;
  fetchCountryCitiesWeather: (countryCode: string) => Promise<void>;
  updateMarkerWeather: (cityId: string, weather: WeatherData) => void;
  setSelectedCity: (cityId: string | null) => void;
  flyToCity: (lat: number, lon: number, zoom?: number) => void;
}
