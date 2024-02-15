import Orders from "../models/orders.js";

export const getOrders = async (req, res) => { 
     
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

