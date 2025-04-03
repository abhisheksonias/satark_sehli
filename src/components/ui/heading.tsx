
import React from "react";
import { cn } from "@/lib/utils";

interface HeadingProps extends React.HTMLAttributes<HTMLHeadingElement> {}

export const Heading = React.forwardRef<HTMLHeadingElement, HeadingProps>(
  ({ className, ...props }, ref) => (
    <h1
      ref={ref}
      className={cn("text-3xl font-bold text-purple-900", className)}
      {...props}
    />
  )
);

Heading.displayName = "Heading";
