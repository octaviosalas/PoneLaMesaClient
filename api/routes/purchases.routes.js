import express from 'express';
const purchasesRoutes = express.Router();
import { getAllPurchases, getPurchaseById, savePurchase, updateCompra, deletePurchase, deleteAndReplenishShares, updatePurchaseDetail, getPurchasesByMonth } from '../controllers/purchases.controllers.js';


purchasesRoutes.get('/', getAllPurchases);
purchasesRoutes.get('/getByMonth/:month', getPurchasesByMonth);
purchasesRoutes.get('/:purchaseId', getPurchaseById);
purchasesRoutes.post('/create', savePurchase);
purchasesRoutes.put('/updatePurchaseData/:purchaseId', updateCompra);
purchasesRoutes.put('/updatePurchaseDetail/:purchaseId/:typeOfExpense/:referenceId', updatePurchaseDetail);
purchasesRoutes.delete('/:purchaseId', deletePurchase);
purchasesRoutes.delete('/replenishShares/:purchaseId', deleteAndReplenishShares);


export default purchasesRoutes;

