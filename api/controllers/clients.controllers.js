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
    const {clientId} = req.params
    try {
        const clientSearched = await Clients.findById({_id: clientId});
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

export const createClientDebt = async (req, res) => { 
  const {clientId} = req.params;
  console.log("REQ.BODY CLIENTE", req.body);
  try {
     const existingClient = await Clients.findById(clientId);
 
     if (!existingClient) {
       return res.status(404).json({ error: 'Cliente no encontrada' });
     }
      const debtDataArray = Object.values(req.body);
      existingClient.clientDebt.push(...debtDataArray);
      const updatedClientData = await existingClient.save();
     res.status(200).json(updatedClientData);
  } catch (error) {
     console.error(error);
     res.status(500).json({ error: 'Error al agregar deuda al cliente' });
  }
 }


 export const updateDebtStatus = async (req, res) => { 
  const {clientId} = req.params;
  console.log("Me llego el ID del cliente: ", clientId);
  const {data} = req.body;

  try {
   const clientDebtUpdated = await Clients.findByIdAndUpdate({ _id: clientId });

   if (!clientDebtUpdated) {
       return res.status(404).json({ error: "No se encontró el estado" });
   }

   const debtsWithOutPaid = clientDebtUpdated.clientDebt.filter((debts) => debts.paid === false);
   const updatedDebts = debtsWithOutPaid.map(debt => {
       if (debt.debtId === data.debtId) {
           return { ...debt, paid: data.newStatus };
       }  
       return debt;
   });

   const updatedClient = await Clients.findByIdAndUpdate(clientId, { clientDebt: updatedDebts }, { new: true });

   res.status(200).json(updatedClient);
   } catch (error) {
       console.error('Error:', error);
       res.status(500).json({ error: "Error interno del servidor" });
   } 
}

