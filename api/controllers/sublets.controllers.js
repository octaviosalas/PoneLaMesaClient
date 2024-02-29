import Sublets from "../models/sublets.js";

export const createSublet = async (req, res) => { 
    console.log(req.body)
   try {
    const newSubletToBeSaved = new Sublets(req.body)
    const newSaved = await newSubletToBeSaved.save()
    res.status(200).json(newSaved)
   } catch (error) {
    res.status(500).json({ error: 'Error al crear subAlquiler' });
    console.log(error)
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

export const deleteSublet = async (req, res) => { 
    const {subletId} = req.params
    console.log(subletId)
    try {
      const deletedSublet = await Sublets.findByIdAndDelete({_id: subletId});
      if (deletedSublet) {
        res.status(200).json({ message: 'SubAlquiler eliminado correctamente', deleted: deletedSublet });
      } else {
        res.status(404).json({ message: 'SubAlquiler no encontrado' });
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Error al eliminar el SubAlquiler' });
    }
}