
import React from "react";
import { Container } from "@/components/ui/container";
import { Heading } from "@/components/ui/heading";
import LocationSharingCard from "@/components/LocationSharingCard";
import TrustedContactsList from "@/components/TrustedContactsList";
import RouteSharing from "@/components/RouteSharing";
import SOSButton from "@/components/SOSButton";

const Index = () => {
  return (
    <Container className="py-8">
      <Heading className="text-center mb-8">Saheli Safe Journey Share</Heading>
      
      <SOSButton />
      
      <LocationSharingCard />
      <RouteSharing />
      <TrustedContactsList />
    </Container>
  );
};

export default Index;
