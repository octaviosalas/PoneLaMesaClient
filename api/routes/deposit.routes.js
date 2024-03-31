import express from 'express';
const depositRoutes = express.Router();


import  {
    updateDepositData,
    getDepositData,
    addNewArticlesToDeposit
} from '../controllers/deposit.controllers.js' 


// Routes:
depositRoutes.get('/', getDepositData);
depositRoutes.post('/addNewArticles', addNewArticlesToDeposit);
depositRoutes.put('/updateQuantity/:productId', updateDepositData); 


export default depositRoutes;


