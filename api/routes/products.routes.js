import express from 'express';
const productsRoutes = express.Router();
import { productsBonusClientsData, productsClientsData, updateProduct, deleteProduct, priceIncrease, returnQuantityToStock, getProductById } from '../controllers/products.controllers.js';


productsRoutes.get('/productsClients', productsClientsData);
productsRoutes.get('/productsBonusClients', productsBonusClientsData);
productsRoutes.get('/:productIds', getProductById);
productsRoutes.put('/changeData/:productId', updateProduct);
productsRoutes.delete('/delete/:productId', deleteProduct);
productsRoutes.post('/increasePrices', priceIncrease);
productsRoutes.put('/returnQuantityToStock', returnQuantityToStock);



export default productsRoutes;