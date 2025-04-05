import React, { useState, useEffect, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { MapPin, AlertCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { 
  startLocationSharing, 
  stopLocationSharing, 
  getLocationData,
  watchLocation,
  stopWatchingLocation,
  saveLocationHistory
} from "@/services/locationService";
import { sendSOSMessage } from "@/services/smsService";
import { sendLocationTrackingMessage } from "@/services/smsService";


const LocationSharingCard = () => {
  const [isSharing, setIsSharing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null);
  const [error, setError] = useState<string | null>(null);
  const watchIdRef = useRef<number | null>(null);
  const { toast } = useToast();

  // Initialize state from Supabase on component mount
  useEffect(() => {
    const fetchLocationData = async () => {
      try {
        const savedData = await getLocationData();
        if (savedData) {
          setIsSharing(savedData.isSharing);
          setLastUpdate(new Date(savedData.timestamp));
        }
      } catch (error) {
        console.error("Error fetching location data:", error);
      }
    };

    fetchLocationData();
  }, []);

  // Handle location updates
  useEffect(() => {
    if (isSharing) {
      watchIdRef.current = watchLocation(
        async (position) => {
          try {
            const locationData = {
              latitude: position.coords.latitude,
              longitude: position.coords.longitude,
              timestamp: Date.now(),
              isSharing: true,
              accuracy: position.coords.accuracy,
              speed: position.coords.speed || 0
            };
            await saveLocationHistory(locationData);
            setLastUpdate(new Date());
            setError(null);
          } catch (error) {
            console.error("Error updating location:", error);
            setError("Failed to update location");
          }
        },
        (error) => {
          console.error("Location error:", error);
          setError(error.message);
        },
        {
          enableHighAccuracy: true,
          timeout: 60000, // 1 minute timeout
          maximumAge: 0
        }
      );
    }

    return () => {
      if (watchIdRef.current !== null) {
        stopWatchingLocation(watchIdRef.current);
      }
    };
  }, [isSharing]);

  const handleToggle = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      if (!isSharing) {
        // Start sharing location
        const locationData = await startLocationSharing();
        setIsSharing(true);
        setLastUpdate(new Date(locationData.timestamp));
        toast({
          title: "Location Tracking Started",
          description: "Your location is now being tracked.",
        });

        // Send WhatsApp message to trusted contacts
        try {
          const message = `🚨 Location Tracking Started\n\nI have enabled location tracking. You can check my current location here:\nhttps://www.google.com/maps?q=${locationData.latitude},${locationData.longitude}\n\nStay safe!`;
          await sendLocationTrackingMessage(locationData);
          toast({
            title: "Location Tracking Started",
            description: "Your trusted contacts have been notified.",
          });
        } catch (smsError) {
          console.error('Error sending WhatsApp message:', smsError);
          toast({
            title: "Location Tracking Started",
            description: "Could not notify contacts via WhatsApp.",
            variant: "destructive",
          });
        }
      } else {
        // Stop sharing location
        await stopLocationSharing();
        setIsSharing(false);
        setLastUpdate(null);
        toast({
          title: "Location Tracking Stopped",
          description: "Your location is no longer being tracked.",
        });
      }
    } catch (error: any) {
      console.error("Error toggling location tracking:", error);
      setError(error.message);
      toast({
        title: "Error",
        description: "Failed to toggle location tracking. Please check your permissions.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className={`mb-6 border-2 ${isSharing ? 'border-green-500 bg-green-50' : 'border-gray-200'}`}>
      <CardHeader className="pb-2">
        <CardTitle className="flex justify-between items-center">
          <div className="flex items-center">
            <MapPin className={`mr-2 h-5 w-5 ${isSharing ? 'text-green-500' : 'text-gray-500'}`} />
            Location Tracking
          </div>
          <Switch 
            checked={isSharing} 
            onCheckedChange={handleToggle} 
            className={isSharing ? "bg-green-500" : ""} 
            disabled={isLoading}
          />
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-gray-600">
          {isSharing 
            ? "Your location is currently being tracked." 
            : "Toggle to start tracking your location."}
        </p>
        {isSharing && (
          <div className="mt-2 space-y-2">
            <div className="p-2 bg-green-100 rounded-md text-green-800 text-xs font-medium">
              Live tracking active • Updates every 5 minutes
            </div>
            {lastUpdate && (
              <div className="text-xs text-gray-500">
                Last updated: {lastUpdate.toLocaleTimeString()}
              </div>
            )}
            {error && (
              <div className="flex items-center text-red-500 text-xs">
                <AlertCircle className="h-4 w-4 mr-1" />
                {error}
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default LocationSharingCard;
