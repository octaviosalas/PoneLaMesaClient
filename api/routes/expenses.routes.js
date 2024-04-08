import express from 'express';
const expensesRoutes = express.Router();
import { createNewExpense, getExpenses, getTypesFixedExpenses, getMonthlyExpenses } from '../controllers/expenses.controllers.js';

expensesRoutes.post('/addNewExpense', createNewExpense);
expensesRoutes.get('/getExpensesByMonth/:month', getMonthlyExpenses);
expensesRoutes.get('/', getExpenses);
expensesRoutes.get('/typeFixed', getTypesFixedExpenses);


export default expensesRoutes;