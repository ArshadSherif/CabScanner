/* eslint-disable react/display-name */
// components/Map.tsx
"use client";

import React, { useEffect, useRef, forwardRef, useImperativeHandle } from "react";

interface MapProps {
  route: google.maps.DirectionsResult | null;
  currentLocation?: google.maps.LatLngLiteral;
}

const Map = forwardRef<HTMLDivElement, MapProps>(({ route, currentLocation }, ref) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstance = useRef<google.maps.Map | null>(null);
  const directionsRenderer = useRef<google.maps.DirectionsRenderer | null>(null);

  // Expose the map div to the parent component
  useImperativeHandle(ref, () => mapRef.current!);

  // Initialize the map once
  useEffect(() => {
    if (!mapRef.current) return;

    if (!mapInstance.current) {
      mapInstance.current = new window.google.maps.Map(mapRef.current, {
        center: { lat: 0, lng: 0 },
        zoom: 2,
        zoomControl: true,           // Enable zoom controls
        mapTypeControl: true,        // Enable map type controls (e.g., Roadmap, Satellite)
        fullscreenControl: true,     // Enable fullscreen control
        streetViewControl: true,     // Enable Street View control
        gestureHandling: "greedy",   // Capture all gestures
        scrollwheel: true,           // Enable scroll wheel zooming
        draggable: true,             // Enable dragging the map
        tilt: 45,                     // Enable tilt for 45-degree perspective
        heading: 90,                  // Set default heading (direction)
        styles: [                     // Optional: Custom map styles for better aesthetics
          {
            featureType: "poi",
            elementType: "labels",
            stylers: [{ visibility: "off" }],
          },
          {
            featureType: "transit",
            elementType: "labels.icon",
            stylers: [{ visibility: "off" }],
          },
        ],
      });

      directionsRenderer.current = new window.google.maps.DirectionsRenderer({
        suppressMarkers: false,       // Show default markers
        preserveViewport: false,      // Adjust viewport to fit the route
      });
      directionsRenderer.current.setMap(mapInstance.current);
    }
  }, []);

  // Update directions when route changes
  useEffect(() => {
    if (route && directionsRenderer.current) {
      directionsRenderer.current.setDirections(route);
      if (route.routes[0].bounds) {
        mapInstance.current!.fitBounds(route.routes[0].bounds);
      }
    }
  }, [route]);

  // Center map on currentLocation when it changes
  useEffect(() => {
    if (currentLocation && mapInstance.current) {
      mapInstance.current.setCenter(currentLocation);
      mapInstance.current.setZoom(14); // Adjust zoom level as needed
    }
  }, [currentLocation]);

  return <div ref={mapRef} className="h-full w-full" tabIndex={0}></div>;
});

export default Map;
