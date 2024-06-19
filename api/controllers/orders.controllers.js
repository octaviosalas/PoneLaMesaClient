import Orders from "../models/orders.js";
import DownPayments from "../models/downPayment.js"
import Collections from "../models/collections.js";
import ProductsClients from "../models/productsClients.js";
import PDFDocument from "pdfkit";
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { formatePriceBackend } from "../utils/formatePriceBackend.js";
import { getCurrentDate, getFutureDate } from "../utils/dateFunctios.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const imagePath = path.join(__dirname, '..', 'imagesApi', 'logo.png');

export const incrementarStock = async (productosComprados) => { 
  try {
    for (const productoCompra of productosComprados) {
      const { productId, quantity } = productoCompra;
      const cantidad = parseInt(quantity, 10); // Convertir a entero
      console.log("Me llego:", productId, cantidad);
      await ProductsClients.findByIdAndUpdate(
        productId,
        { $inc: { stock: cantidad }},
        { new: true }
      );
    }
  } catch (error) {
    throw new Error(`Error al incrementar el stock: ${error.message}`);
  }
};

export const incrementStockJustInOneProduct = async (productoCompra) => { 
  try {
     const { productId, quantity } = productoCompra;
     const cantidad = quantity; 
     console.log("Me llego:", productId, cantidad);
     await ProductsClients.findByIdAndUpdate(
       productId, // Pasar directamente el productId
       { $inc: { stock: cantidad }},
       { new: true }
     );
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
  console.log("eee")
    try {
      const orders = await Orders.find()
      res.status(200).json(orders);
    } catch (error) {
      res.status(500).json({ error: 'Error al obtener las ordenes' });
      console.log(error)
    }
}

export const getOrderById = async (req, res) => { 
  const {orderId} = req.params
  try {
    const findOrderNow = await Orders.findById({_id: orderId})
    if(!findOrderNow) { 
      return res.status(500).json({message: "No encontre la orden"});
    }
    return res.status(200).json(findOrderNow);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener las ordenes' });
    console.log(error)
  }   
}

export const getOrdersByClient = async (req, res) => { 
  const {clientId} = req.params
  try {
    const findClientsOrders = await Orders.find({clientId: clientId})
    if(!findClientsOrders) { 
      return res.status(500).json({message: "No encontre ordenes del cliente"});
    }
    return res.status(200).json(findClientsOrders);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener las ordenes' });
    console.log(error)
  }   
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
          res.status(200).json(orderSaved);
      }
  } catch (error) {
      res.status(500).json({ error: 'Error al crear la orden' });
      console.log(error);
  }
}



export const changeOrderToConfirmedAndDiscountStock = async (req, res) => { 
  try {
     const { orderId } = req.params;
     const { detailOrder } = req.body;
     console.log(detailOrder);

     
 
     const foundOrder = await Orders.findById({_id: orderId});
 
     if (!foundOrder) {
       return res.status(404).json({ error: 'No se encontró la orden correspondiente.' });
     }
 
     const unifyArticles = detailOrder.orderDetail.concat(detailOrder.subletDetail);
 
     foundOrder.total = detailOrder.newAmount;
 
     detailOrder.subletDetail.forEach(sublet => {
       foundOrder.subletsDetail.push(sublet);
     });
 
     await decrementarStock(detailOrder.subletDetail);
     await foundOrder.save();
 
     res.status(200).json({ message: 'La orden se ha confirmado, el stock se ha descontado, y se han actualizado los detalles correctamente.' });
  } catch (error) {
     console.error(error);
     res.status(500).json({ error: 'Error al procesar la solicitud.' });
  }
 };


