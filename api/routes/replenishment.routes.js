import express from 'express';
const replenishmentRoutes = express.Router();


import  {
    saveNewReplenishment,
    getMonthlyReplenishments
} from '../controllers/replenishment.controllers.js' 


replenishmentRoutes.post('/', saveNewReplenishment);
replenishmentRoutes.get('/:month', getMonthlyReplenishments);



export default replenishmentRoutes;


