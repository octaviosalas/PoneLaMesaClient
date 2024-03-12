import express from 'express';
const subletsRoutes = express.Router();

import { getSubletById, getEverySublets, createSublet, deleteSublet, updateSubletData, updateSubletState } from '../controllers/sublets.controllers.js';

subletsRoutes.get('/', getEverySublets);
subletsRoutes.get('/:subletId', getSubletById);
subletsRoutes.put('/:subletId', updateSubletData);
subletsRoutes.put('/updateState/:subletId', updateSubletState);
subletsRoutes.post('/', createSublet);
subletsRoutes.delete('/:subletId', deleteSublet);


export default subletsRoutes;