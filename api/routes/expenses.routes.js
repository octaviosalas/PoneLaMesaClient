import express from 'express';
const expensesRoutes = express.Router();
import { createNewExpense, getExpenses } from '../controllers/expenses.controllers.js';

expensesRoutes.post('/addNewExpense', createNewExpense);
expensesRoutes.get('/', getExpenses);


export default expensesRoutes;