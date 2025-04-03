
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Shield, MapPin, Clock, Users, Bell, Phone } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import LocationSharingCard from "@/components/LocationSharingCard";
import TrustedContactsList from "@/components/TrustedContactsList";

const Index = () => {
  const { toast } = useToast();
  const [isSharing, setIsSharing] = useState(false);

  const handleSOSClick = () => {
    toast({
      title: "SOS Alert Sent",
      description: "Your trusted contacts have been notified of your emergency",
      variant: "destructive",
    });
  };

  const handleToggleSharing = () => {
    setIsSharing(!isSharing);
    toast({
      title: isSharing ? "Location Sharing Stopped" : "Location Sharing Started",
      description: isSharing 
        ? "Your location is no longer being shared" 
        : "Your location is now being shared with your trusted contacts",
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-pink-50 to-purple-50 p-4">
      <div className="container mx-auto max-w-md">
        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold text-purple-800">Satark Saheli</h1>
          <p className="text-gray-600">Keep your loved ones informed. Stay safe.</p>
        </div>

        {/* SOS Button */}
        <Button 
          variant="destructive" 
          className="w-full py-8 mb-6 text-xl rounded-full animate-pulse"
          onClick={handleSOSClick}
        >
          <Phone className="mr-2 h-6 w-6" /> EMERGENCY SOS
        </Button>

        {/* Location Sharing Card */}
        <LocationSharingCard isSharing={isSharing} onToggle={handleToggleSharing} />

        {/* Features Grid */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <Card className="hover:shadow-md transition-shadow">
            <CardContent className="p-4 text-center">
              <MapPin className="h-8 w-8 mx-auto text-purple-600 mb-2" />
              <h3 className="font-semibold">Route Sharing</h3>
            </CardContent>
          </Card>

          <Card className="hover:shadow-md transition-shadow">
            <CardContent className="p-4 text-center">
              <Users className="h-8 w-8 mx-auto text-purple-600 mb-2" />
              <h3 className="font-semibold">Trusted Contacts</h3>
            </CardContent>
          </Card>

          <Card className="hover:shadow-md transition-shadow">
            <CardContent className="p-4 text-center">
              <Clock className="h-8 w-8 mx-auto text-purple-600 mb-2" />
              <h3 className="font-semibold">Auto Updates</h3>
            </CardContent>
          </Card>

          <Card className="hover:shadow-md transition-shadow">
            <CardContent className="p-4 text-center">
              <Bell className="h-8 w-8 mx-auto text-purple-600 mb-2" />
              <h3 className="font-semibold">Notifications</h3>
            </CardContent>
          </Card>
        </div>

        {/* Trusted Contacts List */}
        <TrustedContactsList />
      </div>
    </div>
  );
};

export default Index;
