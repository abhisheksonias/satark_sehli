
import React from "react";
import { Container } from "@/components/ui/container";
import { Heading } from "@/components/ui/heading";
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { signOut } from "@/services/authService";
import LocationSharingCard from "@/components/LocationSharingCard";
import TrustedContactsList from "@/components/TrustedContactsList";
import RouteSharing from "@/components/RouteSharing";
import SOSButton from "@/components/SOSButton";

const Index = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleLogout = async () => {
    try {
      await signOut();
      toast({
        title: "Logged out successfully",
        description: "You have been signed out of your account.",
      });
      navigate("/login");
    } catch (error: any) {
      toast({
        title: "Logout failed",
        description: error.message || "An error occurred while logging out.",
        variant: "destructive",
      });
    }
  };

  return (
    <Container className="py-8">
      <div className="flex justify-between items-center mb-8">
        <Heading>Saheli Safe Journey Share</Heading>
        <Button variant="outline" size="sm" onClick={handleLogout}>
          <LogOut className="h-4 w-4 mr-2" />
          Logout
        </Button>
      </div>
      
      <SOSButton />
      
      <LocationSharingCard />
      <RouteSharing />
      <TrustedContactsList />
    </Container>
  );
};

export default Index;
