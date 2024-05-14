import express from 'express';
const expensesRoutes = express.Router();
import { createNewExpense, getExpenses, getTypesFixedExpenses, getMonthlyExpenses, createNewTypeFixed, deleteExpense } from '../controllers/expenses.controllers.js';

expensesRoutes.post('/addNewExpense', createNewExpense);
expensesRoutes.get('/getExpensesByMonth/:month', getMonthlyExpenses);
expensesRoutes.get('/', getExpenses);
expensesRoutes.get('/typeFixed', getTypesFixedExpenses);
expensesRoutes.post('/createTypeFixed', createNewTypeFixed);
expensesRoutes.delete('/:expenseId', deleteExpense);


export default expensesRoutes;