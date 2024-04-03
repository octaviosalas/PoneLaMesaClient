import Employees from "../models/employees.js";
import EmployeesShifts from "../models/employeesShifts.js";

export const getEmployees = async (req, res) => { 
    try {
        const allEmployees = await Employees.find()
        res.status(200).json(allEmployees);
      } catch (error) {
        res.status(500).json({ error: 'Error al obtener los empleados' });
        console.log(error)
      }
}


export const createEmployee = async (req, res) => { 
    console.log(req.body)
    try {
      const newEmployee = new Employees(req.body);
      const employeeSaved = await newEmployee.save();
      res.status(200).json(employeeSaved);
    } catch (error) {
      res.status(500).json({ error: 'Error al crear el empleado' });
      console.log(error)
    }
}

export const createShift = async (req, res) => { 
    console.log(req.body)
    try {
      const newShift = new EmployeesShifts(req.body);
      const shiftSaved = await newShift.save();
      res.status(200).json(shiftSaved);
    } catch (error) {
      res.status(500).json({ error: 'Error al crear el turno' });
      console.log(error)
    }
}


export const getShiftByEmployeeId = async (req, res) => { 

  const {employeeId} = req.params
  console.log(employeeId)

  try {
    const employeeData = await EmployeesShifts.find({employeeId: employeeId})
    res.status(200).json(employeeData);
  } catch (error) {
    res.status(500).json({ error: 'Error al buscar turnos del empleado' });
    console.log(error)
  }
}