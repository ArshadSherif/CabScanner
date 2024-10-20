/* eslint-disable @typescript-eslint/no-unused-vars */
// pages/index.tsx

"use client";

import React, { useState } from "react";
import Drawer, { Root, Portal, Overlay, Content } from "vaul";
import Form from "./components/Form";
import Map from "./components/Map";
import RouteInfo from "./components/RouteInfo";
import { Loader } from "@googlemaps/js-api-loader";
import VehicleSelector from "./components/VechicleSelector";
import axios from "axios";


// Replace with your actual API key or use environment variables
const GOOGLE_MAPS_API_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "";

const MainPage: React.FC = () => {
  const [pickup, setPickup] = useState("");
  const [dropoff, setDropoff] = useState("");
  const [distance, setDistance] = useState<string | null>(null);
  const [duration, setDuration] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [route, setRoute] = useState<google.maps.DirectionsResult | null>(null);
  const [snap, setSnap] = useState<number>(0.2);
  const [isGoogleMapsLoaded, setIsGoogleMapsLoaded] = useState(false);
  const [showVehicles, setShowVehicles] = useState(false);
  const [dummyData,setDummyData] = useState([])

  // Initialize Google Maps API loader
  React.useEffect(() => {
    const loader = new Loader({
      apiKey: GOOGLE_MAPS_API_KEY,
      version: "weekly",
      libraries: ["places"],
    });

    loader
      .load()
      .then(() => {
        setIsGoogleMapsLoaded(true);
      })
      .catch((error) => {
        console.error("Error loading Google Maps API:", error);
        alert("Failed to load Google Maps. Please try again later.");
      });
  }, []);

  const handleSelect = (address: string, type: "pickup" | "dropoff") => {
    if (type === "pickup") setPickup(address);
    if (type === "dropoff") setDropoff(address);
  };

  const handleUseCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          const latLng = { lat: latitude, lng: longitude };

          // Use geocode to get the address from latLng
          const geocoder = new google.maps.Geocoder();
          geocoder.geocode({ location: latLng }, (results, status) => {
            if (status === "OK" && results[0]) {
              const address = results[0].formatted_address;
              setPickup(address);
            } else {
              console.error("Geocoder failed due to:", status);
              alert("Unable to get address from location.");
            }
          });
        },
        (error) => {
          console.error("Error getting location:", error);
          alert(
            "Unable to get your location. Please ensure location services are enabled."
          );
        }
      );
    } else {
      alert("Geolocation is not supported by your browser.");
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!pickup || !dropoff) {
      alert("Please enter both Pickup and Dropoff locations.");
      return;
    }

    setIsLoading(true);

    const directionsService = new google.maps.DirectionsService();
    directionsService.route(
      {
        origin: pickup,
        destination: dropoff,
        travelMode: google.maps.TravelMode.DRIVING,
      },
      (result, status) => {
        setIsLoading(false);
        if (status === google.maps.DirectionsStatus.OK && result) {
          setRoute(result);
          const leg = result.routes[0].legs[0];
          setDistance(leg.distance?.text || null);
          setDuration(leg.duration?.text || null);
          setShowVehicles(true);

          axios
          .post('/api/proxy', 
            {
              uber_link: 'test_link', // Your Uber link
              ola_link: 'test_link',  // Your Ola link
            },
            {
              headers: {
                'Content-Type': 'application/json', // Set content type to JSON
              },
            }
          )
          .then((response) => {
            console.log('API Response:', response.data);
            setDummyData(response.data)
          })
          .catch((error) => {
            console.error('Error making API call:', error);
          });




        } else {
          console.error("Directions request failed:", status);
          alert(
            "Unable to find a route between the specified locations. Please check your input and try again."
          );
        }
      }
    );
  };

  return (
    <div className="h-screen w-full relative">
      {/* Conditionally render the Map component only after the API has loaded */}
      {isGoogleMapsLoaded ? (
        <Map route={route} />
      ) : (
        <div className="flex items-center justify-center h-full">
          <p>Loading map...</p>
        </div>
      )}

      <Root
        snapPoints={[0.2, 0.5, 0.8]}
        activeSnapPoint={snap}
        setActiveSnapPoint={(snapPoint) => setSnap(snapPoint as number)}
        dismissible={false}
        defaultOpen={true}
      >
        <Portal>
          <Overlay className="fixed inset-0 bg-black/40" />
          <Content className="bg-white flex flex-col rounded-t-[10px] h-[calc(100vh-96px)] mt-24 fixed bottom-0 left-0 right-0 overflow-y-auto">
            <div className="p-4 bg-white rounded-t-[10px] flex-1 overflow-auto">
              <div className="mx-auto w-12 h-1.5 flex-shrink-0 rounded-full bg-zinc-300 mb-8" />
              <div className="max-w-md mx-auto">
                <h2 className="text-2xl font-bold mb-4">
                  Uber Deep Link Generator
                </h2>
                <Form
                  pickup={pickup}
                  setPickup={setPickup}
                  dropoff={dropoff}
                  setDropoff={setDropoff}
                  handleSelect={handleSelect}
                  handleUseCurrentLocation={handleUseCurrentLocation}
                  handleSubmit={handleSubmit}
                  isLoading={isLoading}
                  isGoogleMapsLoaded={isGoogleMapsLoaded}
                />
                <RouteInfo distance={distance} duration={duration} />
                {showVehicles && <VehicleSelector data={dummyData} />}
              </div>
            </div>
          </Content>
        </Portal>
      </Root>
    </div>
  );
};

export default MainPage;
