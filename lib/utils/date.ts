export const formatUnixTimestamp = (
  timestamp: number,
  formatStr: string = "PPpp"
): string => {
  // If timestamp is in seconds, convert to milliseconds
  const date = new Date(timestamp * 1000);

  // Fallback formatting if date-fns is not available
  const options: Intl.DateTimeFormatOptions = {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  };

  return date.toLocaleDateString("en-US", options);
};

export const formatTime = (timestamp: number): string => {
  const date = new Date(timestamp * 1000);
  return date.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
};

export const formatDay = (timestamp: number): string => {
  const date = new Date(timestamp * 1000);
  return date.toLocaleDateString("en-US", { weekday: "long" });
};

export const formatDate = (timestamp: number): string => {
  const date = new Date(timestamp * 1000);
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
};

export const getTimeOfDay = (
  timestamp: number
): "morning" | "afternoon" | "evening" | "night" => {
  const hour = new Date(timestamp * 1000).getHours();

  if (hour >= 5 && hour < 12) return "morning";
  if (hour >= 12 && hour < 17) return "afternoon";
  if (hour >= 17 && hour < 21) return "evening";
  return "night";
};

export const getDayPeriod = (
  timestamp: number
): "dawn" | "day" | "dusk" | "night" => {
  const hour = new Date(timestamp * 1000).getHours();

  if (hour >= 4 && hour < 8) return "dawn";
  if (hour >= 8 && hour < 18) return "day";
  if (hour >= 18 && hour < 20) return "dusk";
  return "night";
};

export const isDayTime = (timestamp: number): boolean => {
  const hour = new Date(timestamp * 1000).getHours();
  return hour >= 6 && hour < 18;
};

export const formatTimeFromNow = (timestamp: number): string => {
  const now = Date.now() / 1000;
  const diff = timestamp - now;

  if (diff < 0) return "Now";
  if (diff < 3600) return `${Math.round(diff / 60)} min`;
  if (diff < 86400)
    return `${Math.round(diff / 3600)} hour${
      Math.round(diff / 3600) > 1 ? "s" : ""
    }`;
  return `${Math.round(diff / 86400)} day${
    Math.round(diff / 86400) > 1 ? "s" : ""
  }`;
};
