
import React from "react";
import { Button } from "@/components/ui/button";
import { Shield } from "lucide-react";
import { Link } from "react-router-dom";

const NotFound = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-pink-50 to-purple-50 p-4">
      <Shield className="h-16 w-16 text-purple-800 mb-4" />
      <h1 className="text-4xl font-bold text-purple-800 mb-2">404</h1>
      <p className="text-xl text-gray-700 mb-6">Page not found</p>
      <Button asChild>
        <Link to="/">Go Back Home</Link>
      </Button>
    </div>
  );
};

export default NotFound;
