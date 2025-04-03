import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { AlertTriangle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { sendSOSMessage } from "@/services/smsService";

const SOSButton = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSOS = async () => {
    try {
      setIsLoading(true);
      await sendSOSMessage();
      toast({
        title: 'SOS Alert Sent',
        description: 'Emergency message has been sent to your trusted contacts.',
        variant: 'default',
      });
    } catch (error: any) {
      console.error('Error sending SOS:', error);
      toast({
        title: 'Error',
        description: error.message || 'Failed to send SOS message. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button
      variant="destructive"
      size="lg"
      className="w-full flex items-center justify-center gap-2"
      onClick={handleSOS}
      disabled={isLoading}
    >
      <AlertTriangle className="h-5 w-5" />
      {isLoading ? 'Sending SOS...' : 'SOS EMERGENCY'}
    </Button>
  );
};

export default SOSButton;
