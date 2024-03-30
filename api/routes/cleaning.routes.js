import express from 'express';
const cleaningRoutes = express.Router();


import  {
    addNewArticlesToWash,
    getCleaningData,
    updateCleaningData
} from '../controllers/cleaning.controllers.js' 


// Routes:
cleaningRoutes.get('/', getCleaningData);
cleaningRoutes.post('/addNewArticles', addNewArticlesToWash);
cleaningRoutes.put('/updateQuantity/:productId', updateCleaningData); 


export default cleaningRoutes;


