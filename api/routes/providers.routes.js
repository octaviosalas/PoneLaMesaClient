import express from 'express';
const providersRoutes = express.Router();
import { createProvider, getProviders, getProviderById, updateProviderData, deleteProvider } from '../controllers/providers.controllers.js';

providersRoutes.get('/', getProviders);
providersRoutes.get('/:providerId', getProviderById);
providersRoutes.post('/createProvider', createProvider);
providersRoutes.delete('/:providerId', deleteProvider);
providersRoutes.put('/changeData/:providerId', updateProviderData);


export default providersRoutes;


