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
         changeOrderToConfirmedAndDiscountStock,
         addArticlesMissed,
         updateMissingArticlesLikePaid,
         createPdf,
         deleteDownPaymentData,
         getOrdersByClient,
         createDetailPdf, 
         nextFiveDaysOrdersWithDelivery,
        nextFiveDaysOrdersConfirmed,
        ordersAfterFiveDays,
        changeSomeStatus,
        getOrdersToBeConfirmed, 
        createParcialPayment
        } from '../controllers/orders.controllers.js';


ordersRoutes.get('/', getOrders);
ordersRoutes.get('/:orderId', getOrderById);
ordersRoutes.get('/getByClient/:clientId', getOrdersByClient);
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
ordersRoutes.post('/addMissedArticles/:orderId', addArticlesMissed);
ordersRoutes.put('/updateMissedArticlesLikePaid/:orderId', updateMissingArticlesLikePaid);
ordersRoutes.post('/createPdf/', createPdf);
ordersRoutes.post('/createDetailPdf/', createDetailPdf);
ordersRoutes.post('/addDownPaymentToOrder/', createPdf);
ordersRoutes.delete('/deleteDownPayment/:orderId', deleteDownPaymentData);
ordersRoutes.get('/ord/nextFiveOrders', nextFiveDaysOrdersWithDelivery);
ordersRoutes.get('/ord/nextFiveOrdersConfirmed', nextFiveDaysOrdersConfirmed);
ordersRoutes.get('/ord/afterFiveDays', ordersAfterFiveDays);
ordersRoutes.get('/ord/justToBeConfirmed', getOrdersToBeConfirmed);

ordersRoutes.post("/updateSomeOrdersStates", changeSomeStatus)
ordersRoutes.post("/createParcialPayment/:orderIdReference", createParcialPayment)


export default ordersRoutes;