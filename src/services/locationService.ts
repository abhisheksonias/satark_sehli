
// Location service to handle location sharing functionality

interface LocationData {
  latitude: number;
  longitude: number;
  timestamp: number;
  isSharing: boolean;
}

interface RouteData {
  destination: string;
  startTime: number;
  isActive: boolean;
}

// Get current location using browser's geolocation API
export const getCurrentLocation = (): Promise<GeolocationPosition> => {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error("Geolocation is not supported by your browser"));
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => resolve(position),
      (error) => reject(error),
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
    );
  });
};

// Save location data to localStorage
export const saveLocationData = (data: LocationData): void => {
  localStorage.setItem("saheliLocationData", JSON.stringify(data));
};

// Get location data from localStorage
export const getLocationData = (): LocationData | null => {
  const data = localStorage.getItem("saheliLocationData");
  return data ? JSON.parse(data) : null;
};

// Start location sharing
export const startLocationSharing = async (): Promise<LocationData> => {
  try {
    const position = await getCurrentLocation();
    const locationData: LocationData = {
      latitude: position.coords.latitude,
      longitude: position.coords.longitude,
      timestamp: Date.now(),
      isSharing: true,
    };
    saveLocationData(locationData);
    return locationData;
  } catch (error) {
    console.error("Error starting location sharing:", error);
    throw error;
  }
};

// Stop location sharing
export const stopLocationSharing = (): void => {
  const currentData = getLocationData();
  if (currentData) {
    saveLocationData({ ...currentData, isSharing: false });
  }
};

// Save route data to localStorage
export const saveRouteData = (data: RouteData): void => {
  localStorage.setItem("saheliRouteData", JSON.stringify(data));
};

// Get route data from localStorage
export const getRouteData = (): RouteData | null => {
  const data = localStorage.getItem("saheliRouteData");
  return data ? JSON.parse(data) : null;
};

// Start route sharing
export const startRouteSharing = (destination: string): RouteData => {
  const routeData: RouteData = {
    destination,
    startTime: Date.now(),
    isActive: true,
  };
  saveRouteData(routeData);
  return routeData;
};

// Stop route sharing
export const stopRouteSharing = (): void => {
  const currentData = getRouteData();
  if (currentData) {
    saveRouteData({ ...currentData, isActive: false });
  }
};
