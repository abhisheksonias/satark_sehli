
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { AlertCircle } from "lucide-react";
import { getCurrentLocation } from "@/services/locationService";
import { getTrustedContacts } from "@/services/contactsService";
import { useToast } from "@/hooks/use-toast";

const SOSButton = () => {
  const [isActivated, setIsActivated] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const sendSOSAlert = async () => {
    setIsLoading(true);
    
    try {
      // Get current location
      const position = await getCurrentLocation();
      
      // Get trusted contacts
      const contacts = getTrustedContacts();
      
      if (contacts.length === 0) {
        toast({
          title: "No Trusted Contacts",
          description: "Please add trusted contacts before using the SOS feature.",
          variant: "destructive",
        });
        setIsLoading(false);
        return;
      }

      // In a real app, we would send SMS or notifications to contacts here
      // For this local demo, we'll just show a toast
      
      setIsActivated(true);
      
      toast({
        title: "SOS Alert Activated",
        description: `Emergency alert sent to ${contacts.length} trusted contacts with your current location.`,
        variant: "destructive",
      });
      
      // Simulate sending alerts
      setTimeout(() => {
        setIsActivated(false);
        
        toast({
          title: "Emergency Services Notified",
          description: "Your emergency contacts have been alerted with your location information.",
        });
      }, 3000);
      
    } catch (error) {
      console.error("Error sending SOS alert:", error);
      toast({
        title: "Error",
        description: "Failed to send SOS alert. Please try again or call emergency services directly.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button
      variant="destructive"
      size="lg"
      className={`w-full h-16 text-lg font-bold mb-6 ${
        isActivated 
          ? "animate-pulse bg-red-700 hover:bg-red-800" 
          : "bg-red-600 hover:bg-red-700"
      }`}
      onClick={sendSOSAlert}
      disabled={isLoading}
    >
      <AlertCircle className="mr-2 h-6 w-6" />
      {isActivated ? "SOS ALERT SENT!" : "SOS EMERGENCY"}
    </Button>
  );
};

export default SOSButton;
