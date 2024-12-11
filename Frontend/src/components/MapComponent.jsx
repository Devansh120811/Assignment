import React, { useState, useEffect } from "react";
import Map, { Marker, NavigationControl } from "react-map-gl";
import { LocateFixed } from "lucide-react";
import "mapbox-gl/dist/mapbox-gl.css";

const MapComponent = ({ location, onMarkerDragEnd, mapRef, isDeliveryLocationSet }) => {
  const [viewState, setViewState] = useState({
    longitude: location.lng,
    latitude: location.lat,
    zoom: 12,
  });

  useEffect(() => {
    setViewState({
      longitude: location.lng,
      latitude: location.lat,
      zoom: 12,
    });
  }, [location]);

  const handleMove = (evt) => {
    setViewState(evt.viewState);
  };

  const handleLocateMe = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          const newLocation = { lat: latitude, lng: longitude };

          setViewState({
            longitude: newLocation.lng,
            latitude: newLocation.lat,
            zoom: 12,
          });

          if (mapRef && mapRef.current) {
            mapRef.current.setCenter([newLocation.lng, newLocation.lat]);
            mapRef.current.setZoom(12);
          }

          onMarkerDragEnd(newLocation);
        },
        (error) => {
          console.error("Error fetching location:", error);
          alert("Unable to fetch your location. Please allow location access.");
        }
      );
    } else {
      alert("Geolocation is not supported by this browser.");
    }
  };

  return (
    <div className="relative">
      <Map
        ref={mapRef}
        {...viewState}
        mapboxAccessToken={`${import.meta.env.VITE_MAPBOX_ACCESS_TOKEN}`}
        style={{ width: "100%", height: "400px" }}
        mapStyle="mapbox://styles/mapbox/streets-v11"
        onMove={handleMove}
      >
        <NavigationControl position="top-right" />
        <Marker
          longitude={viewState.longitude}
          latitude={viewState.latitude}
          draggable={isDeliveryLocationSet}
          onDragEnd={(event) => {
            const { lng, lat } = event.lngLat;
            const newLocation = { lng, lat };
            setViewState({
              ...viewState,
              longitude: lng,
              latitude: lat,
            });
            onMarkerDragEnd(newLocation); // Notify parent about updated location
          }}
        />
      </Map>

      {isDeliveryLocationSet && (
        <button
          onClick={handleLocateMe}
          className="absolute bottom-4 left-[380px] flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-md shadow-lg hover:bg-blue-700"
        >
          <LocateFixed size={20} />
          <span>Locate Me</span>
        </button>
      )}
    </div>
  );
};

export default MapComponent;
