import express from 'express';
const productsRoutes = express.Router();
import { productsBonusClientsData, productsClientsData } from '../controllers/products.controllers.js';


productsRoutes.get('/productsClients', productsClientsData);
productsRoutes.get('/productsBonusClients', productsBonusClientsData);



export default productsRoutes;