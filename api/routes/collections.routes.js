import express from 'express';
const collectionsRoutes = express.Router();
import { addNewCollection, getAllCollections, getCollectionByOrderId } from '../controllers/collections.controllers.js';

collectionsRoutes.post('/addNewCollection', addNewCollection);
collectionsRoutes.get('/', getAllCollections);
collectionsRoutes.get('/getByOrderId/:orderId', getCollectionByOrderId);

export default collectionsRoutes;