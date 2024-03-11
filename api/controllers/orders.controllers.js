import Orders from "../models/orders.js";
import ProductsClients from "../models/productsClients.js";

export const incrementarStock = async (productosComprados) => { 
  try {
    for (const productoCompra of productosComprados) {
      const { productId, quantity } = productoCompra;
      const cantidad = parseInt(quantity, 10); // Convertir a entero
      console.log("Me llego:", productId, cantidad);
      await ProductsClients.findByIdAndUpdate(
        productId,
        { $inc: { stock: cantidad }},
        { new: true } // Para obtener el producto actualizado después de la actualización
      );
    }
  } catch (error) {
    throw new Error(`Error al incrementar el stock: ${error.message}`);
  }
};

export const decrementarStock = async (productosComprados) => { 
  try {
    for (const productoCompra of productosComprados) {
      const { productId, quantity } = productoCompra;
      const cantidad = parseInt(quantity, 10); // Convertir a entero
      console.log("Antes de la actualización:", productId, cantidad);
      await ProductsClients.findByIdAndUpdate(
        productId,
        { $inc: { stock: -cantidad }},
        { new: true }
      );
      console.log("Después de la actualización:", productId, cantidad);
    }
  } catch (error) {
    throw new Error(`Error al decrementar el stock: ${error.message}`);
  }
};

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

export const getMonthlyOrders = async (req, res) => { 
  const {month} = req.params
  console.log(month)
  console.log("me llego algo")
  try {
     const justThisMonthOrders = await Orders.find({month: month})
     res.status(200).json(justThisMonthOrders);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener las ordenes del mes' });
    console.log(error)
  }
}



export const createOrder = async (req, res) => { 
  console.log(req.body)
  try {
      if (req.body.orderStatus === "A Confirmar") {
          const newOrder = new Orders(req.body);
          const orderSaved = await newOrder.save();
          res.status(201).json(orderSaved);
      } else {
          const newOrder = new Orders(req.body);
          const orderSaved = await newOrder.save();
          await decrementarStock(req.body.orderDetail);
          res.status(201).json(orderSaved);
      }
  } catch (error) {
      res.status(500).json({ error: 'Error al crear la orden' });
      console.log(error);
  }
}

export const changeOrderToConfirmedAndDiscountStock = async (req, res) => { 
  console.log(req.body)
  await decrementarStock(req.body.orderDetail);

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

export const addPaid = async (req, res) => { 
  const { orderId } = req.params;
  try {
    const orderUpdated= await Orders.findByIdAndUpdate(
        { _id: orderId },
        { paid: true },
        { new: true } 
    );

    if (!orderUpdated) {
        return res.status(404).json({ error: "No se encontró el pedido" });
    }

    res.status(200).json(orderUpdated);
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: "Error interno del servidor" });
    } 
}

export const deleteAndReplenishArticles = async (req, res) => { 
  const { orderId } = req.params;
  try {
    const order = await Orders.findById({_id: orderId});
    if (!order) {
      return res.status(404).json({ mensaje: 'Orden no encontrada' });
    }
    const rentedProducts = order.orderDetail;
    console.log("ACA MIRA:", rentedProducts)
    await Promise.all(
        rentedProducts.map(async (productRented) => {
        const { productId, quantity } = productRented;
        const cantidad = parseInt(quantity, 10);
    
        await ProductsClients.findByIdAndUpdate(
          {_id: productId},
          { $inc: { stock: +cantidad } },
          { new: true }
        );
      })
    );

    await Orders.findByIdAndDelete(orderId);

    res.status(200).json({ mensaje: 'Alquiler eliminada y stock repuesto' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ mensaje: 'Error al procesar la solicitud' });
  }
} 

export const updateOrderData = async (req, res) => { 
  const {orderId} = req.params
  const {newOrderDeliveryDate, newOrderReturnDate, newOrderClient, newOrderReturnPlace, newOrderDeliveryPlace} = req.body
  console.log(req.body)

      try {
        Orders.findByIdAndUpdate({ _id: orderId }, { 
        client: newOrderClient,
        dateOfDelivery: newOrderDeliveryDate,
        placeOfDelivery: newOrderDeliveryPlace,
        returnDate: newOrderReturnDate,
        returnPlace: newOrderReturnPlace,
        })
        .then((newOrderData) => {                                      
        res.json({message:"Orden actualizada Correctamente", newOrderData})
        })
        .catch((err) => { 
        console.log(err)
        })

    } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Error interno del servidor' });
    }
}

export const updateOrderDetail = async (req, res) => {
  const { orderId } = req.params;
  const { newOrderDetailData } = req.body;

  try {
    if (newOrderDetailData && newOrderDetailData.orderDetail && newOrderDetailData.total) {
      const updatedOrderData = await Orders.findOneAndUpdate(
        { _id: orderId },
        {
          $set: {
            total: newOrderDetailData.total,
            orderDetail: newOrderDetailData.orderDetail,
          },
        },
        { new: true }
      );

      res.json({ message: "Detalles del pedido actualizados correctamente", updatedOrderData });
    } else {
      res.status(400).json({ message: 'El objeto newOrderDetailData no tiene la estructura esperada.' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
};

export const addNewProductsToOrderDetail = async (req, res) => {
  const { orderId } = req.params;
  const productsSelected = req.body; 

  try {
    const existingOrder = await Orders.findById(orderId);
    if (!existingOrder) {
      return res.status(404).json({ error: 'Orden no encontrada' });
    }

    existingOrder.orderDetail.push(...productsSelected);
    existingOrder.total += productsSelected.reduce((acc, obj) => acc + obj.choosenProductTotalPrice, 0);

    const updatedOrder = await existingOrder.save();
    await decrementarStock(productsSelected);

    res.status(200).json(updatedOrder);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al agregar nuevos productos a la orden' });
  }
};