export const changeOrderState = async (req, res) => { 
  const { orderId } = req.params;
  const {newStatus} = req.body
  console.log("change order state:",  newStatus )

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

    if (order.downPaymentData && order.downPaymentData.length > 0) {
      const downPaymentId = order.downPaymentData[0].downPaymentId;
      await DownPayments.findOneAndDelete({ downPaymentId: downPaymentId });
    }

    
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
  const {newOrderClient, newOrderClientId} = req.body
  console.log(req.body)

      try {
        Orders.findByIdAndUpdate({ _id: orderId }, { 
        client: newOrderClient,
        clientId: newOrderClientId,       
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
  console.log(req.body)
  console.log("NEW TOTAL AMOUNT RECIBIDO", req.body.newTotalAmount)

  try {
    if (req.body && req.body.completeNewDetail && req.body.newTotalAmount) {
      const updatedOrderData = await Orders.findOneAndUpdate(
        { _id: orderId },
        {
          $set: {
            total: req.body.newTotalAmount,
            orderDetail: req.body.completeNewDetail,
          },
        },
        { new: true }
      );

      if(req.body.toDiscountStock.length > 0) { 
        await decrementarStock(req.body.toDiscountStock);
      }

      if(req.body.toIncrementStock.length > 0) { 
        await incrementarStock(req.body.toIncrementStock);
      }

      if(req.body.newProductToDisscountStock.length > 0) {
        console.log("NUEVO PRODUCTO PARA DESCONTAR STOCK") 
        await decrementarStock(req.body.newProductToDisscountStock);
      }


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

export const addArticlesMissed = async (req, res) => {
  const { orderId } = req.params;
  console.log("CUERPO DEL POST", req.body)

  try {
    const existingOrder = await Orders.findById(orderId);
    if (!existingOrder) {
      return res.status(404).json({ error: 'Orden no encontrada' });
    }

    console.log("LA ORDEN QUE ENCONTRE", existingOrder)

    existingOrder.missingArticlesData.push(req.body);
    const updatedOrder = await existingOrder.save();
    res.status(200).json(updatedOrder);

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al agregar nuevos productos a la orden' });
  }
};


export const updateMissingArticlesLikePaid = async (req, res) => { 
  const {orderId} = req.params;
  const {missedArticlesData} = req.body;
  
  try {
      const existingOrder = await Orders.findById(orderId);
      if (!existingOrder) {
        return res.status(404).json({ error: 'Orden no encontrada' });
      }
  
      const orderSearched = existingOrder.missingArticlesData.find(missed => missed.missedProductsData.missedArticlesReferenceId === missedArticlesData.missedArticlesReference);
      console.log("LA MISSED ARTICLES ENCONTRADA", orderSearched)
  
      if (!orderSearched) {
        return res.status(404).json({ error: 'Artículo perdido no encontrado' });
      } else { 
       console.log("LA MISSED ARTICLES ENCONTRADA", orderSearched)
      }
  
      orderSearched.missedProductsData.paid = missedArticlesData.newStatus;
  
      existingOrder.markModified('missingArticlesData');
  
      const updatedOrder = await existingOrder.save();
  
      res.status(200).json(updatedOrder);
  } catch (error) {
      console.error('Error:', error);
      res.status(500).json({ error: "Error interno del servidor" });
  }
 };



 export const createPdf = async (req, res) => {
  const { dataFormatedToList } = req.body;
  const doc = new PDFDocument();
  res.setHeader('Content-Type', 'application/pdf');
  res.setHeader('Content-Disposition', 'attachment; filename=archivo.pdf');
 
  doc.pipe(res);
  let yPosition = 50;
 
  dataFormatedToList.forEach((order, index) => {
    doc.font('Helvetica').fontSize(14).fillColor('green').text(`Direccion de Envio: ${order.DireccionDeEnvio}`, 50, yPosition);
    yPosition += 20;
    doc.font('Helvetica').fontSize(13).fillColor('black').text(`Cliente: ${order.Cliente}`, 50, yPosition);
    yPosition += 20;
    doc.font('Helvetica').fontSize(11).fillColor('black').text(`Numero de Orden: ${order.NumeroDeOrden}`, 50, yPosition);
    yPosition += 20;
    doc.font('Helvetica').fontSize(11).fillColor('black').text('Detalle de la Orden:', 50, yPosition);

     yPosition += 20;
     order.Detalle.forEach((product, productIndex) => {
       doc.fontSize(10).text(`Articulo: ${product.Articulo} - Cantidad: ${product.Cantidad}`, 50, yPosition, {
         lineGap: 10
       });
       yPosition += 20;
     });
 
     yPosition += 20;
  });
 
  doc.end();
 };
 

 export const deleteDownPaymentData = async (req, res) => {
  const { orderId } = req.params;

  console.log("req.params recibido", orderId)
  console.log("req.body.downPaymentReference recibido", req.body.downPaymentId)

  try {
     await Orders.updateOne({ _id: orderId }, { $set: { downPaymentData: [] } }); 
     await DownPayments.deleteOne({ downPaymentId: req.body.downPaymentId }); 
     await Collections.deleteOne({ downPaymentId:  req.body.downPaymentId}); 
 
     res.status(200).send({ message: 'Seña eliminado correctamente.' });
  } catch (error) {
     res.status(500).send({ message: 'Error al eliminar downPaymentData.', error });
  }
 };


 export const createDetailPdf = async (req, res) => {
  const { result } = req.body;
  console.log(result);

  const doc = new PDFDocument();
  res.setHeader('Content-Type', 'application/pdf');
  res.setHeader('Content-Disposition', `attachment; filename=detalle_${result.cliente}.pdf`);
  doc.pipe(res);

  let yPosition = 50;

  const pageWidth = doc.page.width;
  const pageHeight = doc.page.height;

  const imageWidth = 100; 
  const imageX = (pageWidth - imageWidth) / 2;

  const imageY = yPosition; 

  const imagePath = path.join(__dirname, '..', 'imagesApi', 'logo.png');
  doc.image(imagePath, imageX, imageY, { width: imageWidth }); 
  yPosition = imageY + 120; 


  doc.font('Helvetica-Bold').fontSize(15).fillColor('black').text(`${result.cliente}`, 50, yPosition);
  yPosition += 20;
  doc.font('Helvetica').fontSize(14).fillColor('black').text(`Total: ${result.total}`, 50, yPosition);
  yPosition += 40; 

  doc.font('Helvetica-Bold').fontSize(14).fillColor('black').text('Detalle de Articulos Alquilados:', 50, yPosition);
  yPosition += 30;
  doc.font('Helvetica').fontSize(13).fillColor('black').text('Articulo', 50, yPosition);
  doc.font('Helvetica').fontSize(13).fillColor('black').text('Cantidad', 200, yPosition);
  doc.font('Helvetica').fontSize(13).fillColor('black').text('Total', 350, yPosition);
  yPosition += 20;

  result.articles.forEach((article, index) => {
     doc.font('Helvetica').fontSize(12).fillColor('black').text(article.articulo, 50, yPosition);
     doc.font('Helvetica').fontSize(12).fillColor('black').text(article.cantidad.toString(), 200, yPosition);
     doc.font('Helvetica').fontSize(12).fillColor('black').text(formatePriceBackend(article.total).toString(), 350, yPosition);
     yPosition += 20;
  });

  doc.end();
};



export const nextFiveDaysOrdersWithDelivery = async (req, res) => {
  
  try {
    const currentDate = getCurrentDate();
    const futureDate = getFutureDate(5);

    const currentDateObj = new Date(currentDate);
    const futureDateObj = new Date(futureDate);

    const result = await Orders.find({
      dateOfDelivery: {
            $gte: currentDateObj.toISOString().split('T')[0],
            $lte: futureDateObj.toISOString().split('T')[0]
        }
    });

    res.status(200).json(result)
} catch (error) {
    console.error('Error obteniendo los documentos:', error);
}
 };


 export const nextFiveDaysOrdersConfirmed = async (req, res) => {
  
  try {
    const currentDate = getCurrentDate();
    const futureDate = getFutureDate(5);

    const currentDateObj = new Date(currentDate);
    const futureDateObj = new Date(futureDate);

    const result = await Orders.find({
      dateOfDelivery: {
            $gte: currentDateObj.toISOString().split('T')[0],
            $lte: futureDateObj.toISOString().split('T')[0]
        }
    });

    const filterResult = result.filter((res) => res.orderStatus === "Armado")

    res.status(200).json(filterResult)
} catch (error) {
    console.error('Error obteniendo los documentos:', error);
}
 };


 export const ordersAfterFiveDays = async (req, res) => {
  try {
    const futureDate = getFutureDate(5); // Obtener la fecha 5 días después de hoy

    const futureDateObj = new Date(futureDate);

    const result = await Orders.find({
      dateOfDelivery: {
        $gte: futureDateObj.toISOString().split('T')[0]
      }
    });

    const filterResult = result.filter((res) => res.orderStatus === "Armado");

    res.status(200).json(filterResult);
  } catch (error) {
    console.error('Error obteniendo los documentos:', error);
    res.status(500).json({ message: 'Error al obtener las órdenes' });
  }
};



export const getOrdersToBeConfirmed = async (req, res) => { 
    try {
      const orders = await Orders.find()
      const toBeConfirmed = orders.filter((ord) => ord.orderStatus === "A Confirmar")
      res.status(200).json(toBeConfirmed);
    } catch (error) {
      res.status(500).json({ error: 'Error al obtener las ordenes' });
      console.log(error)
    }
}