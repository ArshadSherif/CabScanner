// components/RouteInfo.tsx
import React from "react";

interface RouteInfoProps {
  distance: string | null;
  duration: string | null;
}

const RouteInfo: React.FC<RouteInfoProps> = ({ distance, duration }) => {
  if (!distance || !duration) return null;

  return (
    <p className="mb-4">
      Distance: {distance}, Estimated Duration: {duration}
    </p>
  );
};

export default RouteInfo;
