import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  setSavedAddresses,
  removeSavedAddress,
  updateFavoriteStatus,
  setRecentSearches,
} from "../redux/locationSlice";
import axios from "axios";
import { Heart, Pin } from "lucide-react"; // Import Pin icon

const AddressList = () => {
  const { savedAddresses, recentSearches } = useSelector((state) => state.location);
  // console.log(recentSearches);
  // const [getSavedAddress,setgetSavedAddress] = useState(false);
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchAddresses = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/addresses");
        // console.log(response.data)
        if (Array.isArray(response.data.savedAddresses)) {
          
          dispatch(setSavedAddresses(response.data.savedAddresses));
        }
        else{
          console.error("RecentSearch is not an array:", response1.data.RecentSearch);
        }
      } catch (error) {
        console.error("Error fetching addresses:", error);
      }
    };

    fetchAddresses();
  }, []);
  useEffect(()=>{
    const getRecentSearch = async ()=>{

    try {
        const response1 = await axios.get("http://localhost:5000/api/recent-search");
        // console.log(response1.data)
        if (Array.isArray(response1.data.RecentSearch)) {
          dispatch(setRecentSearches(response1.data.RecentSearch));
        } else {
          console.error("RecentSearch is not an array:", response1.data.RecentSearch);
        }
    } catch (error) {
      console.error("Error fetching addresses:", error);
    }
    }
    getRecentSearch()
  },[recentSearches])

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/addresses/${id}`);
      dispatch(removeSavedAddress(id));
    } catch (error) {
      console.error("Error deleting address:", error);
    }
  };

  const handleFavoriteToggle = async (id) => {
    try {
      const response = await axios.patch(
        `http://localhost:5000/api/addresses/${id}/favorite`
      );
      dispatch(updateFavoriteStatus(response.data));
    } catch (error) {
      console.error("Error toggling favorite:", error);
    }
  };

  return (
    <div className="bg-white p-4 shadow-md rounded-md space-y-6">
      <div>
        <h3 className="text-lg font-bold mb-2">Saved Locations</h3>
        <ul>
          {savedAddresses.map((address) => (
            <li
              key={address._id}
              className="flex justify-between items-center mb-2"
            >
              <span>
                {address.house && address.apartment
                  ? `${address.house}, ${address.apartment}`
                  : "Address details unavailable"}
              </span>
              <div className="flex items-center gap-2">
                <Heart
                  className={`cursor-pointer ${
                    address.isFavorite ? "text-red-500" : "text-gray-400"
                  }`}
                  onClick={() => handleFavoriteToggle(address._id)}
                />
                <button
                  onClick={() => handleDelete(address._id)}
                  className="text-red-500"
                >
                  Delete
                </button>
              </div>
            </li>
          ))}
        </ul>
      </div>

      <div>
        <h3 className="text-lg font-bold mb-2">Recent Searches</h3>
        <ul>
          {Array.isArray(recentSearches) && recentSearches.length > 0 ? (
            recentSearches.map((search) => (
              <li key={search._id} className="flex items-center text-gray-700 gap-2">
                <Pin className="text-gray-400" />
                <span>{search.address}</span>
              </li>
            ))
          ) : (
            <li>No recent searches available</li>
          )}
        </ul>
      </div>
    </div>
  );
};

export default AddressList;
