import express from 'express';
const productsRoutes = express.Router();
import { productsBonusClientsData, productsClientsData, updateProduct } from '../controllers/products.controllers.js';


productsRoutes.get('/productsClients', productsClientsData);
productsRoutes.get('/productsBonusClients', productsBonusClientsData);
productsRoutes.put('/changeData/:productId', updateProduct);


export default productsRoutes;