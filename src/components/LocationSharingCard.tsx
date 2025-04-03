
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { MapPin } from "lucide-react";

interface LocationSharingCardProps {
  isSharing: boolean;
  onToggle: () => void;
}

const LocationSharingCard = ({ isSharing, onToggle }: LocationSharingCardProps) => {
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
            onCheckedChange={onToggle} 
            className={isSharing ? "bg-green-500" : ""} 
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
