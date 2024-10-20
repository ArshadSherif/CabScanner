// components/Form.tsx
import React from "react";
import PlacesAutocomplete from "react-places-autocomplete";

interface FormProps {
  pickup: string;
  setPickup: (pickup: string) => void;
  dropoff: string;
  setDropoff: (dropoff: string) => void;
  handleSelect: (address: string, type: "pickup" | "dropoff") => void;
  handleUseCurrentLocation: () => void;
  handleSubmit: (e: React.FormEvent) => void;
  isLoading: boolean;
  isGoogleMapsLoaded: boolean;
}

const Form: React.FC<FormProps> = ({
  pickup,
  setPickup,
  dropoff,
  setDropoff,
  handleSelect,
  handleUseCurrentLocation,
  handleSubmit,
  isLoading,
  isGoogleMapsLoaded,
}) => {
  return (
    <form onSubmit={handleSubmit} className="mb-6 space-y-6">
      {/* Only render PlacesAutocomplete when Google Maps API is fully loaded */}
      {isGoogleMapsLoaded ? (
        <>
          {/* Pickup Location */}
          <div className="relative">
            <label htmlFor="pickup" className="block text-sm font-medium text-gray-700">
              Pickup Location
            </label>
            <PlacesAutocomplete
              value={pickup}
              onChange={setPickup}
              onSelect={(address) => handleSelect(address, "pickup")}
            >
              {({
                getInputProps,
                suggestions,
                getSuggestionItemProps,
                loading,
              }) => (
                <div>
                  <input
                    {...getInputProps({
                      placeholder: "Search Pickup Location...",
                      className:
                        "mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500",
                      onKeyDown: (e: React.KeyboardEvent<HTMLInputElement>) => {
                        if (e.key === "Enter") {
                          e.preventDefault();
                        }
                      },
                    })}
                  />
                  <div className="autocomplete-dropdown absolute bg-white border border-gray-300 w-full z-10">
                    {loading && <div className="p-2">Loading...</div>}
                    {suggestions.map((suggestion) => {
                      const className = suggestion.active
                        ? "suggestion-item--active bg-gray-100"
                        : "suggestion-item bg-white";
                      return (
                        <div
                          {...getSuggestionItemProps(suggestion, {
                            className,
                            style: {
                              cursor: "pointer",
                              padding: "10px",
                            },
                          })}
                          key={suggestion.placeId}
                        >
                          <span>{suggestion.description}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </PlacesAutocomplete>
            <button
              type="button"
              className="mt-3 w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded-lg transition duration-200"
              onClick={handleUseCurrentLocation}
            >
              Use Current Location
            </button>
          </div>

          {/* Dropoff Location */}
          <div className="relative">
            <label htmlFor="dropoff" className="block text-sm font-medium text-gray-700">
              Dropoff Location
            </label>
            <PlacesAutocomplete
              value={dropoff}
              onChange={setDropoff}
              onSelect={(address) => handleSelect(address, "dropoff")}
            >
              {({
                getInputProps,
                suggestions,
                getSuggestionItemProps,
                loading,
              }) => (
                <div>
                  <input
                    {...getInputProps({
                      placeholder: "Search Dropoff Location...",
                      className:
                        "mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500",
                      onKeyDown: (e: React.KeyboardEvent<HTMLInputElement>) => {
                        if (e.key === "Enter") {
                          e.preventDefault();
                        }
                      },
                    })}
                  />
                  <div className="autocomplete-dropdown absolute bg-white border border-gray-300 w-full z-10">
                    {loading && <div className="p-2">Loading...</div>}
                    {suggestions.map((suggestion) => {
                      const className = suggestion.active
                        ? "suggestion-item--active bg-gray-100"
                        : "suggestion-item bg-white";
                      return (
                        <div
                          {...getSuggestionItemProps(suggestion, {
                            className,
                            style: {
                              cursor: "pointer",
                              padding: "10px",
                            },
                          })}
                          key={suggestion.placeId}
                        >
                          <span>{suggestion.description}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </PlacesAutocomplete>
          </div>
        </>
      ) : (
        <div className="text-center text-gray-500">Loading Google Maps...</div>
      )}

      {/* Submit Button */}
      <button
        type="submit"
        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition duration-200"
        disabled={isLoading || !isGoogleMapsLoaded || !pickup || !dropoff}
      >
        {isLoading ? "Loading..." : "Show Route"}
      </button>
    </form>
  );
};

export default Form;
