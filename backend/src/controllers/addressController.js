import { Address } from '../models/Address.js';
import { RecentSearch } from '../models/Address.js';

const addAddress = async (req, res) => {
  const { house, apartment, addressType, isFavorite } = req.body;

  if (!house || !apartment || !addressType) {
    return res.status(400).json({ error: 'All fields are required.' });
  }
  console.log(house, apartment, addressType, isFavorite);
  try {
    const newAddress = new Address({ house, apartment, addressType, isFavorite });
    await newAddress.save();
    res.status(201).json({data:newAddress});
  } catch (error) {
    console.error('Error adding address:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

const getAddresses = async (req, res) => {
  try {
    const addresses = await Address.find();
    const recentSearches = await RecentSearch.find().sort({ createdAt: -1 }).limit(5);
    res.status(200).json({ savedAddresses: addresses, recentSearches });
  } catch (error) {
    console.error('Error fetching addresses:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

const saveRecentSearch = async (req, res) => {
  const { address } = req.body;

  console.log(address)
  if (!address) {
    return res.status(400).json({ error: 'Address is required.' });
  }
  try {
    const newSearch = new RecentSearch({ address });
    await newSearch.save();
    res.status(201).json(newSearch);
  } catch (error) {
    console.error('Error saving recent search:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

const deleteAddress = async (req, res) => {
  try {
    await Address.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: 'Address deleted' });
  } catch (error) {
    console.error('Error deleting address:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

const toggleFavorite = async (req, res) => {
  try {
    const address = await Address.findById(req.params.id);
    if (!address) {
      return res.status(404).json({ error: 'Address not found' });
    }
    address.isFavorite = !address.isFavorite;
    await address.save();
    res.status(200).json(address);
  } catch (error) {
    console.error('Error toggling favorite:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

const getRecentSearches = async (req, res) => {
  try {
    const recentSearches = await RecentSearch.find().sort({ createdAt: -1 }).limit(5);
    res.status(200).json({RecentSearch:recentSearches});
  } catch (error) {
    console.error('Error fetching recent searches:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

export { addAddress, getAddresses, saveRecentSearch, deleteAddress, toggleFavorite, getRecentSearches };
