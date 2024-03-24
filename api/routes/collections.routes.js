import express from 'express';
const collectionsRoutes = express.Router();
import { addNewCollection, getAllCollections, getCollectionByOrderId, deleteCollection } from '../controllers/collections.controllers.js';

collectionsRoutes.post('/addNewCollection', addNewCollection);
collectionsRoutes.get('/', getAllCollections);
collectionsRoutes.get('/getByOrderId/:orderId', getCollectionByOrderId);
collectionsRoutes.delete('/deleteCollection/:collectionId', deleteCollection);
collectionsRoutes.delete('/deleteCollectionReplacement/:collectionId', deleteCollection);

export default collectionsRoutes;