import express from 'express';
const clientesRoutes = express.Router();


import  {
   getClientData,
   createNewClient,
   getClients,
   deleteClient
} from '../controllers/clients.controllers.js' 


// Routes:
clientesRoutes.get('/', getClients);
clientesRoutes.get('/:clientId', getClientData);
clientesRoutes.post('/createClient', createNewClient);
clientesRoutes.delete('/:clientId', deleteClient);


export default clientesRoutes;