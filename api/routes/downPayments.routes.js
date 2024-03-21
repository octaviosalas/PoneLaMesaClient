import express from 'express';
const downPaymentsRoutes = express.Router();
import {getAllDownPayments, getDownPaymentById, getDownPaymentByOrderId, createNewDownPayment  } from '../controllers/downPayment.controllers.js';


downPaymentsRoutes.get('/', getAllDownPayments);
downPaymentsRoutes.get('/:id', getDownPaymentById);
downPaymentsRoutes.get('/:orderId', getDownPaymentByOrderId);
downPaymentsRoutes.post('/createNewDownPayment', createNewDownPayment);



export default downPaymentsRoutes;

