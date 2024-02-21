import express from 'express';
const collectionsRoutes = express.Router();
import { addNewCollection, getAllCollections } from '../controllers/collections.controllers.js';

collectionsRoutes.post('/addNewCollection', addNewCollection);
collectionsRoutes.get('/', getAllCollections);


export default collectionsRoutes;