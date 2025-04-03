
import { supabase } from '@/lib/supabase';

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

// Save location data to Supabase
export const saveLocationData = async (data: LocationData): Promise<void> => {
  const user = await supabase.auth.getUser();
  const userId = user.data.user?.id;

  if (!userId) {
    console.error("User not authenticated");
    return;
  }

  const { error } = await supabase
    .from('location_shares')
    .upsert({
      user_id: userId,
      latitude: data.latitude,
      longitude: data.longitude,
      is_sharing: data.isSharing,
      timestamp: new Date(data.timestamp).toISOString()
    });

  if (error) {
    console.error("Error saving location data:", error);
  }
};

// Get location data from Supabase
export const getLocationData = async (): Promise<LocationData | null> => {
  const user = await supabase.auth.getUser();
  const userId = user.data.user?.id;

  if (!userId) {
    console.error("User not authenticated");
    return null;
  }

  const { data, error } = await supabase
    .from('location_shares')
    .select('*')
    .eq('user_id', userId)
    .single();

  if (error) {
    console.error("Error getting location data:", error);
    return null;
  }

  if (!data) return null;

  return {
    latitude: data.latitude,
    longitude: data.longitude,
    timestamp: new Date(data.timestamp).getTime(),
    isSharing: data.is_sharing
  };
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
    await saveLocationData(locationData);
    return locationData;
  } catch (error) {
    console.error("Error starting location sharing:", error);
    throw error;
  }
};

// Stop location sharing
export const stopLocationSharing = async (): Promise<void> => {
  const currentData = await getLocationData();
  if (currentData) {
    await saveLocationData({ ...currentData, isSharing: false });
  }
};

// Save route data to Supabase
export const saveRouteData = async (data: RouteData): Promise<void> => {
  const user = await supabase.auth.getUser();
  const userId = user.data.user?.id;

  if (!userId) {
    console.error("User not authenticated");
    return;
  }

  const { error } = await supabase
    .from('route_shares')
    .upsert({
      user_id: userId,
      destination: data.destination,
      start_time: new Date(data.startTime).toISOString(),
      is_active: data.isActive
    });

  if (error) {
    console.error("Error saving route data:", error);
  }
};

// Get route data from Supabase
export const getRouteData = async (): Promise<RouteData | null> => {
  const user = await supabase.auth.getUser();
  const userId = user.data.user?.id;

  if (!userId) {
    console.error("User not authenticated");
    return null;
  }

  const { data, error } = await supabase
    .from('route_shares')
    .select('*')
    .eq('user_id', userId)
    .eq('is_active', true)
    .single();

  if (error && error.code !== 'PGRST116') { // PGRST116 is the code for "no rows returned"
    console.error("Error getting route data:", error);
    return null;
  }

  if (!data) return null;

  return {
    destination: data.destination,
    startTime: new Date(data.start_time).getTime(),
    isActive: data.is_active
  };
};

// Start route sharing
export const startRouteSharing = async (destination: string): Promise<RouteData> => {
  const routeData: RouteData = {
    destination,
    startTime: Date.now(),
    isActive: true,
  };
  await saveRouteData(routeData);
  return routeData;
};

// Stop route sharing
export const stopRouteSharing = async (): Promise<void> => {
  const currentData = await getRouteData();
  if (currentData) {
    await saveRouteData({ ...currentData, isActive: false });
  }
};
