import express from 'express';
import { addAddress, deleteAddress, getAddresses, toggleFavorite,getRecentSearches,saveRecentSearch } from '../controllers/addressController.js';

const router = express.Router();

router.post('/addresses', addAddress);
router.post('/addresses/recent-Address', saveRecentSearch);
router.get('/addresses', getAddresses);
router.get('/recent-search',getRecentSearches)
router.delete('/addresses/:id', deleteAddress);
router.patch('/addresses/:id/favorite', toggleFavorite);

export default router;
