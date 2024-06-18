import express from 'express';
const clientesRoutes = express.Router();


import  {
   getClientData,
   createNewClient,
   getClients,
   deleteClient,
   updateClientData,
   createClientDebt,
   updateDebtStatus,
   getClientsByType,
   deleteClientDebt
} from '../controllers/clients.controllers.js' 


// Routes:
clientesRoutes.get('/', getClients);
clientesRoutes.get('/:clientId', getClientData);
clientesRoutes.get('/byType/:typeOfClient', getClientsByType);
clientesRoutes.post('/createClient', createNewClient);
clientesRoutes.delete('/:clientId', deleteClient);
clientesRoutes.put('/changeData/:clientId', updateClientData);
clientesRoutes.post("/createClientDebt/:clientId", createClientDebt)
clientesRoutes.put("/updateDebtStatus/:clientId", updateDebtStatus)
clientesRoutes.post("/cancelDebt/:clientId/:debtId", deleteClientDebt)

export default clientesRoutes;


