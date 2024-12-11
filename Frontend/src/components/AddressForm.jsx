import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { addSavedAddress } from '../redux/locationSlice';
import axios from 'axios';
import { Home, Briefcase, Users, MapPin, Heart } from 'lucide-react';

const AddressForm = () => {
  const [house, setHouse] = useState('');
  const [apartment, setApartment] = useState('');
  const [addressType, setAddressType] = useState('');
  const [isFavorite, setIsFavorite] = useState(false);
  const [errors, setErrors] = useState({});
  const dispatch = useDispatch();

  const validate = () => {
    const errors = {};
    if (!house.trim()) errors.house = 'House/Flat/Block number is required.';
    if (!apartment.trim()) errors.apartment = 'Apartment/Road/Area is required.';
    if (!addressType) errors.addressType = 'Please select an address type.';
    setErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    try {
      const newAddress = { house, apartment, addressType, isFavorite };
      const response = await axios.post('http://localhost:5000/api/addresses', newAddress);
      // console.log(response.data)
      dispatch(addSavedAddress(response.data.data));
      setHouse('');
      setApartment('');
      setAddressType('');
      setIsFavorite(false);
    } catch (error) {
      console.error('Error adding address:', error);
    }
  };
  return (
    <form onSubmit={handleSubmit} className="bg-white p-6 shadow-md rounded-md space-y-6">
      {/* House/Flat/Block No. */}
      <div>
        <label className="block text-gray-700 font-semibold mb-2">
          HOUSE / FLAT / BLOCK NO.
        </label>
        <input
          type="text"
          value={house}
          onChange={(e) => setHouse(e.target.value)}
          placeholder="Enter house/flat/block number"
          className={`border p-3 w-full rounded-md ${errors.house ? 'border-red-500' : 'border-gray-300'}`}
          required
        />
        {errors.house && <p className="text-red-500 text-sm mt-1">{errors.house}</p>}
      </div>

      {/* Apartment/Road/Area */}
      <div>
        <label className="block text-gray-700 font-semibold mb-2">
          APARTMENT / ROAD / AREA
        </label>
        <input
          type="text"
          value={apartment}
          onChange={(e) => setApartment(e.target.value)}
          placeholder="Enter apartment/road/area"
          className={`border p-3 w-full rounded-md ${errors.apartment ? 'border-red-500' : 'border-gray-300'}`}
          required
        />
        {errors.apartment && <p className="text-red-500 text-sm mt-1">{errors.apartment}</p>}
      </div>

      {/* Save As */}
      <div>
        <label className="block text-gray-700 font-semibold mb-2">SAVE AS</label>
        <div className="flex items-center gap-4">
          <button
            type="button"
            className={`flex items-center justify-center w-12 h-12 border ${
              addressType === 'Home' ? 'bg-gray-200' : ''
            } rounded-full`}
            onClick={() => setAddressType('Home')}
          >
            <Home className="text-gray-700" />
          </button>
          <button
            type="button"
            className={`flex items-center justify-center w-12 h-12 border ${
              addressType === 'Work' ? 'bg-gray-200' : ''
            } rounded-full`}
            onClick={() => setAddressType('Work')}
          >
            <Briefcase className="text-gray-700" />
          </button>
          <button
            type="button"
            className={`flex items-center justify-center w-12 h-12 border ${
              addressType === 'Friends' ? 'bg-gray-200' : ''
            } rounded-full`}
            onClick={() => setAddressType('Friends')}
          >
            <Users className="text-gray-700" />
          </button>
          <button
            type="button"
            className={`flex items-center justify-center w-12 h-12 border ${
              addressType === 'Other' ? 'bg-gray-200' : ''
            } rounded-full`}
            onClick={() => setAddressType('Other')}
          >
            <MapPin className="text-gray-700" />
          </button>
        </div>
        {errors.addressType && <p className="text-red-500 text-sm mt-1">{errors.addressType}</p>}
      </div>

      {/* Favorite Toggle */}
      <div>
        <label className="block text-gray-700 font-semibold mb-2">MARK AS FAVORITE</label>
        <Heart
          className={`cursor-pointer text-2xl ${
            isFavorite ? 'text-red-500' : 'text-gray-400'
          }`}
          onClick={() => setIsFavorite((prev) => !prev)}
        />
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        className="bg-blue-500 text-white px-4 py-2 rounded-md w-full font-semibold"
      >
        Save Address
      </button>
    </form>
  );
};

export default AddressForm;
