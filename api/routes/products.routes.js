import express from 'express';
const productsRoutes = express.Router();
import { productsBonusClientsData, productsClientsData, updateProduct, deleteProduct, priceIncrease, returnQuantityToStock, getProductById, createProduct } from '../controllers/products.controllers.js';

//getProductById
productsRoutes.get('/productsClients', productsClientsData);
productsRoutes.post('/create', createProduct);
productsRoutes.get('/productsBonusClients', productsBonusClientsData);
productsRoutes.get('/:productId', getProductById);
productsRoutes.put('/changeData/:productId', updateProduct);
productsRoutes.delete('/delete/:productId', deleteProduct);
productsRoutes.post('/increasePrices', priceIncrease);
productsRoutes.put('/returnQuantityToStock', returnQuantityToStock);



export default productsRoutes;