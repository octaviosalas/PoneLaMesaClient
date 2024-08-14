import express from 'express';
const subletsToReturn = express.Router();


import  {
    addNewArticlesToReturnSublet,
    getCleaningData,
    returnToProvider
} from '../controllers/subletsToReturn.controllers.js' 


// Routes:
subletsToReturn.get('/', getCleaningData);
subletsToReturn.post('/addNewArticles', addNewArticlesToReturnSublet);
subletsToReturn.put('/updateQuantity/:productId', returnToProvider); 


export default subletsToReturn;


