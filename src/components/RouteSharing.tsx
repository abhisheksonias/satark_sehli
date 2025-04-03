
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { MapPin, Navigation } from "lucide-react";

const RouteSharing = () => {
  const [destination, setDestination] = useState("");
  const [isRouteSharingActive, setIsRouteSharingActive] = useState(false);

  const handleRouteShare = () => {
    if (destination.trim()) {
      setIsRouteSharingActive(true);
    }
  };

  const handleStopSharing = () => {
    setIsRouteSharingActive(false);
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
              />
            </div>
            <Button 
              className="w-full" 
              onClick={handleRouteShare}
              disabled={!destination.trim()}
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
