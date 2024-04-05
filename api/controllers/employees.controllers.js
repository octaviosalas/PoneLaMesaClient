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

export const getShifsByMonth = async (req, res) => { 
  const { month } = req.params;
  try {
    const siftsByMonth = await EmployeesShifts.find({month: month})
    res.status(200).json(siftsByMonth);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener los turnos' });
    console.log(error)
  }
}

export const getEmployeesById = async (req, res) => { 
  const {employeeId} = req.params
  console.log(employeeId)

  try {
    const employeeData = await Employees.findById({_id: employeeId})
    res.status(200).json(employeeData);
  } catch (error) {
    res.status(500).json({ error: 'Error al buscar turnos del empleado' });
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


export const updateEmployeeData = async (req, res) => { 
  console.log(req.params)
  const { employeeId } = req.params;
  const {name, dni, hourAmount} = req.body

    try {
        Employees.findByIdAndUpdate({ _id: employeeId }, { 
        name: name,
        dni: dni,
        hourAmount: hourAmount             
        })
        .then((newEmployeeData) => {                                      
        res.json({message:"Empleado Modificado", newEmployeeData})
        })
        .catch((err) => { 
        console.log(err)
        })
      } catch (error) {
      console.log(error);
      res.status(500).json({ message: 'Error interno del servidor' });
      }
}


export const deleteEmployee = async (req, res) => { 
  const {employeeId} = req.params
  console.log(employeeId)
  try {
    const deletedEmployees = await Employees.findByIdAndDelete({_id: employeeId});
    if (deletedEmployees) {
      res.status(200).json({ message: 'Empleado eliminado correctamente', deleted: deletedEmployees });
    } else {
      res.status(404).json({ message: 'Empleado no encontrado' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al eliminar el cliente' });
  }
}