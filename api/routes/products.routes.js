import express from 'express';
const productsRoutes = express.Router();
import { productsBonusClientsData, productsClientsData, updateProduct, deleteProduct, priceIncrease } from '../controllers/products.controllers.js';


productsRoutes.get('/productsClients', productsClientsData);
productsRoutes.get('/productsBonusClients', productsBonusClientsData);
productsRoutes.put('/changeData/:productId', updateProduct);
productsRoutes.delete('/delete/:productId', deleteProduct);
productsRoutes.post('/increasePrices', priceIncrease);




export default productsRoutes;