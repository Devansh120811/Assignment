import { createSlice } from '@reduxjs/toolkit';


const initialState = {
  userLocation: null,
  selectedAddress: null,
  savedAddresses: [],
  recentSearches: [],
  loading: false,
  error: null,
};

const locationSlice = createSlice({
  name: 'location',
  initialState,
  reducers: {
    setLocation: (state, action) => {
      state.userLocation = action.payload;
    },
    setSelectedAddress: (state, action) => {
      state.selectedAddress = action.payload;
    },
    setSavedAddresses: (state, action) => {
      state.savedAddresses = action.payload;
    },
    addSavedAddress: (state, action) => {
      state.savedAddresses.push(action.payload);
    },
    removeSavedAddress: (state, action) => {
      state.savedAddresses = state.savedAddresses.filter((addr) => addr._id !== action.payload);
    },
    updateFavoriteStatus: (state, action) => {
      const updatedAddress = action.payload;
      const index = state.savedAddresses.findIndex((addr) => addr._id === updatedAddress._id);
      if (index !== -1) {
        state.savedAddresses[index] = updatedAddress;
      }
    },
    setRecentSearches: (state, action) => {
      state.recentSearches = action.payload;
    },
  },
});


// Export reducers so you can dispatch them in your components
export const { setLocation, setSelectedAddress, setSavedAddresses,addSavedAddress,removeSavedAddress,updateFavoriteStatus,setRecentSearches } = locationSlice.actions;

export default locationSlice.reducer;
