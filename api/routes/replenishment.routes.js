import express from 'express';
const replenishmentRoutes = express.Router();


import  {
    saveNewReplenishment
} from '../controllers/replenishment.controllers.js' 


// Routes:

replenishmentRoutes.post('/', saveNewReplenishment);



export default replenishmentRoutes;


