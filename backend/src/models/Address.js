import mongoose from 'mongoose'
const addressSchema = new mongoose.Schema(
  {
    house: {
      type: String,
      required: true,
    },
    apartment: {
      type: String,
      required: true,
    },
    addressType: {
      type: String,
      enum: ['Home', 'Work', 'Friends', 'Other'],
      required: true,
    },
    isFavorite: {
      type: Boolean,
      default: false, // New field for marking saved addresses
    },
  },
  { timestamps: true }
);

const recentSearchSchema = new mongoose.Schema(
  {
    address: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

export const Address = mongoose.model('Address', addressSchema);
export const RecentSearch = mongoose.model('RecentSearch', recentSearchSchema);
