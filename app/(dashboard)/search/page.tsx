"use client";
import { useState } from "react";
import { SearchBar } from "@/components/shared/SearchBar";
import { WeatherCard } from "@/components/weather/WeatherCard";
import { useWeather } from "@/lib/context/WeatherContext";
import type { City, WeatherData } from "@/types";

const SearchPage = () => {
  const {
    addCityFromSearch,
    weatherData,
    isLoading,
    error,
    fetchWeatherForCity,
  } = useWeather();

  const [resultCity, setResultCity] = useState<City | null>(null);
  const [fallbackDt, setFallbackDt] = useState<number>(0); //  store dt here

  const handleSearch = async (query: string) => {
    try {
      const city = await addCityFromSearch(query);
      if (city) {
        setResultCity(city);
        setFallbackDt(Math.floor(Date.now() / 1000)); //  Date.now is now outside render
      }
    } catch (err) {
      console.error("Search error:", err);
    }
  };

  const fallbackWeather = (city: City): WeatherData =>
    ({
      id: 0,
      name: city.name,
      dt: fallbackDt, //  stable value from state
      sys: { country: city.country },
      main: {
        temp: 0,
        feels_like: 0,
        humidity: 0,
        pressure: 1013,
        temp_min: 0,
        temp_max: 0,
      },
      weather: [
        { id: 800, main: "Unknown", description: "Loading...", icon: "50d" },
      ],
      wind: { speed: 0, deg: 0 },
      coord: { lat: city.lat, lon: city.lon },
    } as WeatherData);

  const weather = resultCity ? weatherData[resultCity.id] : undefined;

  return (
    <>
      <div className="justify-center p-4">
        <SearchBar onSearch={handleSearch} />
      </div>

      {error && <p className="text-destructive text-center px-4">{error}</p>}

      {resultCity && (
        <div className="max-w-2xl mx-auto p-4">
          <WeatherCard
            key={resultCity.id}
            cityId={resultCity.id}
            weather={weather ?? fallbackWeather(resultCity)}
            loading={!weather && isLoading}
            onRefresh={() => fetchWeatherForCity(resultCity)}
            showFavoriteButton={false}
          />
        </div>
      )}
    </>
  );
};

export default SearchPage;
