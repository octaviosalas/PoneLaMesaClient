import ReplenishmentsToStock from "../models/ReplenishmentsToStock.js";

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

