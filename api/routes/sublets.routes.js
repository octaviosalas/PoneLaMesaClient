import express from 'express';
const subletsRoutes = express.Router();

import { getSubletById, getEverySublets, createSublet, deleteSublet, updateSubletData } from '../controllers/sublets.controllers.js';

subletsRoutes.get('/', getEverySublets);
subletsRoutes.get('/:subletId', getSubletById);
subletsRoutes.put('/:subletId', updateSubletData);
subletsRoutes.post('/', createSublet);
subletsRoutes.delete('/:subletId', deleteSublet);


export default subletsRoutes;