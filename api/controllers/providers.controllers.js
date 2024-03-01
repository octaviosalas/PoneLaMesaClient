import Providers from "../models/providers.js";



export const createProvider = async (req, res) => { 
   try {
    const newProviderData = new Providers(req.body)
    const newSaved = await newProviderData.save()
    res.status(200).json(newSaved)
   } catch (error) {
    res.status(500).json({ error: 'Error al crear proveedor' });
    console.log(error)
   }
}

export const getProviders = async (req, res) => { 
    try {
        const allProviders = await Providers.find()
        res.status(200).json(allProviders);
      } catch (error) {
        res.status(500).json({ error: 'Error al obtener los proveeodres' });
        console.log(error)
      }
}

export const getProviderById = async (req, res) => { 
    try {
        const providerSearches = await Providers.findById(req.params.id);
        if (!providerSearches) {
          return res.status(404).json({ message: 'Proveedor no encontrado' });
        }
        res.status(200).json(providerSearches);
      } catch (error) {
        res.status(500).json({ error: 'Error al obtener el Proveedor' });
      }
}


export const updateProviderData = async (req, res) => { 
    console.log(req.params)
    const { providerId } = req.params;
    const {name, telephone, email} = req.body
  
      try {
          Providers.findByIdAndUpdate({ _id: providerId }, { 
          name: name,
          telephone: telephone,
          email: email,
                
          })
          .then((newProviderData) => {                                      
          res.json({message:"Proveedor Modificado", newProviderData})
          })
          .catch((err) => { 
          console.log(err)
          })
        } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Error interno del servidor' });
        }
  }
  

  export const deleteProvider = async (req, res) => { 
    const {providerId} = req.params
    console.log(providerId)
    try {
      const deletedProvider = await Providers.findByIdAndDelete({_id: providerId});
      if (deletedProvider) {
        res.status(200).json({ message: 'Proveedor eliminado correctamente', deleted: deletedProvider });
      } else {
        res.status(404).json({ message: 'Proveedor no encontrado' });
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Error al eliminar el Proveedor' });
    }
}