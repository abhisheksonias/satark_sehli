import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { AlertTriangle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { sendSOSMessage } from "@/services/smsService";

const SOSButton = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSOS = async () => {
    setIsLoading(true);
    try {
      await sendSOSMessage();
      toast({
        title: "SOS Sent",
        description: "Emergency message has been sent to your trusted contacts.",
      });
    } catch (error: any) {
      console.error("Error sending SOS:", error);
      toast({
        title: "Error",
        description: "Failed to send SOS message. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button
      onClick={handleSOS}
      disabled={isLoading}
      className="w-full bg-red-500 hover:bg-red-600 text-white mb-5"
    >
      <AlertTriangle className="mr-2 h-4 w-4" />
      {isLoading ? "Sending SOS..." : "SOS EMERGENCY"}
    </Button>
  );
};

export default SOSButton;
