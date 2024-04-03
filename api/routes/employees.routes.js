import express from 'express';
const employeesRoutes = express.Router();


 import  {
  getEmployees,
  createEmployee,
  createShift,
  getShiftByEmployeeId,
  updateEmployeeData,
  deleteEmployee
} from '../controllers/employees.controllers.js' 


// Routes: 
employeesRoutes.get('/', getEmployees);
employeesRoutes.get('/getEmployeeShifts/:employeeId', getShiftByEmployeeId);
employeesRoutes.post("/create", createEmployee)
employeesRoutes.put('/changeData/:employeeId', updateEmployeeData);
employeesRoutes.delete('/deleteEmployee/:employeeId', deleteEmployee);
employeesRoutes.get('/getShiftsByDate/:date', );
employeesRoutes.get('/getShiftsByEmployeesId/:employeesId', );
employeesRoutes.delete('/:shiftId', );

employeesRoutes.post("/createShift", createShift)

export default employeesRoutes;


