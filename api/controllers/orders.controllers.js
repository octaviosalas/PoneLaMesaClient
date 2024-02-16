import Orders from "../models/orders.js";

export const getOrders = async (req, res) => { 
    try {
      const orders = await Orders.find()
      res.status(200).json(orders);
    } catch (error) {
      res.status(500).json({ error: 'Error al obtener las ordenes' });
      console.log(error)
    }
}

export const getOrderById = async (req, res) => { 
     
}

export const createOrder = async (req, res) => { 
    console.log(req.body)
    try {
      const newOrder = new Orders(req.body);
      const orderSaved = await newOrder.save();
      res.status(201).json(orderSaved);
    } catch (error) {
      res.status(500).json({ error: 'Error al crear la orden' });
      console.log(error)
    }
}

export const changeOrderState = async (req, res) => { 
  const { orderId } = req.params;
  console.log(orderId)
  const {newStatus} = req.body


  try {
    const orderUpdated= await Orders.findByIdAndUpdate(
        { _id: orderId },
        { orderStatus: newStatus },
        { new: true } 
    );

    if (!orderUpdated) {
        return res.status(404).json({ error: "No se encontró el estado" });
    }

    res.status(200).json(orderUpdated);
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: "Error interno del servidor" });
    } 
}

export const deleteOrder = async (req, res) => { 
  const {orderId} = req.params
  console.log(orderId)
  try {
    const deletedOrder = await Orders.findByIdAndDelete({_id: orderId});
    if (deletedOrder) {
      res.status(200).json({ message: 'Pedido eliminado correctamente', deleted: deletedOrder });
    } else {
      res.status(404).json({ message: 'Pedido no encontrado' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al eliminar la recomendacion' });
  }
}

