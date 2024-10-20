import React, { useState } from "react";
import { FaCar, FaMotorcycle, FaTaxi, FaBusAlt } from "react-icons/fa"; // Added icons for different vehicles

interface VehicleData {
  ola: {
    eta: string;
    name: string;
    price: string;
  };
  uber: {
    eta: string;
    name: string;
    price: string;
  };
}

interface VehicleSelectorProps {
  data: {
    auto: VehicleData;
    bike: VehicleData;
    mini: VehicleData;
    sedan: VehicleData;
    suv: VehicleData;
  };
}

const VehicleSelector: React.FC<VehicleSelectorProps> = ({ data }) => {
  const [selectedVehicle, setSelectedVehicle] = useState<string>("");

  const handleVehicleClick = (vehicle: string) => {
    setSelectedVehicle(vehicle);
  };

  const renderDetails = () => {
    if (!selectedVehicle) return <p className="text-gray-500">Select a vehicle type to see details.</p>;

    const vehicleData = data[selectedVehicle as keyof typeof data];
    return (
      <div className="vehicle-details mt-4 p-4 bg-gray-100 rounded-lg shadow">
        <div className="flex flex-col space-y-4">
          {/* Ola Details */}
          <div>
            <h4 className="text-lg font-semibold">Ola - {vehicleData.ola.name}</h4>
            <p>ETA: {vehicleData.ola.eta || "N/A"}</p>
            <p>Price: {vehicleData.ola.price || "N/A"}</p>
          </div>

          {/* Uber Details */}
          <div>
            <h4 className="text-lg font-semibold">Uber - {vehicleData.uber.name}</h4>
            <p>ETA: {vehicleData.uber.eta || "N/A"}</p>
            <p>Price: {vehicleData.uber.price || "N/A"}</p>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="vehicle-selector">
      <h3 className="text-xl font-bold mb-4">Select a Vehicle Type</h3>
      <div className="flex space-x-4 mb-6">
        {/* Vehicle buttons */}
        <button
          className={`p-4 rounded-lg shadow hover:bg-blue-100 transition ${
            selectedVehicle === "auto" ? "bg-blue-200" : "bg-white"
          }`}
          onClick={() => handleVehicleClick("auto")}
        >
          <FaTaxi className="text-2xl mb-1" />
          <span className="text-sm">Auto</span>
        </button>
        <button
          className={`p-4 rounded-lg shadow hover:bg-blue-100 transition ${
            selectedVehicle === "bike" ? "bg-blue-200" : "bg-white"
          }`}
          onClick={() => handleVehicleClick("bike")}
        >
          <FaMotorcycle className="text-2xl mb-1" />
          <span className="text-sm">Bike</span>
        </button>
        <button
          className={`p-4 rounded-lg shadow hover:bg-blue-100 transition ${
            selectedVehicle === "mini" ? "bg-blue-200" : "bg-white"
          }`}
          onClick={() => handleVehicleClick("mini")}
        >
          <FaCar className="text-2xl mb-1" />
          <span className="text-sm">Mini</span>
        </button>
        <button
          className={`p-4 rounded-lg shadow hover:bg-blue-100 transition ${
            selectedVehicle === "sedan" ? "bg-blue-200" : "bg-white"
          }`}
          onClick={() => handleVehicleClick("sedan")}
        >
          <FaCar className="text-2xl mb-1" />
          <span className="text-sm">Sedan</span>
        </button>
        <button
          className={`p-4 rounded-lg shadow hover:bg-blue-100 transition ${
            selectedVehicle === "suv" ? "bg-blue-200" : "bg-white"
          }`}
          onClick={() => handleVehicleClick("suv")}
        >
          <FaBusAlt className="text-2xl mb-1" />
          <span className="text-sm">SUV</span>
        </button>
      </div>

      {/* Vehicle Details */}
      {renderDetails()}
    </div>
  );
};

export default VehicleSelector;
