import { configureStore } from '@reduxjs/toolkit';
import locationReducer from './locationSlice'; // Import location reducer

const store = configureStore({
  reducer: {
    location: locationReducer, // Register the location slice in the store
  },
});

export default store;
