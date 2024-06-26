import express from 'express';
const employeesRoutes = express.Router();

 import  {
  getEmployees,
  createEmployee,
  createShift,
  getShiftByEmployeeId,
  updateEmployeeData,
  deleteEmployee,
  getShifsByMonth,
  getEmployeesById,
  getEveryEmployeesShifts
} from '../controllers/employees.controllers.js' 


employeesRoutes.get('/', getEmployees);
employeesRoutes.get('/getOneEmployee/:employeeId', getEmployeesById);
employeesRoutes.get('/getEmployeeShifts/:employeeId', getShiftByEmployeeId);
employeesRoutes.get('/everyShifts/', getEveryEmployeesShifts);
employeesRoutes.get('/getShifsByMonth/:month', getShifsByMonth);
employeesRoutes.post("/create", createEmployee)
employeesRoutes.put('/changeData/:employeeId', updateEmployeeData);
employeesRoutes.delete('/deleteEmployee/:employeeId', deleteEmployee);
employeesRoutes.get('/getShiftsByDate/:date', );
employeesRoutes.get('/getShiftsByEmployeesId/:employeesId', );
employeesRoutes.delete('/:shiftId', );

employeesRoutes.post("/createShift", createShift)

export default employeesRoutes;


