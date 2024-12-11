import React,{useState} from 'react';
import { Provider } from 'react-redux';
import store from './redux/store.js'; // Import Redux store
import LocationModal from './components/LocationModal.jsx';
import MapComponent from './components/MapComponent.jsx';
import AddressForm from './components/AddressForm.jsx';
import AddressList from './components/AddressList.jsx';
import { useSelector, useDispatch } from 'react-redux';
import { setLocation } from './redux/locationSlice.js';

const App = () => {
  const location = useSelector((state) => state.location.userLocation) || { lat: 37.7749, lng: -122.4194 };
  const dispatch = useDispatch();
  const [isDeliveryLocationSet, setIsDeliveryLocationSet] = useState(false);

  // const [location, setLocation] = useState({ lat: 0, lng: 0 });
  const handleMarkerDragEnd = (newLocation) => {
    dispatch(setLocation(newLocation)); // Update the location in Redux store
    console.log('New Location:', newLocation);
  };
  
  return (
    <Provider store={store}>
      <div className="min-h-screen bg-gray-100 flex flex-col items-center p-4 gap-5">
        
        {/* Header Section */}
        <header className="w-full text-center py-4 bg-blue-600 text-white text-2xl font-bold">
          Location/Address Flow
        </header>

        {/* Modal to request location permissions */}
        <LocationModal 
          onEnableLocation={() => console.log('Enable Location Clicked')} 
          onSearchManually={() => console.log('Search Manually Clicked')} 
          onDeliveryLocationSet={setIsDeliveryLocationSet}
        />

        {/* Map section to display and adjust the user's location */}
        <div className="w-full max-w-4xl mt-8">
          <h2 className="text-xl font-bold mb-4">Select Location</h2>
          <MapComponent 
            location={location} 
            onMarkerDragEnd={handleMarkerDragEnd} 
            isDeliveryLocationSet={isDeliveryLocationSet}
          />
        </div>

        {/* Address Form to add new addresses */}
        <div className="w-full max-w-md mt-8">
          <h2 className="text-xl font-bold mb-4">Add New Address</h2>
          <AddressForm onSave={() => console.log('Address Saved')} />
        </div>

        {/* Address List to view and manage saved addresses */}
        <div className="w-full max-w-4xl mt-8">
          <AddressList/>
        </div>

      </div>
    </Provider>
  );
};

export default App;
