import express from 'express';
const clientesRoutes = express.Router();


import  {
   getClientData,
   createNewClient,
   getClients,
   deleteClient,
   updateClientData,
   createClientDebt
} from '../controllers/clients.controllers.js' 


// Routes:
clientesRoutes.get('/', getClients);
clientesRoutes.get('/:clientId', getClientData);
clientesRoutes.post('/createClient', createNewClient);
clientesRoutes.delete('/:clientId', deleteClient);
clientesRoutes.put('/changeData/:clientId', updateClientData);
clientesRoutes.post("/createClientDebt/:clientId", createClientDebt)


export default clientesRoutes;


