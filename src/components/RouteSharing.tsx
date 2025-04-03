
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { MapPin, Navigation } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { startRouteSharing, stopRouteSharing, getRouteData } from "@/services/locationService";

const RouteSharing = () => {
  const [destination, setDestination] = useState("");
  const [isRouteSharingActive, setIsRouteSharingActive] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  // Initialize state from localStorage on component mount
  useEffect(() => {
    const savedData = getRouteData();
    if (savedData && savedData.isActive) {
      setDestination(savedData.destination);
      setIsRouteSharingActive(true);
    }
  }, []);

  const handleRouteShare = () => {
    if (!destination.trim()) {
      toast({
        title: "Validation Error",
        description: "Please enter a destination.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    
    try {
      startRouteSharing(destination);
      setIsRouteSharingActive(true);
      
      toast({
        title: "Route Sharing Activated",
        description: "Your travel route is now being shared with trusted contacts.",
      });
    } catch (error) {
      console.error("Error starting route sharing:", error);
      toast({
        title: "Error",
        description: "Failed to start route sharing. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleStopSharing = () => {
    setIsLoading(true);
    
    try {
      stopRouteSharing();
      setIsRouteSharingActive(false);
      
      toast({
        title: "Route Sharing Deactivated",
        description: "Your travel route is no longer being shared.",
      });
    } catch (error) {
      console.error("Error stopping route sharing:", error);
      toast({
        title: "Error",
        description: "Failed to stop route sharing. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className={`mb-6 ${isRouteSharingActive ? 'border-2 border-blue-500' : ''}`}>
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center">
          <Navigation className="mr-2 h-5 w-5 text-blue-600" />
          Share Your Route
        </CardTitle>
      </CardHeader>
      <CardContent>
        {!isRouteSharingActive ? (
          <>
            <div className="mb-4">
              <label htmlFor="destination" className="block text-sm font-medium text-gray-700 mb-1">
                Where are you going?
              </label>
              <Input
                id="destination"
                placeholder="Enter your destination"
                value={destination}
                onChange={(e) => setDestination(e.target.value)}
                disabled={isLoading}
              />
            </div>
            <Button 
              className="w-full" 
              onClick={handleRouteShare}
              disabled={!destination.trim() || isLoading}
            >
              <MapPin className="mr-2 h-4 w-4" />
              Share My Route
            </Button>
          </>
        ) : (
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <div className="bg-blue-100 p-2 rounded-full">
                <MapPin className="h-4 w-4 text-blue-600" />
              </div>
              <div>
                <p className="text-xs text-gray-500">Destination</p>
                <p className="font-medium">{destination}</p>
              </div>
            </div>
            
            <div className="p-2 bg-blue-50 rounded-md text-blue-700 text-xs">
              Route is being shared with your trusted contacts
            </div>
            
            <Button 
              variant="outline" 
              className="w-full border-red-200 text-red-500 hover:bg-red-50 hover:text-red-600"
              onClick={handleStopSharing}
              disabled={isLoading}
            >
              Stop Sharing Route
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default RouteSharing;
