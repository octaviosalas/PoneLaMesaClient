import express from 'express';
const purchasesRoutes = express.Router();
import { getAllPurchases, getPurchaseById, savePurchase, updateCompra, deletePurchase, deleteAndReplenishShares } from '../controllers/purchases.controllers.js';


purchasesRoutes.get('/', getAllPurchases);
purchasesRoutes.get('/:purchaseId', getPurchaseById);
purchasesRoutes.post('/create', savePurchase);
purchasesRoutes.put('/:purchaseId', updateCompra);
purchasesRoutes.delete('/:purchaseId', deletePurchase);
purchasesRoutes.delete('/replenishShares/:purchaseId', deleteAndReplenishShares);


export default purchasesRoutes;

