import express from 'express';
const ordersRoutes = express.Router();
import { getOrderById, getOrders, createOrder, changeOrderState, deleteOrder } from '../controllers/orders.controllers.js';


ordersRoutes.get('/', getOrders);
ordersRoutes.get('/:orderId', getOrderById);
ordersRoutes.post('/create', createOrder);
ordersRoutes.put('/changeOrderState/:orderId', changeOrderState);
ordersRoutes.delete('/:orderId', deleteOrder);




export default ordersRoutes;