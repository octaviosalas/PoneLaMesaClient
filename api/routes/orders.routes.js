import express from 'express';
const ordersRoutes = express.Router();
import { getOrderById, getOrders, createOrder } from '../controllers/orders.controllers.js';


ordersRoutes.get('/', getOrders);
ordersRoutes.get('/:orderId', getOrderById);
ordersRoutes.post('/create', createOrder);



export default ordersRoutes;