import express from 'express';
const ordersRoutes = express.Router();
import { getOrderById, 
         getOrders, 
         createOrder, 
         changeOrderState, 
         deleteOrder, 
         addPaid, 
         deleteAndReplenishArticles, 
         updateOrderData, 
         updateOrderDetail, 
         getMonthlyOrders, 
         addNewProductsToOrderDetail,
         changeOrderToConfirmedAndDiscountStock } from '../controllers/orders.controllers.js';


ordersRoutes.get('/', getOrders);
ordersRoutes.get('/:orderId', getOrderById);
ordersRoutes.get('/getByMonth/:month', getMonthlyOrders);
ordersRoutes.post('/create', createOrder);
ordersRoutes.put('/changeOrderState/:orderId', changeOrderState);
ordersRoutes.put('/updateOrderData/:orderId', updateOrderData);
ordersRoutes.put('/updateOrderDetail/:orderId', updateOrderDetail);
ordersRoutes.put('/addNewOrderDetail/:orderId', addNewProductsToOrderDetail);
ordersRoutes.put('/addPaid/:orderId', addPaid);
ordersRoutes.delete('/:orderId', deleteOrder);
ordersRoutes.delete('/replenishStock/:orderId', deleteAndReplenishArticles);
ordersRoutes.post('/confirmOrderAndDiscountStock/:orderId', changeOrderToConfirmedAndDiscountStock);




export default ordersRoutes;