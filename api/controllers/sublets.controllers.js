import Sublets from "../models/sublets.js";
import { incrementarStock, decrementarStock } from "./orders.controllers.js";
import Expenses from "../models/expenses.js"


export const createSublet = async (req, res) => { 

  console.log(req.body)

  try {
      const { expenseData, ...newSubletData } = req.body;

      const newSubletToBeSaved = new Sublets(newSubletData);
      const newSaved = await newSubletToBeSaved.save();

      expenseData.subletReferenceId = newSaved._id;

      const newExpenseToBeSaved = new Expenses(expenseData);
      const newExpenseSaved = await newExpenseToBeSaved.save();

      await incrementarStock(req.body.productsDetail);

      res.status(200).json({ newSublet: newSaved, newExpense: newExpenseSaved });
  } catch (error) {
      res.status(500).json({ error: 'Error al crear subAlquiler o gasto' });
      console.log(error);
  }
}



export const getEverySublets = async (req, res) => { 
    try {
        const allSublets = await Sublets.find()
        res.status(200).json(allSublets);
      } catch (error) {
        res.status(500).json({ error: 'Error al obtener los subAlquileres' });
        console.log(error)
      }
}

export const getMonthlySublets = async (req, res) => { 
  const {month} = req.params
  console.log(month)
  console.log("me llego algo")
  try {
     const justThisMonthSublets = await Sublets.find({month: month})
     res.status(200).json(justThisMonthSublets);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener las ordenes del mes' });
    console.log(error)
  }
}

export const getSubletById = async (req, res) => { 
    try {
        const subletSearched = await Sublets.findById(req.params.id);
        if (!subletSearched) {
          return res.status(404).json({ message: 'SubAlquiler no encontrado' });
        }
        res.status(200).json(subletSearched);
      } catch (error) {
        res.status(500).json({ error: 'Error al obtener el SubAlquiler' });
      }
}

export const updateSubletData = async (req, res) => { 
  
}

export const updateSubletState = async (req, res) => { 
  const { subletId } = req.params;
  console.log(subletId)
  try {
    const subletUpdated = await Sublets.findByIdAndUpdate(
      { _id: subletId },
      { used: true },
      { new: true } 
  );
   if (!subletUpdated) {
    return res.status(404).json({ error: "No se encontró el Sub Alquiler" });
   }
   res.status(200).json(subletUpdated);  
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: "Error interno del servidor" });   
  }
}


export const deleteSublet = async (req, res) => { 
  const {subletId} = req.params;
  console.log(req.body.subletProductsDetail);
  try {
      const deletedSublet = await Sublets.findByIdAndDelete(subletId);

      if (!deletedSublet) {
          return res.status(404).json({ message: 'SubAlquiler no encontrado' });
      }

      await decrementarStock(req.body.subletProductsDetail); 

      const deleteExpense = await Expenses.findOne({subletReferenceId: subletId});

      if (deleteExpense) {
          await Expenses.findByIdAndDelete(deleteExpense._id);
          console.log('Gasto asociado eliminado correctamente');
      }

      res.status(200).json({ message: 'SubAlquiler eliminado correctamente', deleted: deletedSublet });

  } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Error al eliminar el SubAlquiler' });
  }
}