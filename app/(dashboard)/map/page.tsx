"use client";

import React, { useEffect, useRef, useState } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import { useMap } from "@/lib/context";
import { useTheme } from "next-themes";
import { Loader2, Navigation } from "lucide-react";

mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN || "";

const MapPage = () => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const { theme, resolvedTheme } = useTheme();
  const { state, requestUserLocation, flyToCity } = useMap();
  const [mapLoaded, setMapLoaded] = useState(false);
  const [popup, setPopup] = useState<mapboxgl.Popup | null>(null);

  const activeTheme = theme === "system" ? resolvedTheme : theme;

  // Initialize map
  useEffect(() => {
    if (!mapContainer.current || map.current || !mapboxgl.accessToken) return;

    // Choose map style based on theme
    const mapStyle =
      activeTheme === "dark"
        ? "mapbox://styles/mapbox/dark-v11"
        : "mapbox://styles/mapbox/light-v11";

    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: mapStyle,
      center: [state.viewport.longitude, state.viewport.latitude],
      zoom: state.viewport.zoom,
      pitch: state.viewport.pitch,
      bearing: state.viewport.bearing,
    });

    // Add navigation controls
    map.current.addControl(new mapboxgl.NavigationControl(), "top-right");

    // Handle map load
    map.current.on("load", () => {
      setMapLoaded(true);
    });

    // Handle map movement
    map.current.on("move", () => {
      if (!map.current) return;

      const { lng, lat } = map.current.getCenter();
      const zoom = map.current.getZoom();

      // You could dispatch viewport updates here if needed
      // dispatch({ type: "SET_VIEWPORT", payload: { longitude: lng, latitude: lat, zoom } });
    });

    // Cleanup
    return () => {
      if (map.current) {
        map.current.remove();
        map.current = null;
      }
      if (popup) {
        popup.remove();
      }
    };
  }, []);

  // Update map style when theme changes
  useEffect(() => {
    if (!map.current || !mapLoaded) return;

    const mapStyle =
      activeTheme === "dark"
        ? "mapbox://styles/mapbox/dark-v11"
        : "mapbox://styles/mapbox/light-v11";

    map.current.setStyle(mapStyle);
  }, [theme, mapLoaded]);

  // Update viewport when state changes
  useEffect(() => {
    if (!map.current || !mapLoaded) return;

    map.current.flyTo({
      center: [state.viewport.longitude, state.viewport.latitude],
      zoom: state.viewport.zoom,
      bearing: state.viewport.bearing,
      pitch: state.viewport.pitch,
      duration: 1000,
    });
  }, [state.viewport, mapLoaded]);

  // Add/update markers when markers change
  useEffect(() => {
    const mapInstance = map.current;
    if (!mapInstance || !mapLoaded) return;

    // Remove existing markers
    const markers = document.querySelectorAll(".mapboxgl-marker");
    markers.forEach((marker) => marker.remove());

    // Add new markers
    state.markers.forEach((marker) => {
      if (!marker.weather || !map.current) return;

      // Create marker element
      const el = document.createElement("div");
      el.className = "weather-marker";

      // Determine marker color based on temperature
      const temp = marker.weather.main.temp;
      let colorClass = "bg-blue-500"; // Default for moderate temps

      if (temp < 0) colorClass = "bg-blue-700"; // Very cold
      else if (temp < 10) colorClass = "bg-blue-400"; // Cold
      else if (temp > 30) colorClass = "bg-red-500"; // Hot
      else if (temp > 25) colorClass = "bg-orange-500"; // Warm

      // Create marker content
      el.innerHTML = `
        <div class="relative group">
          <div class="w-8 h-8 rounded-full ${colorClass} border-2 border-white shadow-lg flex items-center justify-center cursor-pointer transition-transform hover:scale-110">
            <span class="text-white text-xs font-bold">${Math.round(
              temp
            )}°</span>
          </div>
          <div class="absolute -top-2 -right-2 w-4 h-4 bg-white rounded-full flex items-center justify-center">
            <div class="w-2 h-2 ${
              marker.isActive ? "bg-green-500" : "bg-gray-400"
            } rounded-full"></div>
          </div>
        </div>
      `;

      // Create popup content
      const popupContent = document.createElement("div");
      popupContent.className = "p-4 min-w-[250px]";

      const weather = marker.weather;
      popupContent.innerHTML = `
        <div class="space-y-3">
          <div class="flex items-center justify-between">
            <h3 class="text-lg font-semibold text-gray-900 dark:text-white">${
              weather.name
            }</h3>
            <span class="text-sm text-gray-500 dark:text-gray-400">${
              weather.sys.country
            }</span>
          </div>
          
          <div class="flex items-center space-x-4">
            <div class="text-3xl font-bold text-gray-900 dark:text-white">
              ${Math.round(weather.main.temp)}°C
            </div>
            <div class="text-right">
              <div class="text-sm text-gray-600 dark:text-gray-300">${
                weather.weather[0].description
              }</div>
              <div class="text-xs text-gray-500 dark:text-gray-400">
                Feels like: ${Math.round(weather.main.feels_like)}°C
              </div>
            </div>
          </div>
          
          <div class="grid grid-cols-2 gap-2 text-sm">
            <div class="flex items-center space-x-2">
              <span class="text-gray-500 dark:text-gray-400">Humidity:</span>
              <span class="font-medium text-gray-900 dark:text-white">${
                weather.main.humidity
              }%</span>
            </div>
            <div class="flex items-center space-x-2">
              <span class="text-gray-500 dark:text-gray-400">Wind:</span>
              <span class="font-medium text-gray-900 dark:text-white">${
                weather.wind.speed
              } m/s</span>
            </div>
            <div class="flex items-center space-x-2">
              <span class="text-gray-500 dark:text-gray-400">Pressure:</span>
              <span class="font-medium text-gray-900 dark:text-white">${
                weather.main.pressure
              } hPa</span>
            </div>
            <div class="flex items-center space-x-2">
              <span class="text-gray-500 dark:text-gray-400">Min/Max:</span>
              <span class="font-medium text-gray-900 dark:text-white">
                ${Math.round(weather.main.temp_min)}°/${Math.round(
        weather.main.temp_max
      )}°
              </span>
            </div>
          </div>
        </div>
      `;

      // Create marker
      const mapboxMarker = new mapboxgl.Marker({
        element: el,
        anchor: "bottom",
      })
        .setLngLat([marker.longitude, marker.latitude])
        .addTo(mapInstance);

      // Add click event to marker
      el.addEventListener("click", (e) => {
        e.stopPropagation();

        // Remove existing popup
        if (popup) {
          popup.remove();
        }

        // Create new popup
        const newPopup = new mapboxgl.Popup({
          closeButton: true,
          closeOnClick: false,
          anchor: "top",
          offset: 10,
          className: "dark:bg-gray-800 dark:text-white text-lg",
        })
          .setLngLat([marker.longitude, marker.latitude])
          .setDOMContent(popupContent)
          .addTo(mapInstance);

        setPopup(newPopup);

        // Fly to marker
        flyToCity(marker.latitude, marker.longitude, 8);
      });
    });
  }, [state.markers, mapLoaded, theme]);

  // Request user location on mount
  useEffect(() => {
    requestUserLocation();
  }, []);

  // Handle fly to user location
  const flyToUserLocation = () => {
    if (state.userLocation.latitude && state.userLocation.longitude) {
      flyToCity(state.userLocation.latitude, state.userLocation.longitude, 8);
    }
  };

  if (!mapboxgl.accessToken) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center p-8 bg-white dark:bg-gray-800 rounded-lg shadow-lg">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
            Mapbox Token Missing
          </h2>
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-full h-screen">
      {/* Loading overlay */}
      {state.isLoading && (
        <div className="absolute inset-0 bg-white/80 dark:bg-gray-900/80 z-50 flex items-center justify-center">
          <div className="text-center">
            <Loader2 className="w-8 h-8 animate-spin text-blue-500 mx-auto mb-2" />
            <p className="text-gray-700 dark:text-gray-300">
              Loading map and weather data...
            </p>
          </div>
        </div>
      )}

      {/* User location button */}
      <button
        onClick={flyToUserLocation}
        disabled={!state.userLocation.latitude || !state.userLocation.longitude}
        className="absolute bottom-10 right-4 z-10 p-3 bg-white dark:bg-gray-800 rounded-lg shadow-lg hover:shadow-xl transition-shadow disabled:opacity-50 disabled:cursor-not-allowed"
        title="Fly to my location"
      >
        <Navigation className="w-5 h-5 text-gray-700 dark:text-gray-300" />
      </button>

      {/* Location status */}
      <div className="absolute top-4 left-4 z-10 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-lg shadow-lg p-4 max-w-sm">
        <div className="flex items-center space-x-3">
          <div
            className={`w-3 h-3 rounded-full ${
              state.isLocationAllowed ? "bg-green-500" : "bg-yellow-500"
            }`}
          />
          <div>
            <h3 className="font-medium text-gray-900 dark:text-white">
              {state.isLocationAllowed
                ? "Location Detected"
                : "Location Not Available"}
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {state.isLocationAllowed
                ? `Showing cities in ${
                    state.userLocation.countryName || "your country"
                  }`
                : "Using default cities"}
            </p>
          </div>
        </div>
      </div>

      {/* Error message */}
      {state.error && (
        <div className="absolute top-20 left-1/2 transform -translate-x-1/2 z-10 bg-red-100 dark:bg-red-900/30 border border-red-300 dark:border-red-700 rounded-lg p-3 max-w-md">
          <p className="text-red-700 dark:text-red-300 text-sm">
            {state.error}
          </p>
        </div>
      )}

      {/* Map container */}
      <div ref={mapContainer} className="w-full h-full" />

      {/* Cities counter */}
      {state.markers.length > 0 && (
        <div className="absolute bottom-4 left-4 z-10 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-lg shadow-lg p-3">
          <p className="text-sm font-medium text-gray-900 dark:text-white">
            Showing{" "}
            <span className="text-blue-500">{state.markers.length}</span> cities
          </p>
        </div>
      )}
    </div>
  );
};

export default MapPage;
