import Expenses from "../models/expenses.js"
import typeFixedExpenses from "../models/typeOfFixedExpenses.js";

export const createNewExpense = async (req, res) => { 
    console.log(req.body)
    try {
     const newExpense = new Expenses(req.body);
     const expenseSaved = await newExpense.save();
     res.status(200).json(expenseSaved);
   } catch (error) {
     res.status(500).json({ error: 'Error al crear el gasto' });
     console.log(error)
   }
}

export const getExpenses = async (req, res) => { 
    try {
        const allExpenses = await Expenses.find()
        res.status(200).json(allExpenses);
      } catch (error) {
        res.status(500).json({ error: 'Error al crear el gasto' });
        console.log(error)
      }
}

export const getTypesFixedExpenses = async (req, res) => { 
  try {
      const allExpenses = await typeFixedExpenses.find()
      res.status(200).json(allExpenses);
    } catch (error) {
      res.status(500).json({ error: 'Error al crear el gasto' });
      console.log(error)
    }
}

export const getMonthlyExpenses = async (req, res) => { 
  const {month} = req.params
  console.log(month)

  try {
     const justThisMonthExpenses = await Expenses.find({month: month})
     res.status(200).json(justThisMonthExpenses);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener los gastos del mes' });
    console.log(error)
  }
}


export const createNewTypeFixed = async (req, res) => { 
  console.log(req.body)
  try {
    const newTypeFixedExpense = new typeFixedExpenses(req.body);
    const newTypeSaved = await newTypeFixedExpense.save();
    res.status(200).json(newTypeSaved);
  } catch (error) {
    res.status(500).json({ error: 'Error al crear el tipo de gasto fijo' });
    console.log(error)
  }
}