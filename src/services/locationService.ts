import { supabase } from '@/lib/supabase';

interface LocationData {
  latitude: number;
  longitude: number;
  timestamp: number;
  isSharing: boolean;
  accuracy?: number;
  speed?: number;
}

interface RouteData {
  destination: string;
  startTime: number;
  isActive: boolean;
}

let lastUpdateTime = 0;
const UPDATE_INTERVAL = 60000; // 1 minute in milliseconds

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

// Watch location changes
export const watchLocation = (
  onSuccess: (position: GeolocationPosition) => void,
  onError: (error: GeolocationPositionError) => void,
  options: PositionOptions = {
    enableHighAccuracy: true,
    timeout: 60000,
    maximumAge: 0
  }
): number => {
  if (!navigator.geolocation) {
    onError({
      code: 0,
      message: "Geolocation is not supported by this browser",
      PERMISSION_DENIED: 1,
      POSITION_UNAVAILABLE: 2,
      TIMEOUT: 3
    });
    return -1;
  }

  return navigator.geolocation.watchPosition(
    (position) => {
      const currentTime = Date.now();
      if (currentTime - lastUpdateTime >= UPDATE_INTERVAL) {
        lastUpdateTime = currentTime;
        onSuccess(position);
      }
    },
    onError,
    options
  );
};

// Stop watching location
export const stopWatchingLocation = (watchId: number): void => {
  navigator.geolocation.clearWatch(watchId);
};

// Save location data
export const saveLocationData = async (data: LocationData): Promise<void> => {
  const user = await supabase.auth.getUser();
  const userId = user.data.user?.id;

  if (!userId) {
    console.error("User not authenticated");
    return;
  }

  console.log('Saving location data:', {
    userId,
    latitude: data.latitude,
    longitude: data.longitude,
    isSharing: data.isSharing
  });

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
  } else {
    console.log('Location data saved successfully');
  }
};

// Save location history
export const saveLocationHistory = async (data: LocationData): Promise<void> => {
  const user = await supabase.auth.getUser();
  const userId = user.data.user?.id;

  if (!userId) {
    console.error("User not authenticated");
    return;
  }

  console.log('Saving location history:', {
    userId,
    latitude: data.latitude,
    longitude: data.longitude,
    timestamp: new Date(data.timestamp).toISOString()
  });

  const { data: savedData, error } = await supabase
    .from('location_history')
    .insert({
      user_id: userId,
      latitude: data.latitude,
      longitude: data.longitude,
      timestamp: new Date(data.timestamp).toISOString(),
      accuracy: data.accuracy,
      speed: data.speed
    })
    .select();

  if (error) {
    console.error("Error saving location history:", error);
  } else {
    console.log('Location history saved successfully:', savedData);
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

  console.log('Fetching location data for user:', userId);

  const { data, error } = await supabase
    .from('location_shares')
    .select('*')
    .eq('user_id', userId)
    .single();

  if (error) {
    console.error("Error getting location data:", error);
    return null;
  }

  if (!data) {
    console.log('No location data found for user:', userId);
    return null;
  }

  console.log('Retrieved location data:', data);
  return {
    latitude: data.latitude,
    longitude: data.longitude,
    timestamp: new Date(data.timestamp).getTime(),
    isSharing: data.is_sharing,
    accuracy: data.accuracy,
    speed: data.speed
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
      accuracy: position.coords.accuracy,
      speed: position.coords.speed || 0
    };
    await saveLocationData(locationData);
    await saveLocationHistory(locationData);
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

// Share location with trusted contacts
export const shareLocationWithContacts = async (): Promise<void> => {
  const user = await supabase.auth.getUser();
  const userId = user.data.user?.id;

  if (!userId) {
    console.error("User not authenticated");
    return;
  }

  // Get current location
  const locationData = await getLocationData();
  if (!locationData) {
    console.error("No location data found");
    return;
  }

  // Get trusted contacts
  const { data: contacts, error: contactsError } = await supabase
    .from('trusted_contacts')
    .select('*')
    .eq('user_id', userId);

  if (contactsError) {
    console.error("Error fetching trusted contacts:", contactsError);
    return;
  }

  if (!contacts || contacts.length === 0) {
    console.log("No trusted contacts found");
    return;
  }

  // Create Google Maps link
  const mapsLink = `https://www.google.com/maps?q=${locationData.latitude},${locationData.longitude}`;
  
  // Share location with each contact
  for (const contact of contacts) {
    try {
      const message = `Emergency Alert: I am at ${mapsLink}. Please check on me.`;
      
      // Send SMS using Twilio (you'll need to implement this)
      // await sendSMS(contact.phone_number, message);
      
      console.log(`Location shared with ${contact.trusted_contact_name} (${contact.phone_number})`);
    } catch (error) {
      console.error(`Error sharing location with ${contact.trusted_contact_name}:`, error);
    }
  }
};
