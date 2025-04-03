
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { MapPin } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { startLocationSharing, stopLocationSharing, getLocationData } from "@/services/locationService";

const LocationSharingCard = () => {
  const [isSharing, setIsSharing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  // Initialize state from localStorage on component mount
  useEffect(() => {
    const savedData = getLocationData();
    if (savedData) {
      setIsSharing(savedData.isSharing);
    }
  }, []);

  const handleToggle = async () => {
    setIsLoading(true);
    
    try {
      if (!isSharing) {
        // Start sharing location
        await startLocationSharing();
        setIsSharing(true);
        toast({
          title: "Location Sharing Activated",
          description: "Your location is now being shared with trusted contacts.",
        });
      } else {
        // Stop sharing location
        stopLocationSharing();
        setIsSharing(false);
        toast({
          title: "Location Sharing Deactivated",
          description: "Your location is no longer being shared.",
        });
      }
    } catch (error) {
      console.error("Error toggling location sharing:", error);
      toast({
        title: "Error",
        description: "Failed to toggle location sharing. Please check your permissions.",
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
            Location Sharing
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
            ? "Your location is currently being shared with your trusted contacts." 
            : "Toggle to start sharing your location with trusted contacts."}
        </p>
        {isSharing && (
          <div className="mt-2 p-2 bg-green-100 rounded-md text-green-800 text-xs font-medium">
            Live sharing active • Updates every 5 minutes
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default LocationSharingCard;
