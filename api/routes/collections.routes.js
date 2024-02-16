import express from 'express';
const collectionsRoutes = express.Router();
import { addNewCollection } from '../controllers/collections.controllers.js';

collectionsRoutes.post('/addNewCollection', addNewCollection);

export default collectionsRoutes;