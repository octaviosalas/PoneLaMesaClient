import ReplenishmentsToStock from "../models/replenishmentsToStock.js";

export const saveNewReplenishment = async (req, res) => { 
    console.log(req.body)
    try {  
        const newReplenishmentData = new ReplenishmentsToStock(req.body);
        const replenishmentDataSaved = await newReplenishmentData.save();
        res.status(200).json(replenishmentDataSaved);
    } catch (error) {
        res.status(500).json({ error: 'Error al crear la reposicion' });
        console.log(error);
    }
}

export const getMonthlyReplenishments= async (req, res) => { 
    const {month} = req.params
    console.log("lalalalala", month)
    try {
       const justThisReplenishmentsMonth = await ReplenishmentsToStock.find({month: month})
       res.status(200).json(justThisReplenishmentsMonth);
    } catch (error) {
      res.status(500).json({ error: 'Error al obtener las reposiciones del mes' });
      console.log(error)
    }
  }

 

