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
