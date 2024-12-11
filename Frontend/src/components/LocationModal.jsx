import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { setLocation, setRecentSearches } from "../redux/locationSlice";
import axios from "axios";

const LocationModal = ({ onDeliveryLocationSet, mapRef }) => {
  const dispatch = useDispatch();
  const [manualLocation, setManualLocation] = useState("");
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [isModalVisible, setModalVisible] = useState(false);

  const handleEnableLocation = () => {
    if (confirm("Know Your Location")) {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const newLocation = {
              lat: position.coords.latitude,
              lng: position.coords.longitude,
            };
            updateLocation(newLocation);
          },
          (error) => {
            console.error("Error getting location:", error);
            alert("Location permission denied or unavailable.");
          }
        );
      } else {
        alert("Geolocation is not supported by this browser.");
      }
    } else {
      alert("I do not want to share location.");
    }
  };

  const handleManualSearch = async () => {
    if (manualLocation.trim() === "") return alert("Please enter a valid address");
  
    try {
      const accessToken = import.meta.env.VITE_MAPBOX_ACCESS_TOKEN;
      const response = await axios.get(
        `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(manualLocation)}.json`,
        {
          params: {
            access_token: accessToken,
            limit: 1,
          },
        }
      );
  
      const { center, place_name } = response.data.features[0] || {};
      if (!center) {
        alert("Location not found. Please try again.");
        return;
      }
      
      const coordinates = { lng: center[0], lat: center[1] };
      updateLocation({ ...coordinates, address: place_name });
    } catch (error) {
      console.error("Error fetching geocode:", error);
      alert("Unable to locate the address. Please try again.");
    }
  };
  
  const updateLocation = async (location) => {
    try {
      // Ensure we have valid coordinates before making a backend call
      if (!location.lat || !location.lng) {
        alert("Invalid location coordinates. Please try again.");
        return;
      }
      const address = `${location.lat} ${location.lng}`
      const locationData = {
        address: address,  // Full address received from geocoding API
      };
  
      // Send the location data to the backend only if it's valid
       await axios.post("http://localhost:5000/api/addresses/recent-Address", locationData);
       
       // Update Redux and selected location
       dispatch(setLocation(location));
      setSelectedLocation(location);
  
      // Update the map view
      if (mapRef && mapRef.current) {
        mapRef.current.setCenter([location.lng, location.lat]);
        mapRef.current.setZoom(12);
      }
  
      onDeliveryLocationSet(true);
      setManualLocation("");
      setModalVisible(false);
    } catch (error) {
      console.error("Error updating location:", error);
      alert("Error while saving the location. Please try again.");
    }
  };
  
  const handleChangeLocation = () => {
    setModalVisible(true);
    setSelectedLocation(null);
  };

  return (
    <div className="p-4 flex flex-col">
      {selectedLocation ? (
        <div className="border border-gray-300 rounded-lg p-4 flex items-center justify-between gap-5">
          <div>
            <p className="font-bold text-lg">{selectedLocation.address || "Selected Location"}</p>
            <p className="text-sm text-gray-500">
              Lat: {selectedLocation.lat}, Lng: {selectedLocation.lng}
            </p>
          </div>
          <button
            onClick={handleChangeLocation}
            className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600"
          >
            Change
          </button>
        </div>
      ) : (
        <button
          onClick={() => setModalVisible(true)}
          className="bg-blue-500 text-white px-6 py-3 rounded-md hover:bg-blue-600"
        >
          Select Your Delivery Location
        </button>
      )}
      {isModalVisible && (
        <div className=" top-0 left-0 w-full h-full bg-gray-900 bg-opacity-50 flex items-center justify-center mt-6">
          <div className="bg-white p-6 w-96">
            <button
              onClick={handleEnableLocation}
              className="bg-green-500 text-white w-full py-2 rounded-md mb-4 hover:bg-green-600"
            >
              Enable Current Location
            </button>
            <div className="flex gap-2">
              <input
                type="text"
                value={manualLocation}
                onChange={(e) => setManualLocation(e.target.value)}
                placeholder="Enter address manually"
                className="border border-gray-300 rounded-md flex-grow px-4 py-2"
              />
              <button
                onClick={handleManualSearch}
                className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
              >
                Search
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LocationModal;
