import Clients from "../models/clients.js"

export const createNewClient = async (req, res) => { 
    console.log(req.body)
    try {
      const newClient = new Clients(req.body);
      const orderSaved = await newClient.save();
      res.status(201).json(orderSaved);
    } catch (error) {
      res.status(500).json({ error: 'Error al crear el cliente' });
      console.log(error)
    }
}

export const getClients = async (req, res) => { 
    try {
        const allClients = await Clients.find()
        res.status(200).json(allClients);
      } catch (error) {
        res.status(500).json({ error: 'Error al obtener los clientes' });
        console.log(error)
      }
}

export const getClientData = async (req, res) => { 
    try {
        const clientSearched = await Clients.findById(req.params.id);
        if (!clientSearched) {
          return res.status(404).json({ message: 'cliente no encontrado' });
        }
        res.status(200).json(clientSearched);
      } catch (error) {
        res.status(500).json({ error: 'Error al obtener el cliente' });
      }
}

export const deleteClient = async (req, res) => { 
    const {clientId} = req.params
    console.log(clientId)
    try {
      const deletedClient = await Clients.findByIdAndDelete({_id: clientId});
      if (deletedClient) {
        res.status(200).json({ message: 'Cliente eliminado correctamente', deleted: deletedClient });
      } else {
        res.status(404).json({ message: 'Cliente no encontrado' });
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Error al eliminar el cliente' });
    }
}


export const updateClientData = async (req, res) => { 
  console.log(req.params)
  const { clientId } = req.params;
  const {client, telephone, clientEmail, home, typeOfClient} = req.body

    try {
        Clients.findByIdAndUpdate({ _id: clientId }, { 
        name: client,
        telephone: telephone,
        email: clientEmail,
        home: home,
        typeOfClient: typeOfClient         
        })
        .then((newClientData) => {                                      
        res.json({message:"Cliente Modificado", newClientData})
        })
        .catch((err) => { 
        console.log(err)
        })
      } catch (error) {
      console.log(error);
      res.status(500).json({ message: 'Error interno del servidor' });
      }
}

