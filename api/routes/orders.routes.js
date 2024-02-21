import express from 'express';
const ordersRoutes = express.Router();
import { getOrderById, getOrders, createOrder, changeOrderState, deleteOrder, addPaid, deleteAndReplenishArticles } from '../controllers/orders.controllers.js';


ordersRoutes.get('/', getOrders);
ordersRoutes.get('/:orderId', getOrderById);
ordersRoutes.post('/create', createOrder);
ordersRoutes.put('/changeOrderState/:orderId', changeOrderState);
ordersRoutes.put('/addPaid/:orderId', addPaid);
ordersRoutes.delete('/:orderId', deleteOrder);
ordersRoutes.delete('/replenishStock/:orderId', deleteAndReplenishArticles);



export default ordersRoutes;