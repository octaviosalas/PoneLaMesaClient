import express from 'express';
const collectionsRoutes = express.Router();
import { addNewCollection, getAllCollections, getCollectionByOrderId, deleteCollection, deleteCollectionReplacement, updateCollectionAmount, updateCollectionDownPaymentAmount, updateCollectionReplacementAmount } from '../controllers/collections.controllers.js';

collectionsRoutes.post('/addNewCollection', addNewCollection);
collectionsRoutes.get('/', getAllCollections);
collectionsRoutes.get('/getByOrderId/:orderId', getCollectionByOrderId);
collectionsRoutes.delete('/deleteCollection/:collectionId', deleteCollection);
collectionsRoutes.delete('/deleteCollectionReplacement/:collectionId', deleteCollectionReplacement);
collectionsRoutes.put('/changeAmount/:collectionId', updateCollectionAmount);
collectionsRoutes.put('/changeAmountDownPayment/:collectionId', updateCollectionDownPaymentAmount);
collectionsRoutes.put('/changeAmountReplacement/:collectionId', updateCollectionReplacementAmount);


export default collectionsRoutes;