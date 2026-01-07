import { MapMarker } from "@/types";

// Calculate distance between two coordinates in kilometers
export function calculateDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371; // Earth's radius in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

// Filter markers by proximity to user location
export function filterMarkersByProximity(
  markers: MapMarker[],
  userLat: number,
  userLon: number,
  maxDistanceKm: number = 500
): MapMarker[] {
  return markers.filter((marker) => {
    const distance = calculateDistance(
      userLat,
      userLon,
      marker.latitude,
      marker.longitude
    );
    return distance <= maxDistanceKm;
  });
}

// Generate a random color for map features
export function generateRandomColor(): string {
  return `#${Math.floor(Math.random() * 16777215).toString(16)}`;
}

// Format coordinates for display
export function formatCoordinates(lat: number, lon: number): string {
  const latDir = lat >= 0 ? "N" : "S";
  const lonDir = lon >= 0 ? "E" : "W";
  return `${Math.abs(lat).toFixed(4)}°${latDir}, ${Math.abs(lon).toFixed(
    4
  )}°${lonDir}`;
}
