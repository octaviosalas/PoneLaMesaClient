import express from 'express';
const employeesShiftsRoutes = express.Router();


/* import  {
   getClientData,
   createNewClient,
   getClients,
   deleteClient,
   updateClientData,
   createClientDebt,
   updateDebtStatus
} from '../controllers/clients.controllers.js' */


// Routes: 
employeesShiftsRoutes.get('/', );
employeesShiftsRoutes.get('/getShiftsByDate/:date', );
employeesShiftsRoutes.get('/getShiftsByEmployeesId/:employeesId', );
employeesShiftsRoutes.delete('/:shiftId', );
employeesShiftsRoutes.put('/changeData/:shiftId', );
employeesShiftsRoutes.post("/createShift", )

export default employeesShiftsRoutes;


